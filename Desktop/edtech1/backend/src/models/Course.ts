import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedHours: number;
  moduleCount: number;
  coverImage?: string;
  instructorId: string;
  isPublished: boolean;
  rating?: number;
  studentCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'isPublished' | 'rating' | 'studentCount'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public difficulty!: 'beginner' | 'intermediate' | 'advanced';
  public category!: string;
  public estimatedHours!: number;
  public moduleCount!: number;
  public coverImage?: string;
  public instructorId!: string;
  public isPublished!: boolean;
  public rating?: number;
  public studentCount?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['beginner', 'intermediate', 'advanced']]
      }
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    moduleCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coverImage: {
      type: DataTypes.STRING(500)
    },
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    studentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'courses',
    timestamps: true
  }
);

export default Course;
