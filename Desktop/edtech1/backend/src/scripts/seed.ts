import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { User, Course, Lesson } from '../models';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    await connectDB();

    // Create instructor user
    const instructorPassword = await User.hashPassword('password123');
    const instructor = await User.create({
      email: 'instructor@engilearn.com',
      username: 'prof_arduino',
      passwordHash: instructorPassword,
      level: 15,
      totalXp: 22500,
      bio: 'Experienced Arduino and electronics instructor with 10+ years in embedded systems.',
      emailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    });

    console.log('✅ Created instructor user');

    // Create student user
    const studentPassword = await User.hashPassword('password123');
    const student = await User.create({
      email: 'alex@student.com',
      username: 'alex_engineer',
      passwordHash: studentPassword,
      level: 12,
      totalXp: 2847,
      streakCount: 7,
      bio: 'Engineering student passionate about Arduino and IoT',
      emailVerified: true,
      lastLogin: new Date()
    });

    console.log('✅ Created student user');

    // Create Arduino Foundations course
    const arduinoCourse = await Course.create({
      title: 'Arduino Foundations',
      description: 'Master Arduino programming from basics to advanced. Learn PWM, sensors, communication protocols, and build real-world projects.',
      difficulty: 'beginner',
      category: 'arduino',
      estimatedHours: 12.5,
      moduleCount: 6,
      coverImage: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?w=800',
      instructorId: instructor.id,
      isPublished: true,
      rating: 4.8,
      studentCount: 1247
    });

    console.log('✅ Created Arduino Foundations course');

    // Create lessons for Arduino course
    const arduinoLessons = [
      {
        title: 'Introduction to Arduino',
        content: {
          sections: [
            { type: 'text', content: 'Welcome to Arduino! In this lesson, you will learn the basics of Arduino microcontrollers.' },
            { type: 'heading', content: 'What is Arduino?' },
            { type: 'text', content: 'Arduino is an open-source electronics platform based on easy-to-use hardware and software.' },
            { type: 'code', language: 'cpp', content: '// Your first Arduino program\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}' }
          ]
        },
        duration: 15,
        xpReward: 50,
        lessonType: 'video' as const
      },
      {
        title: 'Digital I/O Basics',
        content: {
          sections: [
            { type: 'text', content: 'Learn how to read and write digital signals using Arduino pins.' },
            { type: 'heading', content: 'pinMode() Function' },
            { type: 'text', content: 'The pinMode() function configures a pin as INPUT or OUTPUT.' }
          ]
        },
        duration: 20,
        xpReward: 50,
        lessonType: 'video' as const
      },
      {
        title: 'PWM Control Basics',
        content: {
          sections: [
            { type: 'text', content: 'Pulse Width Modulation (PWM) allows you to control analog-like outputs using digital pins.' },
            { type: 'code', language: 'cpp', content: 'const int ledPin = 9;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  for (int brightness = 0; brightness <= 255; brightness++) {\n    analogWrite(ledPin, brightness);\n    delay(5);\n  }\n  for (int brightness = 255; brightness >= 0; brightness--) {\n    analogWrite(ledPin, brightness);\n    delay(5);\n  }\n}' }
          ]
        },
        duration: 25,
        xpReward: 75,
        lessonType: 'lab' as const
      },
      {
        title: 'Analog Input & Sensors',
        content: {
          sections: [
            { type: 'text', content: 'Read analog sensors using Arduino analog input pins.' }
          ]
        },
        duration: 30,
        xpReward: 75,
        lessonType: 'video' as const
      }
    ];

    for (let i = 0; i < arduinoLessons.length; i++) {
      await Lesson.create({
        courseId: arduinoCourse.id,
        orderNumber: i + 1,
        ...arduinoLessons[i]
      });
    }

    console.log(`✅ Created ${arduinoLessons.length} lessons for Arduino course`);

    // Create PCB Design course
    const pcbCourse = await Course.create({
      title: 'Advanced PCB Design',
      description: 'Learn professional PCB layout techniques, circuit design principles, and manufacturing considerations.',
      difficulty: 'intermediate',
      category: 'pcb-design',
      estimatedHours: 18,
      moduleCount: 8,
      coverImage: 'https://images.unsplash.com/photo-1640552421163-5a8e34827550?w=800',
      instructorId: instructor.id,
      isPublished: true,
      rating: 4.9,
      studentCount: 892
    });

    console.log('✅ Created PCB Design course');

    // Create Raspberry Pi course
    const rpiCourse = await Course.create({
      title: 'Raspberry Pi Projects',
      description: 'Build amazing projects with Raspberry Pi - from home automation to AI applications.',
      difficulty: 'intermediate',
      category: 'raspberry-pi',
      estimatedHours: 15,
      moduleCount: 7,
      coverImage: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?w=800',
      instructorId: instructor.id,
      isPublished: true,
      rating: 4.7,
      studentCount: 1056
    });

    console.log('✅ Created Raspberry Pi course');

    // Create Power Electronics course
    const powerCourse = await Course.create({
      title: 'Power Electronics Fundamentals',
      description: 'Understanding voltage regulation, power supplies, and energy efficiency in electronic circuits.',
      difficulty: 'advanced',
      category: 'power-electronics',
      estimatedHours: 20,
      moduleCount: 9,
      coverImage: 'https://images.unsplash.com/photo-1711610378090-779a7881a789?w=800',
      instructorId: instructor.id,
      isPublished: true,
      rating: 4.6,
      studentCount: 543
    });

    console.log('✅ Created Power Electronics course');

    // Create Embedded Systems course
    const embeddedCourse = await Course.create({
      title: 'Embedded Systems Engineering',
      description: 'Dive deep into embedded systems development with ARM Cortex, RTOS, and advanced communication protocols.',
      difficulty: 'advanced',
      category: 'embedded-systems',
      estimatedHours: 25,
      moduleCount: 12,
      coverImage: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?w=800',
      instructorId: instructor.id,
      isPublished: true,
      rating: 4.8,
      studentCount: 678
    });

    console.log('✅ Created Embedded Systems course');

    // Create Sensor Integration course
    const sensorCourse = await Course.create({
      title: 'Sensor Integration & IoT',
      description: 'Master sensor integration, data processing, and IoT connectivity for smart device development.',
      difficulty: 'intermediate',
      category: 'sensors',
      estimatedHours: 16,
      moduleCount: 8,
      coverImage: 'https://images.unsplash.com/photo-1711610378090-779a7881a789?w=800',
      instructorId: instructor.id,
      isPublished: true,
      rating: 4.7,
      studentCount: 834
    });

    console.log('✅ Created Sensor Integration course');

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📝 Test Credentials:');
    console.log('   Student:');
    console.log('     Email: alex@student.com');
    console.log('     Password: password123');
    console.log('');
    console.log('   Instructor:');
    console.log('     Email: instructor@engilearn.com');
    console.log('     Password: password123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
