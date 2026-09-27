/**
 * Virtual Placement Cell Portal - Initial Data
 */

export const INITIAL_DATA = {
  // Current user session state
  isAuthenticated: false, // Set to true when user logs in
  currentUserRole: 'STUDENT', // 'STUDENT' | 'RECRUITER' | 'ADMIN'

  // Credentials are set dynamically via registration
  validCredentials: {},

  // Student Profile (blank — populated on registration/login)
  studentProfile: {
    id: null,
    rollNo: '',
    name: '',
    email: '',
    phone: '',
    program: 'B.Tech',
    branch: '',
    cgpa: null,
    passingYear: null,
    skills: [],
    isVerified: false,
    resume: {
      fileName: null,
      uploadDate: null,
      atsScore: 0,
      content: ''
    },
    readinessBreakdown: {
      overall: 0,
      technical: 0,
      aptitude: 0,
      softSkills: 0,
      resumeQuality: 0
    }
  },

  // Target roles for AI Skill Gap Analysis
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

  // Recruiter Profile (blank — populated on registration/login)
  recruiterProfile: {
    id: null,
    companyId: null,
    companyName: '',
    industry: '',
    contactPerson: '',
    email: '',
    mobile: '',
    location: '',
    website: '',
    description: ''
  },

  // Job Listings
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
      description: 'Looking for sharp engineering grads to join our Core Product & AI Engineering team. You will build high-throughput microservices and frontend dashboards.',
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
      description: 'Join our cloud infrastructure team responsible for automating deployments, monitoring cluster health, and securing cloud networks.',
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
      description: 'Analyze large-scale financial time-series data and design algorithmic trading signals for global equity markets.',
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
      description: 'Design and create breathtaking web user interfaces for our immersive web application platforms.',
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
      description: 'Develop low-level device drivers and real-time firmware for next-gen IoT automotive controllers.',
      lastDate: '2026-09-01',
      status: 'PENDING',
      postedDate: '2026-08-10'
    }
  ],

  // Student Applications
  applications: [],

  // Registered Students List (Admin view)
  studentsList: [],

  // Interview Experience Hub Data
  interviewExperiences: [],

  // Notifications List
  notifications: [],

  // Placement Analytics Data (Admin view)
  analytics: {
    totalStudents: 450,
    placedStudents: 382,
    placementRate: 84.8,
    avgPackage: '11.8 LPA',
    highestPackage: '44.0 LPA',
    totalCompaniesVisited: 68,
    activeDrives: 12,
    branchStats: [
      { branch: 'CSE', total: 140, placed: 132, rate: 94.2, avgCtc: 14.2 },
      { branch: 'IT', total: 90, placed: 82, rate: 91.1, avgCtc: 12.8 },
      { branch: 'ECE', total: 100, placed: 84, rate: 84.0, avgCtc: 10.5 },
      { branch: 'EE', total: 60, placed: 48, rate: 80.0, avgCtc: 9.2 },
      { branch: 'MECH', total: 60, placed: 36, rate: 60.0, avgCtc: 7.8 }
    ],
    salaryDistribution: [
      { tier: '< 6 LPA', count: 42, percentage: 11 },
      { tier: '6 - 10 LPA', count: 128, percentage: 33 },
      { tier: '10 - 18 LPA', count: 164, percentage: 43 },
      { tier: '> 18 LPA', count: 48, percentage: 13 }
    ]
  }
};
