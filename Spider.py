# main.py - FastAPI Application
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import List, Optional
import os
from dotenv import load_dotenv
import enum
from decimal import Decimal

load_dotenv()

# Database setup
# Retrieves the database URL from environment variables, with a default fallback.

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    # Fallback for local development
    SQLALCHEMY_DATABASE_URL = "postgresql://spidercontractors:spidercontractorslimited@localhost:5432/spiderdatabase"
    print("Using local database for development")
else:
    print("Using production database from environment variable")

# Debug print (remove in production)
print(f"Database URL starts with: {SQLALCHEMY_DATABASE_URL[:25]}...")

# Fix for Render's PostgreSQL URL format if needed
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Creates the SQLAlchemy engine.
engine = create_engine(SQLALCHEMY_DATABASE_URL)
# Creates a session factory for creating database sessions.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base class for declarative models.
Base = declarative_base()

# Enums for defining specific sets of values.
class UserRole(str, enum.Enum):
    """Defines user roles within the system."""
    SITE_WORKER = "site_worker"
    FINANCE = "finance"
    HEAD_OFFICE = "head_office"
    ADMIN = "admin"

class RequestStatus(str, enum.Enum):
    PENDING_FINANCE = "pending_finance"
    APPROVED_FINANCE = "approved_finance"
    REJECTED_FINANCE = "rejected_finance"
    PENDING_HEAD_OFFICE = "pending_head_office"
    APPROVED_HEAD_OFFICE = "approved_head_office"
    REJECTED_HEAD_OFFICE = "rejected_head_office"

# Database Models using SQLAlchemy ORM.
class Site(Base):
    """Represents a construction site."""
    __tablename__ = "sites"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    location = Column(String)
    project_manager = Column(String)
    budget_allocation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    requests = relationship("Request", back_populates="site")

class User(Base):
    """Represents a user of the system."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(Enum(UserRole))
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    site = relationship("Site")

class Request(Base):
    """Represents a request for materials or funds."""
    __tablename__ = "requests"
    
    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"))
    form_submission_id = Column(String)
    request_date = Column(DateTime)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING_FINANCE)
    total_amount = Column(String)
    finance_reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    finance_reviewed_at = Column(DateTime, nullable=True)
    finance_notes = Column(String, nullable=True)
    head_office_reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    head_office_reviewed_at = Column(DateTime, nullable=True)
    head_office_notes = Column(String, nullable=True)
    
    site = relationship("Site", back_populates="requests")
    items = relationship("RequestItem", back_populates="request")
    finance_reviewer = relationship("User", foreign_keys=[finance_reviewer_id])
    head_office_reviewer = relationship("User", foreign_keys=[head_office_reviewer_id])

class RequestItem(Base):
    """Represents an individual item within a request."""
    __tablename__ = "request_items"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"))
    item_name = Column(String)
    quantity = Column(String)
    unit_rate = Column(String)
    total_amount = Column(String)
    category = Column(String, nullable=True)
    
    request = relationship("Request", back_populates="items")

class CashFlow(Base):
    """Represents a cash flow transaction, typically after a request is approved."""
    __tablename__ = "cash_flow"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"))
    site_id = Column(Integer, ForeignKey("sites.id"))
    amount = Column(String)
    transaction_date = Column(DateTime)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models for request/response data validation and serialization.
class RequestItemCreate(BaseModel):
    """Pydantic model for creating a request item."""
    item_name: str
    quantity: float
    unit_rate: float
    category: Optional[str] = None

class GoogleFormSubmission(BaseModel):
    """Pydantic model for data received from a Google Form webhook."""
    submission_id: str
    timestamp: datetime
    site: str
    date: str
    items: List[RequestItemCreate]
    worker_name: str
    worker_contact: str
    notes: Optional[str] = None

class RequestReview(BaseModel):
    """Pydantic model for submitting a review for a request."""
    approved: bool
    notes: Optional[str] = None

class RequestResponse(BaseModel):
    """Pydantic model for the response when fetching requests."""
    id: int
    site_name: str
    request_date: datetime
    status: RequestStatus
    total_amount: float
    items: List[dict]
    
    class Config:
        from_attributes = True

# FastAPI App instance creation and configuration.
app = FastAPI(title="Construction Management API", version="1.0.0")

# CORS middleware to allow cross-origin requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # WARNING: Configure this for production environments.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get a database session for a request.
def get_db():
    """Dependency that provides a SQLAlchemy database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Creates all database tables defined as Base subclasses.
Base.metadata.create_all(bind=engine)

# API Routes
@app.post("/api/webhooks/google-forms")
async def receive_google_form(submission: GoogleFormSubmission, db: Session = Depends(get_db)):
    """
    Webhook endpoint to receive submissions from a Google Form.
    It creates a new request in the database based on the form data.
    """
    try:
        # Find the site mentioned in the submission.
        site = db.query(Site).filter(Site.name == submission.site).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")
        
        # Calculate the total amount from all items in the submission.
        total_amount = sum(item.quantity * item.unit_rate for item in submission.items)
        
        # Create a new Request record.
        request = Request(
            site_id=site.id,
            form_submission_id=submission.submission_id,
            request_date=datetime.strptime(submission.date, "%Y-%m-%d"),
            total_amount=str(total_amount),
            status=RequestStatus.PENDING_FINANCE
        )
        db.add(request)
        db.flush()  # Use flush to get the new request's ID before committing.
        
        # Create RequestItem records for each item in the submission.
        for item_data in submission.items:
            item = RequestItem(
                request_id=request.id,
                item_name=item_data.item_name,
                quantity=str(item_data.quantity),
                unit_rate=str(item_data.unit_rate),
                total_amount=str(item_data.quantity * item_data.unit_rate),
                category=item_data.category
            )
            db.add(item)
        
        db.commit()
        
        # Placeholder for sending a notification to the finance team.
        # TODO: Send notification to finance team
        
        return {"success": True, "request_id": request.id}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/requests", response_model=List[RequestResponse])
