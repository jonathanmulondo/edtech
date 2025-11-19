import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProgressAttributes {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  timeSpent: number;
  lastAccessed?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProgressCreationAttributes extends Optional<ProgressAttributes, 'id' | 'status' | 'progressPercentage' | 'timeSpent'> {}

class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  public id!: string;
  public userId!: string;
  public lessonId!: string;
  public courseId!: string;
  public status!: 'not_started' | 'in_progress' | 'completed';
  public progressPercentage!: number;
  public timeSpent!: number;
  public lastAccessed?: Date;
  public completedAt?: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Progress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'not_started',
      validate: {
        isIn: [['not_started', 'in_progress', 'completed']]
      }
    },
    progressPercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastAccessed: {
      type: DataTypes.DATE
    },
    completedAt: {
      type: DataTypes.DATE
    },
    notes: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: 'user_progress',
    timestamps: true
  }
);

export default Progress;
