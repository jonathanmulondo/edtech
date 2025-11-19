import { User } from '../models';

const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 100,
  QUIZ_PASS: 50,
  DAILY_LOGIN: 10,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
  COURSE_COMPLETE: 200
};

export const calculateLevel = (totalXp: number): number => {
  return Math.floor(Math.sqrt(totalXp / 100));
};

export const xpForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel + 1, 2) * 100;
};

export const awardXp = async (userId: string, xpAmount: number): Promise<User> => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.totalXp += xpAmount;
  user.level = calculateLevel(user.totalXp);

  await user.save();

  console.log(`✨ Awarded ${xpAmount} XP to user ${userId}. Total XP: ${user.totalXp}, Level: ${user.level}`);

  return user;
};

export const updateStreak = async (userId: string): Promise<number> => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const lastLogin = user.lastLogin || new Date(0);
  const hoursSinceLastLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

  if (hoursSinceLastLogin < 24) {
    // Same day, no change
    return user.streakCount;
  } else if (hoursSinceLastLogin < 48) {
    // Next day, increment streak
    user.streakCount += 1;
    await awardXp(userId, XP_REWARDS.DAILY_LOGIN);

    // Check for streak milestones
    if (user.streakCount === 7) {
      await awardXp(userId, XP_REWARDS.STREAK_7_DAYS);
    } else if (user.streakCount === 30) {
      await awardXp(userId, XP_REWARDS.STREAK_30_DAYS);
    }
  } else {
    // Streak broken
    user.streakCount = 1;
  }

  user.lastLogin = now;
  await user.save();

  return user.streakCount;
};

export { XP_REWARDS };