async def get_requests(
    status: Optional[RequestStatus] = None,
    site_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieves a list of requests, with optional filters for status and site ID.
    """
    query = db.query(Request).join(Site)
    
    # Apply filters if they are provided.
    if status:
        query = query.filter(Request.status == status)
    if site_id:
        query = query.filter(Request.site_id == site_id)
    
    requests = query.all()
    
    # Format the response using the RequestResponse Pydantic model.
    result = []
    for req in requests:
        items = [
            {
                "item_name": item.item_name,
                "quantity": float(item.quantity),
                "unit_rate": float(item.unit_rate),
                "total_amount": float(item.total_amount)
            }
            for item in req.items
        ]
        
        result.append(RequestResponse(
            id=req.id,
            site_name=req.site.name,
            request_date=req.request_date,
            status=req.status,
            total_amount=float(req.total_amount),
            items=items
        ))
    
    return result

@app.put("/api/requests/{request_id}/finance-review")
async def finance_review(
    request_id: int,
    review: RequestReview,
    db: Session = Depends(get_db)
):
    """
    Endpoint for the finance team to review a pending request.
    Updates the request's status based on the review.
    """
    request = db.query(Request).filter(Request.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if request.status != RequestStatus.PENDING_FINANCE:
        raise HTTPException(status_code=400, detail="Request not pending finance review")
    
    # Update request status and reviewer details.
    request.status = RequestStatus.APPROVED_FINANCE if review.approved else RequestStatus.REJECTED_FINANCE
    request.finance_reviewed_at = datetime.utcnow()
    request.finance_notes = review.notes
    # The reviewer ID would be set based on the authenticated user.
    # request.finance_reviewer_id = current_user.id  # Add auth later
    
    db.commit()
    
    # Placeholder for sending a notification if the request is approved.
    # TODO: Send notification to head office if approved
    
    return {"success": True, "status": request.status}

@app.put("/api/requests/{request_id}/head-office-review")
async def head_office_review(
    request_id: int,
    review: RequestReview,
    db: Session = Depends(get_db)
):
    """
    Endpoint for the head office to review a request approved by finance.
    Updates the request's status and creates a cash flow entry if approved.
    """
    request = db.query(Request).filter(Request.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if request.status != RequestStatus.PENDING_HEAD_OFFICE:
        raise HTTPException(status_code=400, detail="Request not pending head office review")
    
    # Update request status and reviewer details.
    request.status = RequestStatus.APPROVED_HEAD_OFFICE if review.approved else RequestStatus.REJECTED_HEAD_OFFICE
    request.head_office_reviewed_at = datetime.utcnow()
    request.head_office_notes = review.notes
    
    # If the request is approved, create a corresponding cash flow entry.
    if review.approved:
        cash_flow = CashFlow(
            request_id=request.id,
            site_id=request.site_id,
            amount=str(request.total_amount),
            transaction_date=datetime.utcnow(),
            description=f"Approved payment for {len(request.items)} items"
        )
        db.add(cash_flow)
    
    db.commit()
    
    return {"success": True, "status": request.status}

@app.get("/api/reports/daily-spending")
async def daily_spending_report(
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Generates a daily spending report for a given date.
    If no date is provided, it defaults to the current day.
    """
    target_date = datetime.strptime(date, "%Y-%m-%d").date() if date else datetime.utcnow().date()
    
    # Query for requests approved on the target date.
    approved_requests = db.query(Request).filter(
        Request.status == RequestStatus.APPROVED_HEAD_OFFICE,
        Request.head_office_reviewed_at >= target_date,
        Request.head_office_reviewed_at < target_date + timedelta(days=1)
    ).all()
    
    total_spent = sum(float(req.total_amount) for req in approved_requests)
    
    # Group spending by site for a detailed breakdown.
    site_breakdown = {}
    for req in approved_requests:
        site_name = req.site.name
        if site_name not in site_breakdown:
            site_breakdown[site_name] = {"amount": 0, "transactions": 0}
        
        site_breakdown[site_name]["amount"] += float(req.total_amount)
        site_breakdown[site_name]["transactions"] += 1
    
    return {
        "date": target_date.isoformat(),
        "total_spent": total_spent,
        "total_transactions": len(approved_requests),
        "site_breakdown": site_breakdown
    }

@app.get("/api/sites")
async def get_sites(db: Session = Depends(get_db)):
    """Retrieves a list of all construction sites."""
    sites = db.query(Site).all()
    return [
        {
            "id": site.id,
            "name": site.name,
            "location": site.location,
            "budget_allocation": float(site.budget_allocation) if site.budget_allocation else 0
        }
        for site in sites
    ]

# This block allows running the application directly using `python Spider.py`.
# Run with: uvicorn Spider:app --reload
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
