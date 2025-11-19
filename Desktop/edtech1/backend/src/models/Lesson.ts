import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface LessonAttributes {
  id: string;
  courseId: string;
  orderNumber: number;
  title: string;
  duration: number;
  content: any;
  videoUrl?: string;
  xpReward: number;
  lessonType: 'video' | 'reading' | 'quiz' | 'lab';
  createdAt?: Date;
  updatedAt?: Date;
}

interface LessonCreationAttributes extends Optional<LessonAttributes, 'id' | 'xpReward'> {}

class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  public id!: string;
  public courseId!: string;
  public orderNumber!: number;
  public title!: string;
  public duration!: number;
  public content!: any;
  public videoUrl?: string;
  public xpReward!: number;
  public lessonType!: 'video' | 'reading' | 'quiz' | 'lab';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lesson.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.STRING(500)
    },
    xpReward: {
      type: DataTypes.INTEGER,
      defaultValue: 50
    },
    lessonType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['video', 'reading', 'quiz', 'lab']]
      }
    }
  },
  {
    sequelize,
    tableName: 'lessons',
    timestamps: true
  }
);

export default Lesson;
