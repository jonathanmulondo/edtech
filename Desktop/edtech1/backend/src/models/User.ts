import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  level: number;
  totalXp: number;
  streakCount: number;
  lastLogin?: Date;
  avatarUrl?: string;
  bio?: string;
  subscriptionTier: 'free' | 'pro' | 'lifetime';
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'level' | 'totalXp' | 'streakCount' | 'subscriptionTier' | 'emailVerified'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public username!: string;
  public passwordHash!: string;
  public level!: number;
  public totalXp!: number;
  public streakCount!: number;
  public lastLogin?: Date;
  public avatarUrl?: string;
  public bio?: string;
  public subscriptionTier!: 'free' | 'pro' | 'lifetime';
  public emailVerified!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  public toJSON() {
    const values = { ...this.get() } as any;
    delete values.passwordHash;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    totalXp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    streakCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    avatarUrl: {
      type: DataTypes.STRING(500)
    },
    bio: {
      type: DataTypes.TEXT
    },
    subscriptionTier: {
      type: DataTypes.STRING,
      defaultValue: 'free',
      validate: {
        isIn: [['free', 'pro', 'lifetime']]
      }
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
);

export default User;
