const mongoose = require('mongoose');

const isMongoConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-memory fallback dataset matching initial state
const inMemoryData = {
  users: [
    { id: 101, email: 'alex.johnson@university.edu', password: 'student123', role: 'STUDENT', name: 'Alex Johnson' },
    { id: 501, email: 's.jenkins@nexusai.com', password: 'recruiter123', role: 'RECRUITER', name: 'Sarah Jenkins' },
    { id: 1, email: 'admin@university.edu', password: 'admin123', role: 'ADMIN', name: 'Placement Officer' }
  ],
  studentProfile: {
    studentId: 101,
    rollNo: '2022CS1089',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 234-5678',
    program: 'B.Tech',
    branch: 'Computer Science & Engineering',
    cgpa: 8.92,
    passingYear: 2026,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Data Structures', 'SQL', 'Git', 'CSS3'],
    isVerified: true,
    status: 'VERIFIED',
    offers: 1,
    resume: {
      fileName: 'Alex_Johnson_Resume_2026.pdf',
      uploadDate: '2026-08-01',
      atsScore: 84,
      content: `ALEX JOHNSON\nSoftware Engineering Undergraduate | CGPA: 8.92\nEmail: alex.johnson@university.edu | Phone: +1 (555) 234-5678`
    },
    readinessBreakdown: {
      overall: 86,
      technical: 90,
      aptitude: 82,
      softSkills: 85,
      resumeQuality: 88
    }
  },
  studentsList: [
    { studentId: 101, rollNo: '2022CS1089', name: 'Alex Johnson', email: 'alex.johnson@university.edu', branch: 'Computer Science & Engineering', cgpa: 8.92, status: 'VERIFIED', offers: 1 },
    { studentId: 102, rollNo: '2022CS1044', name: 'Priya Sharma', email: 'priya.s@univ.edu', branch: 'Computer Science & Engineering', cgpa: 9.15, status: 'VERIFIED', offers: 2 },
    { studentId: 103, rollNo: '2022IT1012', name: 'Rohan Mehta', email: 'rohan.m@univ.edu', branch: 'Information Technology', cgpa: 8.10, status: 'VERIFIED', offers: 0 },
    { studentId: 104, rollNo: '2022ECE1055', name: 'Elena Rostova', email: 'elena.r@univ.edu', branch: 'Electronics & Communication', cgpa: 8.45, status: 'VERIFIED', offers: 1 },
    { studentId: 105, rollNo: '2022ME1003', name: 'David Miller', email: 'david.m@univ.edu', branch: 'Mechanical Engineering', cgpa: 7.65, status: 'PENDING', offers: 0 },
    { studentId: 106, rollNo: '2022EE1078', name: 'Samantha Wu', email: 'sam.w@univ.edu', branch: 'Electrical Engineering', cgpa: 8.80, status: 'VERIFIED', offers: 1 }
  ],
  jobs: [
    {
      id: 'JOB-2026-01',
      recruiterId: 501,
      companyName: 'Nexus AI Tech',
      title: 'Software Development Engineer - I',
      location: 'Hybrid (Bengaluru / Remote)',
      ctc: '16.5 LPA',
      minCgpa: 7.5,
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      skillsRequired: ['React', 'Node.js', 'Python', 'Data Structures'],
      description: 'Looking for sharp engineering grads to join our Core Product & AI Engineering team.',
      lastDate: '2026-08-30',
      status: 'APPROVED',
      postedDate: '2026-08-05'
    },
    {
      id: 'JOB-2026-02',
      recruiterId: 502,
      companyName: 'CyberPulse Dynamics',
      title: 'Associate Cloud & DevOps Engineer',
      location: 'On-site (Hyderabad)',
      ctc: '14.0 LPA',
      minCgpa: 8.0,
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
      skillsRequired: ['Docker', 'AWS', 'Linux', 'Python', 'CI/CD'],
      description: 'Join our cloud infrastructure team responsible for automating deployments.',
      lastDate: '2026-09-05',
      status: 'APPROVED',
      postedDate: '2026-08-08'
    },
    {
      id: 'JOB-2026-03',
      recruiterId: 503,
      companyName: 'Finovate Quantum Solutions',
      title: 'Graduate Quant & Data Analyst',
      location: 'On-site (Mumbai)',
      ctc: '18.0 LPA',
      minCgpa: 8.5,
      eligibleBranches: ['Computer Science & Engineering', 'Mathematics & Computing', 'Electrical Engineering'],
      skillsRequired: ['Python', 'SQL', 'Statistics', 'Financial Modeling'],
      description: 'Analyze large-scale financial time-series data and design algorithmic trading signals.',
      lastDate: '2026-09-12',
      status: 'APPROVED',
      postedDate: '2026-08-09'
    },
    {
      id: 'JOB-2026-04',
      recruiterId: 504,
      companyName: 'Starlight Interactive Systems',
      title: 'Frontend UI/UX Engineer',
      location: 'Remote',
      ctc: '12.5 LPA',
      minCgpa: 7.0,
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering'],
      skillsRequired: ['JavaScript', 'React', 'CSS3', 'Figma'],
      description: 'Design and create breathtaking web user interfaces.',
      lastDate: '2026-08-25',
      status: 'APPROVED',
      postedDate: '2026-08-02'
    },
    {
      id: 'JOB-2026-05',
      recruiterId: 505,
      companyName: 'Apex Micro Systems',
      title: 'Embedded Firmware Engineer',
      location: 'On-site (Pune)',
      ctc: '11.0 LPA',
      minCgpa: 7.0,
      eligibleBranches: ['Electronics & Communication', 'Electrical Engineering'],
      skillsRequired: ['C++', 'Embedded C', 'RTOS', 'Microcontrollers'],
      description: 'Develop low-level device drivers and real-time firmware.',
      lastDate: '2026-09-01',
      status: 'PENDING',
      postedDate: '2026-08-10'
    }
  ],
  applications: [
    {
      id: 'APP-1001',
      studentId: 101,
      studentName: 'Alex Johnson',
      rollNo: '2022CS1089',
      branch: 'Computer Science & Engineering',
      cgpa: 8.92,
      atsScore: 88,
      jobId: 'JOB-2026-01',
      jobTitle: 'Software Development Engineer - I',
      companyName: 'Nexus AI Tech',
      applyDate: '2026-08-06',
      status: 'INTERVIEW_SCHEDULED',
      interviewDetails: {
        date: '2026-08-15',
        time: '11:00 AM EST',
        mode: 'Virtual (Google Meet)',
        link: 'https://meet.google.com/xyz-placement-drive'
      }
    },
    {
      id: 'APP-1002',
      studentId: 101,
      studentName: 'Alex Johnson',
      rollNo: '2022CS1089',
      branch: 'Computer Science & Engineering',
      cgpa: 8.92,
      atsScore: 82,
      jobId: 'JOB-2026-02',
      jobTitle: 'Associate Cloud & DevOps Engineer',
      companyName: 'CyberPulse Dynamics',
      applyDate: '2026-08-08',
      status: 'SHORTLISTED'
    },
    {
      id: 'APP-1003',
      studentId: 101,
      studentName: 'Alex Johnson',
      rollNo: '2022CS1089',
      branch: 'Computer Science & Engineering',
      cgpa: 8.92,
      atsScore: 85,
      jobId: 'JOB-2026-04',
      jobTitle: 'Frontend UI/UX Engineer',
      companyName: 'Starlight Interactive Systems',
      applyDate: '2026-08-04',
      status: 'APPLIED'
    }
  ],
  targetRoles: [
    {
      id: 'fullstack',
      title: 'Full-Stack Software Engineer',
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'System Design', 'CI/CD', 'GraphQL'],
      avgSalary: '14.5 LPA'
    },
    {
      id: 'data_science',
      title: 'Data Scientist / AI Engineer',
      requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Visualization', 'Pandas', 'Statistics', 'Deep Learning'],
      avgSalary: '16.0 LPA'
    },
    {
      id: 'backend',
      title: 'Backend Systems Developer',
      requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka', 'System Design', 'Kubernetes'],
      avgSalary: '13.8 LPA'
    },
    {
      id: 'frontend',
      title: 'Frontend UI/UX Specialist',
      requiredSkills: ['JavaScript', 'React', 'CSS3', 'TypeScript', 'State Management', 'Web Performance', 'Accessibility (a11y)', 'Figma'],
      avgSalary: '12.0 LPA'
    }
  ],
  experiences: [
    {
      id: 'EXP-1',
      company: 'Nexus AI Tech',
      role: 'Software Development Engineer - I',
      author: 'Class of 2025 Alumni',
      rating: 4.8,
      difficulty: 'Medium-Hard',
      date: 'July 2025',
      rounds: [
        { title: 'Round 1: Online Coding Assessment', details: '3 DSA questions (Dynamic Programming, Graph Shortest Path, String Manipulation).' },
        { title: 'Round 2: Technical Interview 1', details: 'Deep dive into React virtual DOM, async JavaScript, and architecture design.' },
        { title: 'Round 3: System Design & Culture Fit', details: 'Discussed caching strategies (Redis) and database indexing.' }
      ],
      tips: 'Focus heavily on Tree traversals, System Design basics, and explain your thought process out loud.'
    }
  ],
  notifications: [
    {
      id: 'NOTIF-1',
      studentId: 101,
      title: 'Interview Scheduled!',
      message: 'Nexus AI Tech has scheduled your technical interview for Aug 15 at 11:00 AM.',
      type: 'INTERVIEW',
      date: '2026-08-09 14:30',
      isRead: false
    },
    {
      id: 'NOTIF-2',
      studentId: 101,
      title: 'Job Application Shortlisted',
      message: 'Your application for Associate Cloud & DevOps Engineer at CyberPulse Dynamics has been shortlisted!',
      type: 'APPLICATION',
      date: '2026-08-08 09:15',
      isRead: false
    }
  ]
};

module.exports = { isMongoConnected, inMemoryData };
