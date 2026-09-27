/**
 * PlacementPulse - Bundled Single File Application (No CORS / Module Restrictions)
 * Optimized for file:// protocol direct double-click loading
 */
(function() {
  'use strict';

  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const htm = window.htm;
  if (!React || !ReactDOM || !htm) {
    console.error('PlacementPulse: React, ReactDOM, or HTM libraries failed to load.');
    return;
  }

  const { createContext, useContext, useState, useEffect, useRef } = React;
  const html = htm.bind(React.createElement);

// --- Source: data.js ---
/**
 * Virtual Placement Cell Portal - Initial Data
 */

const INITIAL_DATA = {
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


// --- Source: api.js ---
/**
 * PlacementPulse API Client Layer
 * Connects Frontend PortalContext & Store to backend REST API service (https://placement-pulse-chi.vercel.app/api)
 */

const API_BASE_URL = 'https://placement-pulse-chi.vercel.app/api';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    try {
      this.token = localStorage.getItem('vpc_jwt_token') || null;
    } catch (e) {
      this.token = null;
    }
  }

  setToken(token) {
    this.token = token;
    try {
      if (token) {
        localStorage.setItem('vpc_jwt_token', token);
      } else {
        localStorage.removeItem('vpc_jwt_token');
      }
    } catch (e) {
      console.warn('Could not save JWT token to localStorage');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || errorData.message || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[API Client] Network or endpoint failure on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // --- Health Check ---
  async checkHealth() {
    return this.request('/health');
  }

  // --- Auth ---
  async login(email, password, role) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // --- Students ---
  async getStudentProfile() {
    return this.request('/students/profile');
  }

  async updateStudentProfile(profileUpdates) {
    return this.request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profileUpdates)
    });
  }

  async uploadResume(content, fileName = 'Uploaded_Resume.pdf') {
    return this.request('/students/resume', {
      method: 'POST',
      body: JSON.stringify({ content, fileName })
    });
  }

  async listStudents() {
    return this.request('/students');
  }

  async verifyStudent(studentId, isVerified = true) {
    return this.request(`/students/${studentId}/verify?is_verified=${isVerified}`, {
      method: 'PATCH'
    });
  }

  // --- Jobs ---
  async listJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/jobs${query ? `?${query}` : ''}`;
    return this.request(endpoint);
  }

  async postJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  async approveJob(jobId, status = 'APPROVED') {
    return this.request(`/jobs/${jobId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // --- Applications ---
  async listApplications(studentId = null, jobId = null) {
    const params = {};
    if (studentId) params.student_id = studentId;
    if (jobId) params.job_id = jobId;
    const query = new URLSearchParams(params).toString();
    return this.request(`/applications${query ? `?${query}` : ''}`);
  }

  async applyForJob(jobId) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId })
    });
  }

  async updateApplicationStatus(appId, status, interviewDetails = null) {
    return this.request(`/applications/${appId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, interviewDetails })
    });
  }

  // --- ATS ---
  async analyzeATS(resumeText, targetRoleId = 'fullstack') {
    return this.request('/ats/analyze', {
      method: 'POST',
      body: JSON.stringify({ resumeText, targetRoleId })
    });
  }

  async getTargetRoles() {
    return this.request('/ats/target-roles');
  }

  // --- Interview Experiences ---
  async listExperiences() {
    return this.request('/experiences');
  }

  async addExperience(expData) {
    return this.request('/experiences', {
      method: 'POST',
      body: JSON.stringify(expData)
    });
  }

  // --- Notifications ---
  async getNotifications() {
    return this.request('/notifications');
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH'
    });
  }

  // --- Analytics ---
  async getAnalyticsDashboard() {
    return this.request('/analytics/dashboard');
  }
}

const api = new ApiClient();


// --- Source: atsEngine.js ---
/**
 * ATS Resume Checker & Heatmap Data Generator
 */

const ATS_KEYWORDS_DICTIONARY = {
  software: ['javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++', 'sql', 'git', 'data structures', 'algorithms', 'rest api', 'docker', 'mongodb', 'aws', 'html5', 'css3', 'microservices'],
  data: ['python', 'sql', 'pandas', 'numpy', 'machine learning', 'statistics', 'tableau', 'power bi', 'tensorflow', 'scikit-learn', 'deep learning', 'data visualization', 'r', 'excel'],
  devops: ['docker', 'kubernetes', 'aws', 'linux', 'bash', 'ci/cd', 'terraform', 'ansible', 'jenkins', 'git', 'prometheus', 'grafana', 'python']
};

function analyzeResume(resumeText, targetRoleCategory = 'software') {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      atsScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      sectionScores: { contact: 0, summary: 0, education: 0, skills: 0, experience: 0, projects: 0 },
      heatmapData: []
    };
  }

  const textLower = resumeText.toLowerCase();
  const targetKeywords = ATS_KEYWORDS_DICTIONARY[targetRoleCategory] || ATS_KEYWORDS_DICTIONARY.software;

  const matchedKeywords = [];
  const missingKeywords = [];

  targetKeywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Section Checkers
  const hasContact = /email|phone|github|linkedin|contact/i.test(resumeText);
  const hasSummary = /summary|profile|about me|objective/i.test(resumeText);
  const hasEducation = /education|b\.tech|degree|cgpa|university|college/i.test(resumeText);
  const hasSkills = /skills|technologies|programming|languages|tools/i.test(resumeText);
  const hasExperience = /experience|intern|internship|work|employment/i.test(resumeText);
  const hasProjects = /project|built|developed|created/i.test(resumeText);

  const sectionScores = {
    contact: hasContact ? 100 : 30,
    summary: hasSummary ? 100 : 50,
    education: hasEducation ? 100 : 40,
    skills: hasSkills ? 100 : 40,
    experience: hasExperience ? 100 : 50,
    projects: hasProjects ? 100 : 40
  };

  const keywordRatio = matchedKeywords.length / targetKeywords.length;
  const sectionRatio = (Object.values(sectionScores).reduce((a, b) => a + b, 0) / 600);

  const atsScore = Math.min(98, Math.round((keywordRatio * 0.6 + sectionRatio * 0.4) * 100));

  // Generate line-by-line heatmap intensity
  const lines = resumeText.split('\n');
  const heatmapLines = lines.map((line, idx) => {
    const lineLower = line.toLowerCase();
    let hitCount = 0;
    targetKeywords.forEach(kw => {
      if (lineLower.includes(kw.toLowerCase())) hitCount++;
    });

    let intensity = 'low'; // 'high', 'medium', 'low', 'heading'
    if (/^[A-Z\s]{4,25}$/.test(line.trim()) || /summary|education|skills|projects|experience|certifications/i.test(line)) {
      intensity = 'heading';
    } else if (hitCount >= 2) {
      intensity = 'high';
    } else if (hitCount === 1 || hitCount > 0) {
      intensity = 'medium';
    }

    return {
      lineNumber: idx + 1,
      text: line,
      hitCount,
      intensity
    };
  });

  return {
    atsScore,
    matchedKeywords,
    missingKeywords,
    sectionScores,
    heatmapLines
  };
}


// --- Source: charts.js ---
/**
 * SVG Chart Generators for Placement Analytics
 */

function renderBranchBarChart(containerId, branchData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const maxRate = 100;
  
  let barsHTML = branchData.map(b => {
    const heightPercent = (b.rate / maxRate) * 100;
    return `
      <div class="chart-bar-group">
        <div class="chart-bar-value">${b.rate}%</div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="height: ${heightPercent}%;"></div>
        </div>
        <div class="chart-bar-label">${b.branch}</div>
        <div class="chart-bar-sub">${b.placed}/${b.total}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="bar-chart-wrapper">
      <div class="chart-title-area">
        <h4>Branch-wise Placement Statistics (Batch 2026)</h4>
        <span class="badge badge-success">Overall 84.8% Placed</span>
      </div>
      <div class="bar-chart-grid">
        ${barsHTML}
      </div>
    </div>
  `;
}

function renderSalaryDonutChart(containerId, salaryData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render visual donut segments and legend
  const totalCount = salaryData.reduce((acc, curr) => acc + curr.count, 0);

  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

  let legendHTML = salaryData.map((s, idx) => `
    <div class="donut-legend-item">
      <span class="legend-color" style="background: ${colors[idx % colors.length]}"></span>
      <div class="legend-info">
        <span class="legend-tier">${s.tier}</span>
        <span class="legend-count">${s.count} Students (${s.percentage}%)</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="donut-chart-card">
      <h4>Salary Package Distribution (CTC)</h4>
      <div class="donut-content">
        <div class="donut-visual">
          <svg viewBox="0 0 100 100" class="donut-svg">
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="14"></circle>
            <!-- SVG stroke dasharray representation -->
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#6366f1" stroke-width="14" stroke-dasharray="26 213" stroke-dashoffset="0"></circle>
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" stroke-width="14" stroke-dasharray="79 160" stroke-dashoffset="-26"></circle>
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" stroke-width="14" stroke-dasharray="102 137" stroke-dashoffset="-105"></circle>
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" stroke-width="14" stroke-dasharray="31 208" stroke-dashoffset="-207"></circle>
          </svg>
          <div class="donut-center-text">
            <span class="center-val">${totalCount}</span>
            <span class="center-lbl">Offers</span>
          </div>
        </div>
        <div class="donut-legend">
          ${legendHTML}
        </div>
      </div>
    </div>
  `;
}


// --- Source: heatmapRenderer.js ---
/**
 * Canvas & DOM Resume Heatmap Visualizer
 */

function renderResumeHeatmap(containerElement, heatmapLines) {
  if (!containerElement) return;

  containerElement.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'heatmap-wrapper-card';

  const header = document.createElement('div');
  header.className = 'heatmap-header';
  header.innerHTML = `
    <div class="heatmap-title">
      <span class="pulse-dot"></span> ATS Visual Scanner & Keyword Heatmap
    </div>
    <div class="heatmap-legend">
      <span class="legend-item high"><span class="color-box high"></span> Target Keywords Match</span>
      <span class="legend-item medium"><span class="color-box medium"></span> Moderate Match</span>
      <span class="legend-item heading"><span class="color-box heading"></span> Section Header</span>
      <span class="legend-item low"><span class="color-box low"></span> Standard Text</span>
    </div>
  `;

  const paper = document.createElement('div');
  paper.className = 'heatmap-paper';

  const scannerLine = document.createElement('div');
  scannerLine.className = 'ats-scanner-laser';
  paper.appendChild(scannerLine);

  heatmapLines.forEach(lineObj => {
    const lineRow = document.createElement('div');
    lineRow.className = `heatmap-line-row ${lineObj.intensity}`;
    
    const numBadge = document.createElement('span');
    numBadge.className = 'line-num';
    numBadge.textContent = lineObj.lineNumber;

    const contentSpan = document.createElement('span');
    contentSpan.className = 'line-text';
    contentSpan.textContent = lineObj.text || ' ';

    lineRow.appendChild(numBadge);
    lineRow.appendChild(contentSpan);

    if (lineObj.hitCount > 0) {
      const matchBadge = document.createElement('span');
      matchBadge.className = 'match-tag';
      matchBadge.textContent = `+${lineObj.hitCount} kw`;
      lineRow.appendChild(matchBadge);
    }

    paper.appendChild(lineRow);
  });

  wrapper.appendChild(header);
  wrapper.appendChild(paper);
  containerElement.appendChild(wrapper);
}


// --- Source: mockInterviewEngine.js ---
/**
 * AI Mock Interview Simulator Engine
 */

const MOCK_INTERVIEW_DOMAINS = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: '⚡',
    questions: [
      {
        id: 'q1',
        question: 'Explain how a Hash Table works internally. How do you handle collisions?',
        keywords: ['hash function', 'buckets', 'chaining', 'open addressing', 'linear probing', 'O(1)', 'time complexity'],
        hint: 'Mention key concepts like Hash Functions, Bucket Arrays, Chaining (Linked Lists), and Open Addressing.'
      },
      {
        id: 'q2',
        question: 'What is the difference between Depth First Search (DFS) and Breadth First Search (BFS)? When would you use BFS over DFS?',
        keywords: ['stack', 'queue', 'level order', 'shortest path', 'recursion', 'unweighted graph'],
        hint: 'Compare Queue vs Stack usage, and mention BFS is ideal for finding shortest path in unweighted graphs.'
      }
    ]
  },
  {
    id: 'web',
    name: 'Frontend & Web Development',
    icon: '🌐',
    questions: [
      {
        id: 'q3',
        question: 'What is the Event Loop in JavaScript? Explain Call Stack, Web APIs, and Task Queue.',
        keywords: ['call stack', 'event loop', 'callback queue', 'microtask', 'promises', 'non-blocking', 'single threaded'],
        hint: 'Describe single-threaded execution, non-blocking I/O, Call Stack, Callback Queue, and Promise microtasks.'
      },
      {
        id: 'q4',
        question: 'Explain Virtual DOM in React and how Reconciliation works.',
        keywords: ['diffing algorithm', 'virtual dom', 'render', 'state change', 're-render', 'performance'],
        hint: 'Explain in-memory lightweight representation, state updates, and React diffing algorithm.'
      }
    ]
  },
  {
    id: 'system_design',
    name: 'System Design & High Availability',
    icon: '⚙️',
    questions: [
      {
        id: 'q5',
        question: 'How would you design a Scalable URL Shortener service (like bit.ly)?',
        keywords: ['base62', 'hashing', 'cache', 'redis', 'database', 'load balancer', 'uuid', 'redirect'],
        hint: 'Cover API endpoints, Base62 encoding, Redis caching layer, Database schema, and Load Balancer.'
      }
    ]
  }
];

function evaluateAnswer(questionObj, userResponse) {
  if (!userResponse || userResponse.trim().length < 10) {
    return {
      score: 30,
      grade: 'Needs Improvement',
      matchedKeywords: [],
      missingKeywords: questionObj.keywords,
      feedback: 'Your answer is too short. Try to elaborate on technical details and provide concrete examples.'
    };
  }

  const textLower = userResponse.toLowerCase();
  const matched = [];
  const missing = [];

  questionObj.keywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase())) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const keywordCoverage = matched.length / questionObj.keywords.length;
  const lengthBonus = Math.min(20, Math.round(userResponse.split(' ').length / 5));

  const rawScore = Math.round(keywordCoverage * 75 + lengthBonus);
  const finalScore = Math.max(45, Math.min(96, rawScore));

  let grade = 'Satisfactory';
  let feedback = 'Good attempt! You covered some key points, but can improve by adding more terminology.';

  if (finalScore >= 85) {
    grade = 'Excellent / Highly Recommended';
    feedback = 'Outstanding response! You demonstrated strong technical depth, clear communication, and relevant keywords.';
  } else if (finalScore >= 70) {
    grade = 'Strong Answer';
    feedback = 'Well structured answer. Mentioning additional concepts like ' + missing.slice(0, 2).join(', ') + ' will make it even stronger.';
  }

  return {
    score: finalScore,
    grade,
    matchedKeywords: matched,
    missingKeywords: missing,
    feedback
  };
}

function speakQuestion(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}


// --- Source: PortalContext.js ---


const STORAGE_KEY = 'vpc_portal_state_v1';

const PortalContext = createContext(null);

function PortalProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { isBackendConnected: false, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not parse saved portal state, loading defaults.', e);
    }
    return { isBackendConnected: false, ...JSON.parse(JSON.stringify(INITIAL_DATA)) };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Sync state with backend REST API if server is reachable
  useEffect(() => {
    let isMounted = true;
    async function syncBackendData() {
      try {
        const health = await api.checkHealth();
        if (health && (health.status === 'ok' || health.status === 'healthy') && isMounted) {
          console.log('[PortalContext] Connected to PlacementPulse REST API Backend!');
          
          const [jobs, applications, notifications, analytics, studentProfile, experiences] = await Promise.all([
            api.listJobs().catch(() => null),
            api.listApplications().catch(() => null),
            api.getNotifications().catch(() => null),
            api.getAnalyticsDashboard().catch(() => null),
            api.getStudentProfile().catch(() => null),
            api.listExperiences().catch(() => null)
          ]);

          if (isMounted) {
            setState(prev => ({
              ...prev,
              isBackendConnected: true,
              ...(jobs ? { jobs } : {}),
              ...(applications ? { applications } : {}),
              ...(notifications ? { notifications } : {}),
              ...(analytics ? { analytics } : {}),
              ...(studentProfile ? { studentProfile } : {}),
              ...(experiences ? { interviewExperiences: experiences } : {})
            }));
          }
        }
      } catch (err) {
        if (isMounted) {
          console.info('[PortalContext] Running in offline/standalone mode (Backend server not connected yet).');
          setState(prev => ({ ...prev, isBackendConnected: false }));
        }
      }
    }

    syncBackendData();
  }, []);

  const setRole = (role) => {
    setState(prev => ({ ...prev, currentUserRole: role }));
  };

  const login = async (email, password, role) => {
    if (!email || !password) {
      return { success: false, message: 'Please provide both email address and password.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please enter a valid email address format (e.g. user@univ.edu).' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    // Try backend authentication first
    try {
      const res = await api.login(email, password, role);
      if (res && (res.token || res.success)) {
        if (res.token) api.setToken(res.token);
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          currentUserRole: res.user?.role || role,
          isBackendConnected: true,
          ...(res.profile ? (role === 'STUDENT' ? { studentProfile: res.profile } : { recruiterProfile: res.profile }) : {})
        }));
        return { success: true, message: 'Login successful via Backend API!' };
      }
    } catch (err) {
      console.warn('[Login] Backend auth fallback to local credentials check:', err.message);
    }

    // Local fallback check
    const creds = state.validCredentials[role];
    if (creds && email.toLowerCase() === creds.email.toLowerCase() && password === creds.password) {
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        currentUserRole: role
      }));
      return { success: true, message: 'Login successful!' };
    }

    return { 
      success: false, 
      message: `Invalid credentials for ${role} role. Please check your email and password.` 
    };
  };

  const logout = () => {
    api.setToken(null);
    setState(prev => ({ ...prev, isAuthenticated: false }));
  };

  const register = async (userData) => {
    const { email, password, name, role, branch, cgpa } = userData;
    if (!email || !password || !name) {
      return { success: false, message: 'Please fill in all required registration fields.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    // Async backend call
    try {
      const res = await api.register(userData);
      if (res && res.token) {
        api.setToken(res.token);
      }
    } catch (err) {
      console.warn('[Register] Backend registration warning:', err.message);
    }

    setState(prev => {
      const nextCreds = { ...prev.validCredentials, [role]: { email, password } };
      const nextStudent = { ...prev.studentProfile };
      const nextRecruiter = { ...prev.recruiterProfile };

      if (role === 'STUDENT') {
        nextStudent.name = name;
        nextStudent.email = email;
        if (branch) nextStudent.branch = branch;
        if (cgpa) nextStudent.cgpa = parseFloat(cgpa);
      } else if (role === 'RECRUITER') {
        nextRecruiter.companyName = name;
        nextRecruiter.email = email;
      }

      return {
        ...prev,
        validCredentials: nextCreds,
        studentProfile: nextStudent,
        recruiterProfile: nextRecruiter,
        isAuthenticated: true,
        currentUserRole: role
      };
    });

    return { success: true, message: 'Registration successful! Logged in as ' + name };
  };

  const updateStudentProfile = async (profileUpdates) => {
    try {
      await api.updateStudentProfile(profileUpdates);
    } catch (err) {
      console.warn('[UpdateProfile] Backend update warning:', err.message);
    }

    setState(prev => ({
      ...prev,
      studentProfile: { ...prev.studentProfile, ...profileUpdates }
    }));
  };

  const calculateAtsScore = (text) => {
    if (!text || text.trim().length === 0) return 0;
    const coreKeywords = ['react', 'javascript', 'python', 'node', 'sql', 'git', 'data structures', 'algorithms', 'project', 'experience', 'education', 'cgpa', 'full-stack', 'developer', 'aws'];
    const lower = text.toLowerCase();
    let matches = 0;
    coreKeywords.forEach(kw => {
      if (lower.includes(kw)) matches++;
    });
    const baseScore = Math.min(95, Math.round((matches / coreKeywords.length) * 100));
    return Math.max(45, baseScore);
  };

  const updateResumeContent = async (newContent, newFileName = 'Uploaded_Resume.pdf') => {
    let score = calculateAtsScore(newContent);
    
    try {
      const res = await api.uploadResume(newContent, newFileName);
      if (res) {
        if (res.atsAnalysis && typeof res.atsAnalysis.score === 'number') {
          score = res.atsAnalysis.score;
        } else if (res.atsResult && typeof res.atsResult.atsScore === 'number') {
          score = res.atsResult.atsScore;
        } else if (res.resume && typeof res.resume.atsScore === 'number') {
          score = res.resume.atsScore;
        }
      }
    } catch (err) {
      console.warn('[Resume] Backend ATS score warning:', err.message);
    }

    setState(prev => {
      const nextStudent = { ...prev.studentProfile };
      nextStudent.resume = {
        fileName: newFileName,
        uploadDate: new Date().toISOString().split('T')[0],
        atsScore: score,
        content: newContent
      };
      nextStudent.readinessBreakdown = {
        ...nextStudent.readinessBreakdown,
        resumeQuality: Math.min(100, score + 5),
        overall: Math.round(
          (nextStudent.readinessBreakdown.technical +
            nextStudent.readinessBreakdown.aptitude +
            nextStudent.readinessBreakdown.softSkills +
            score) / 4
        )
      };
      return { ...prev, studentProfile: nextStudent };
    });
    return score;
  };

  const applyForJob = async (jobId) => {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return false;

    const existing = state.applications.find(
      a => a.studentId === state.studentProfile.id && a.jobId === jobId
    );
    if (existing) return false;

    try {
      await api.applyForJob(jobId);
    } catch (err) {
      console.warn('[ApplyJob] Backend apply warning:', err.message);
    }

    const newApp = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      studentId: state.studentProfile.id,
      studentName: state.studentProfile.name,
      rollNo: state.studentProfile.rollNo,
      branch: state.studentProfile.branch,
      cgpa: state.studentProfile.cgpa,
      atsScore: state.studentProfile.resume.atsScore || 84,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      applyDate: new Date().toISOString().split('T')[0],
      status: 'APPLIED'
    };

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'Application Submitted',
      message: `You successfully applied for ${job.title} at ${job.companyName}.`,
      type: 'APPLICATION',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false
    };

    setState(prev => ({
      ...prev,
      applications: [newApp, ...prev.applications],
      notifications: [newNotif, ...prev.notifications]
    }));

    return true;
  };

  const updateApplicationStatus = async (appId, newStatus, interviewDetails = null) => {
    try {
      await api.updateApplicationStatus(appId, newStatus, interviewDetails);
    } catch (err) {
      console.warn('[UpdateAppStatus] Backend status update warning:', err.message);
    }

    setState(prev => {
      const nextApps = prev.applications.map(app => {
        if (app.id === appId) {
          const updated = { ...app, status: newStatus };
          if (interviewDetails) updated.interviewDetails = interviewDetails;
          return updated;
        }
        return app;
      });

      const targetApp = prev.applications.find(a => a.id === appId);
      const newNotif = targetApp ? {
        id: `NOTIF-${Date.now()}`,
        title: `Application Status Updated: ${newStatus.replace('_', ' ')}`,
        message: `Your application for ${targetApp.jobTitle} at ${targetApp.companyName} is now ${newStatus.replace('_', ' ')}.`,
        type: 'STATUS',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isRead: false
      } : null;

      return {
        ...prev,
        applications: nextApps,
        notifications: newNotif ? [newNotif, ...prev.notifications] : prev.notifications
      };
    });
  };

  const postNewJob = async (jobData) => {
    try {
      const res = await api.postJob(jobData);
      if (res && res.job) {
        setState(prev => ({
          ...prev,
          jobs: [res.job, ...prev.jobs]
        }));
        return res.job;
      }
    } catch (err) {
      console.warn('[PostJob] Backend job posting warning:', err.message);
    }

    const newJob = {
      id: `JOB-${new Date().getFullYear()}-${(state.jobs.length + 1).toString().padStart(2, '0')}`,
      recruiterId: state.recruiterProfile.id,
      companyName: state.recruiterProfile.companyName,
      ...jobData,
      status: 'PENDING',
      postedDate: new Date().toISOString().split('T')[0]
    };

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Job Pending Approval',
      message: `Recruiter ${state.recruiterProfile.companyName} submitted a job: ${jobData.title}`,
      type: 'JOB',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false
    };

    setState(prev => ({
      ...prev,
      jobs: [newJob, ...prev.jobs],
      notifications: [newNotif, ...prev.notifications]
    }));

    return newJob;
  };

  const approveJob = async (jobId, status = 'APPROVED') => {
    try {
      await api.approveJob(jobId, status);
    } catch (err) {
      console.warn('[ApproveJob] Backend job approval warning:', err.message);
    }

    setState(prev => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === jobId ? { ...j, status } : j)
    }));
  };

  const verifyStudent = async (studentId, isVerified) => {
    try {
      await api.verifyStudent(studentId, isVerified);
    } catch (err) {
      console.warn('[VerifyStudent] Backend verification warning:', err.message);
    }

    setState(prev => ({
      ...prev,
      studentsList: prev.studentsList.map(st => st.id === studentId ? { ...st, status: isVerified ? 'VERIFIED' : 'PENDING' } : st)
    }));
  };

  const addInterviewExperience = async (expData) => {
    try {
      await api.addExperience(expData);
    } catch (err) {
      console.warn('[AddExperience] Backend experience posting warning:', err.message);
    }

    const newExp = {
      id: `EXP-${Date.now()}`,
      ...expData,
      date: 'Just Now'
    };
    setState(prev => ({
      ...prev,
      interviewExperiences: [newExp, ...prev.interviewExperiences]
    }));
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      console.warn('[MarkNotifs] Backend notification mark warning:', err.message);
    }

    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, isRead: true }))
    }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(JSON.parse(JSON.stringify(INITIAL_DATA)));
  };

  const value = {
    state,
    setRole,
    login,
    logout,
    register,
    updateStudentProfile,
    updateResumeContent,
    calculateAtsScore,
    applyForJob,
    updateApplicationStatus,
    postNewJob,
    approveJob,
    verifyStudent,
    addInterviewExperience,
    markAllNotificationsRead,
    resetDemoData
  };

  return html`<${PortalContext.Provider} value=${value}>${children}<//>`;
}

function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}


// --- Source: Header.js ---



function Header() {
  const { state, markAllNotificationsRead, logout } = usePortal();
  const [showNotifs, setShowNotifs] = useState(false);

  const currentRole = state.currentUserRole;
  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return html`
    <header className="app-header">
      <div className="header-left">
        <div className="brand-logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">PlacementPulse</span>
            <span className="brand-tag">Virtual Placement Cell Portal</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className=${`active-portal-badge ${currentRole.toLowerCase()}`}>
          <span className="portal-badge-icon">
            ${currentRole === 'STUDENT' ? '🎓' : currentRole === 'RECRUITER' ? '🏢' : '🛡️'}
          </span>
          <span className="portal-badge-text">
            ${currentRole === 'STUDENT' ? 'Student Career Portal' : currentRole === 'RECRUITER' ? 'Recruiter Dashboard' : 'Placement Officer Admin'}
          </span>
        </div>
      </div>

      <div className="header-right">
        <div className="notif-wrapper">
          <button 
            className="notif-bell-btn" 
            onClick=${() => setShowNotifs(!showNotifs)}
            title="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            ${unreadCount > 0 && html`<span className="notif-badge-count">${unreadCount}</span>`}
          </button>

          ${showNotifs && html`
            <div className="notif-dropdown">
              <div className="notif-header">
                <h5>Notifications (${unreadCount} New)</h5>
                <button className="text-btn" onClick=${markAllNotificationsRead}>Mark All Read</button>
              </div>
              <div className="notif-list">
                ${state.notifications.length === 0 ? html`<div className="empty-notif">No notifications</div>` : null}
                ${state.notifications.map(n => html`
                  <div key=${n.id} className=${`notif-item ${n.isRead ? 'read' : 'unread'}`}>
                    <div className=${`notif-icon-box ${n.type}`}>
                      ${n.type === 'INTERVIEW' ? '📅' : n.type === 'APPLICATION' ? '📋' : '📢'}
                    </div>
                    <div className="notif-content">
                      <span className="notif-title">${n.title}</span>
                      <p className="notif-msg">${n.message}</p>
                      <span className="notif-time">${n.date}</span>
                    </div>
                  </div>
                `)}
              </div>
            </div>
          `}
        </div>

        <div className="user-profile-pill">
          <div className="user-avatar">
            ${currentRole === 'STUDENT' ? 'AJ' : currentRole === 'RECRUITER' ? 'NA' : 'PO'}
          </div>
          <div className="user-meta">
            <span className="user-name">
              ${currentRole === 'STUDENT' ? state.studentProfile.name : currentRole === 'RECRUITER' ? state.recruiterProfile.companyName : 'Dr. M. Sharma'}
            </span>
            <span className=${`user-role-badge ${currentRole.toLowerCase()}`}>
              ${currentRole.replace('_', ' ')}
            </span>
          </div>
        </div>

        <button 
          className="btn-logout" 
          onClick=${handleLogout} 
          title="Sign Out"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </header>

  `;
}


// --- Source: Footer.js ---



function Footer() {
  return html`
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span>© 2026 <strong>PlacementPulse</strong></span>
          <span className="dot-sep">•</span>
          <span>Virtual Placement Cell Portal</span>
        </div>
        <div className="footer-links">
          <a href="#help">Help & Support</a>
          <span className="dot-sep">•</span>
          <a href="#privacy">Privacy Policy</a>
          <span className="dot-sep">•</span>
          <a href="#contact">Contact Us</a>
        </div>
      </div>
    </footer>
  `;
}



// --- Source: AnalyticsCharts.js ---



function AnalyticsCharts({ branchStats, salaryDistribution }) {
  const barContainerRef = useRef(null);
  const donutContainerRef = useRef(null);

  useEffect(() => {
    if (barContainerRef.current) {
      barContainerRef.current.id = 'chart-branch-bar-container';
      renderBranchBarChart('chart-branch-bar-container', branchStats);
    }
    if (donutContainerRef.current) {
      donutContainerRef.current.id = 'chart-salary-donut-container';
      renderSalaryDonutChart('chart-salary-donut-container', salaryDistribution);
    }
  }, [branchStats, salaryDistribution]);

  return html`
    <div className="content-row mt-4">
      <div className="card card-flex-1">
        <div className="card-body">
          <div ref=${barContainerRef}></div>
        </div>
      </div>
      <div className="card card-flex-1">
        <div className="card-body">
          <div ref=${donutContainerRef}></div>
        </div>
      </div>
    </div>
  `;
}


// --- Source: AtsChecker.js ---



function AtsChecker({ isHeatmapOnly = false }) {
  const { state } = usePortal();
  const student = state.studentProfile;
  const heatmapContainerRef = useRef(null);

  const analysis = analyzeResume(student.resume.content, 'software');

  useEffect(() => {
    if (heatmapContainerRef.current) {
      renderResumeHeatmap(heatmapContainerRef.current, analysis.heatmapLines);
    }
  }, [student.resume.content]);

  if (isHeatmapOnly) {
    return html`
      <div className="tab-pane animate-fade-in">
        <div className="page-title-bar">
          <h2>Resume Visual Heatmap</h2>
          <p>Interactive visualization showing section formatting density, target keyword highlights, and scanner line.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Interactive Keyword & Density Heatmap</h3>
          </div>
          <div className="card-body">
            <div ref=${heatmapContainerRef}></div>
          </div>
        </div>
      </div>
    `;
  }

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>ATS Resume Checker</h2>
        <p>Analyze how Applicant Tracking Systems (ATS) score your resume against target tech keywords.</p>
      </div>

      <div className="card max-w-2xl">
        <div className="card-header">
          <h3>ATS Analysis Scorecard</h3>
          <span className=${`score-pill-lg ${analysis.atsScore >= 80 ? 'high' : 'med'}`}>
            ${analysis.atsScore} / 100
          </span>
        </div>
        <div className="card-body">
          <div className="section-check-list mb-4">
            <h4>Section Format Checklist</h4>
            <div className=${`check-item ${analysis.sectionScores.contact > 50 ? 'pass' : 'fail'}`}>
              <span>Contact Info & Links</span>
              <span>${analysis.sectionScores.contact > 50 ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div className=${`check-item ${analysis.sectionScores.summary > 50 ? 'pass' : 'fail'}`}>
              <span>Professional Summary</span>
              <span>${analysis.sectionScores.summary > 50 ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div className=${`check-item ${analysis.sectionScores.education > 50 ? 'pass' : 'fail'}`}>
              <span>Education & CGPA</span>
              <span>${analysis.sectionScores.education > 50 ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div className=${`check-item ${analysis.sectionScores.skills > 50 ? 'pass' : 'fail'}`}>
              <span>Technical Skills Section</span>
              <span>${analysis.sectionScores.skills > 50 ? '✓ Present' : '✗ Missing'}</span>
            </div>
          </div>

          <h4>Matched Keywords (${analysis.matchedKeywords.length})</h4>
          <div className="kw-chips mb-3">
            ${analysis.matchedKeywords.map(kw => html`<span key=${kw} className="chip chip-success">${kw}</span>`)}
          </div>

          <h4>Recommended Missing Keywords</h4>
          <div className="kw-chips mb-3">
            ${analysis.missingKeywords.map(kw => html`<span key=${kw} className="chip chip-warning">+ ${kw}</span>`)}
          </div>

          <div className="mt-4">
            <h4>Live Resume Scan Heatmap</h4>
            <div ref=${heatmapContainerRef}></div>
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- Source: InterviewExperiences.js ---



function InterviewExperiences() {
  const { state, addInterviewExperience } = usePortal();
  const experiences = state.interviewExperiences;

  const handleShare = () => {
    const company = prompt('Company Name:');
    const role = prompt('Role Title:');
    const tips = prompt('Key Interview Tips & Preparation Guidance:');

    if (company && role) {
      addInterviewExperience({
        company,
        role,
        author: state.studentProfile.name,
        difficulty: 'Medium',
        tips: tips || 'Focus on core technical fundamentals and system design basics.'
      });
      alert('Your interview experience has been published!');
    }
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Interview Experience Hub</h2>
        <button className="btn btn-primary" onClick=${handleShare}>+ Share Your Experience</button>
      </div>

      <div className="experiences-list">
        ${experiences.map(exp => html`
          <div key=${exp.id} className="card experience-card mb-3">
            <div className="card-header">
              <h3>${exp.company} - ${exp.role}</h3>
              <span className="badge badge-purple">${exp.difficulty}</span>
            </div>
            <div className="card-body">
              <p className="mb-2"><strong>Shared by:</strong> ${exp.author} (${exp.date || 'Recent'})</p>
              ${exp.rounds && html`
                <div className="rounds-list mb-3">
                  ${exp.rounds.map((r, i) => html`
                    <div key=${i} className="round-item mb-1">
                      <strong>${r.title}:</strong> ${r.details}
                    </div>
                  `)}
                </div>
              `}
              <p><strong>Tips & Guidance:</strong> ${exp.tips}</p>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}


// --- Source: JobDrives.js ---



function JobDrives({ isApplicationsOnly = false, isRecommendationsOnly = false }) {
  const { state, applyForJob } = usePortal();
  const student = state.studentProfile;
  const approvedJobs = state.jobs.filter(j => j.status === 'APPROVED');
  const myApps = state.applications.filter(a => a.studentId === student.id);

  const handleApply = (jobId) => {
    if (applyForJob(jobId)) {
      alert('Application submitted successfully!');
    }
  };

  if (isApplicationsOnly) {
    return html`
      <div className="tab-pane animate-fade-in">
        <div className="page-title-bar">
          <h2>Track Application Status</h2>
          <p>Monitor your active job application status and upcoming interview schedules.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Submitted Applications (${myApps.length})</h3>
          </div>
          <div className="card-body">
            ${myApps.length === 0 ? html`<p className="text-muted">No active applications found.</p>` : html`
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Job Title</th>
                      <th>Apply Date</th>
                      <th>ATS Match</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${myApps.map(a => html`
                      <tr key=${a.id}>
                        <td><strong>${a.companyName}</strong></td>
                        <td>${a.jobTitle}</td>
                        <td>${a.applyDate}</td>
                        <td><span className="score-pill-sm">${a.atsScore}%</span></td>
                        <td>
                          <span className=${`status-badge ${a.status.toLowerCase()}`}>
                            ${a.status.replace('_', ' ')}
                          </span>
                          ${a.interviewDetails && html`
                            <div className="mt-1 text-xs text-primary">
                              📅 ${a.interviewDetails.date} at ${a.interviewDetails.time} (${a.interviewDetails.mode})
                            </div>
                          `}
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  if (isRecommendationsOnly) {
    return html`
      <div className="tab-pane animate-fade-in">
        <div className="page-title-bar">
          <h2>Personalized Company Recommendations</h2>
          <p>Top hiring companies matched specifically to your skill set, branch, and CGPA.</p>
        </div>

        <div className="jobs-grid">
          ${approvedJobs.map(j => {
            const isApplied = myApps.some(a => a.jobId === j.id);
            return html`
              <div key=${j.id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-title">${j.title}</h3>
                    <span className="company-name">${j.companyName}</span>
                  </div>
                  <span className="ctc-tag">${j.ctc}</span>
                </div>
                <p className="job-description-text">${j.description}</p>
                <div className="job-card-footer">
                  <span className="badge badge-info">AI Match Score: 92%</span>
                  ${isApplied ? html`
                    <span className="applied-badge">Applied ✓</span>
                  ` : html`
                    <button className="btn btn-sm btn-primary" onClick=${() => handleApply(j.id)}>1-Click Apply</button>
                  `}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>View Eligible Placement Jobs</h2>
        <p>Explore all active campus drives approved by the university placement cell.</p>
      </div>

      <div className="jobs-grid">
        ${approvedJobs.map(job => {
          const isEligible = student.cgpa >= job.minCgpa;
          const app = myApps.find(a => a.jobId === job.id);

          return html`
            <div key=${job.id} className=${`job-card ${!isEligible ? 'ineligible' : ''}`}>
              <div className="job-card-header">
                <div>
                  <h3 className="job-title">${job.title}</h3>
                  <span className="company-name">${job.companyName}</span>
                </div>
                <span className="ctc-tag">${job.ctc}</span>
              </div>

              <div className="job-meta-list">
                <span>📍 ${job.location}</span>
                <span>🎓 Min CGPA: ${job.minCgpa}</span>
              </div>

              <p className="job-description-text">${job.description}</p>

              <div className="job-card-footer">
                ${!isEligible ? html`
                  <span className="eligibility-msg error">❌ Ineligible (Min ${job.minCgpa})</span>
                ` : app ? html`
                  <span className="applied-badge">Applied ✓ (${app.status})</span>
                ` : html`
                  <button className="btn btn-primary" onClick=${() => handleApply(job.id)}>1-Click Apply</button>
                `}
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}


// --- Source: MockInterview.js ---



function MockInterview() {
  const domains = MOCK_INTERVIEW_DOMAINS;
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const handleSelectQuestion = (q) => {
    setActiveQuestion(q);
    setUserAnswer('');
    setEvaluation(null);
  };

  const handleSpeak = () => {
    if (activeQuestion) {
      speakQuestion(activeQuestion.question);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeQuestion && userAnswer.trim()) {
      const result = evaluateAnswer(activeQuestion, userAnswer);
      setEvaluation(result);
    }
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Practice Mock Interviews</h2>
        <p>Select a domain, read or listen to questions, and get real-time AI feedback.</p>
      </div>

      <div className="content-row">
        <div className="card card-flex-1">
          <div className="card-header"><h3>Select Question</h3></div>
          <div className="card-body">
            ${domains.map(d => html`
              <div key=${d.id} className="domain-block mb-3">
                <h4>${d.icon} ${d.name}</h4>
                <div className="q-list">
                  ${d.questions.map(q => html`
                    <button 
                      key=${q.id}
                      className=${`q-select-btn ${activeQuestion && activeQuestion.id === q.id ? 'active' : ''}`}
                      onClick=${() => handleSelectQuestion(q)}
                    >
                      ${q.question}
                    </button>
                  `)}
                </div>
              </div>
            `)}
          </div>
        </div>

        <div className="card card-flex-2">
          <div className="card-header">
            <h3>Answer Simulator</h3>
            ${activeQuestion && html`
              <button className="btn btn-sm btn-secondary" onClick=${handleSpeak}>🔊 Read Aloud</button>
            `}
          </div>
          <div className="card-body">
            ${!activeQuestion ? html`
              <p className="text-muted">Select a question from the left panel to begin your interview practice.</p>
            ` : html`
              <div className="mock-question-box mb-3">
                <p className="q-text"><strong>${activeQuestion.question}</strong></p>
                ${activeQuestion.hint && html`<p className="hint-text mt-1">💡 <em>Hint: ${activeQuestion.hint}</em></p>`}
              </div>
              <form onSubmit=${handleSubmit}>
                <textarea 
                  value=${userAnswer}
                  onChange=${(e) => setUserAnswer(e.target.value)}
                  rows="6" 
                  placeholder="Type your technical answer here..." 
                  required
                ></textarea>
                <button type="submit" className="btn btn-success mt-3">Submit for AI Evaluation 🚀</button>
              </form>

              ${evaluation && html`
                <div className="evaluation-report-card mt-3 animate-fade-in">
                  <h4>Score: ${evaluation.score} / 100 (${evaluation.grade})</h4>
                  <p className="mt-1">${evaluation.feedback}</p>
                  
                  <div className="kw-chips mt-2">
                    <strong>Matched Concepts: </strong>
                    ${evaluation.matchedKeywords.length === 0 ? 'None' : evaluation.matchedKeywords.map(kw => html`<span key=${kw} className="chip chip-success">${kw}</span>`)}
                  </div>
                  <div className="kw-chips mt-2">
                    <strong>Suggested Key Terms: </strong>
                    ${evaluation.missingKeywords.length === 0 ? 'All Key Terms Covered!' : evaluation.missingKeywords.map(kw => html`<span key=${kw} className="chip chip-warning">${kw}</span>`)}
                  </div>
                </div>
              `}
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- Source: SkillGapAnalyzer.js ---



function SkillGapAnalyzer() {
  const { state } = usePortal();
  const student = state.studentProfile;
  const roles = state.targetRoles;

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>AI Skill Gap Analyzer</h2>
        <p>Compare your current technical skills against target industry career paths.</p>
      </div>

      <div className="target-roles-grid">
        ${roles.map(role => {
          const matched = role.requiredSkills.filter(s => student.skills.some(st => st.toLowerCase() === s.toLowerCase()));
          const missing = role.requiredSkills.filter(s => !student.skills.some(st => st.toLowerCase() === s.toLowerCase()));
          const matchPercent = Math.round((matched.length / role.requiredSkills.length) * 100);

          return html`
            <div key=${role.id} className="role-gap-card">
              <div className="role-gap-header">
                <h3>${role.title}</h3>
                <span className=${`match-badge ${matchPercent >= 70 ? 'high' : 'medium'}`}>
                  ${matchPercent}% Match
                </span>
              </div>
              <div className="role-salary">Avg CTC: <strong>${role.avgSalary}</strong></div>

              <div className="skill-group-box">
                <span className="box-label success">✓ Skills You Possess (${matched.length}):</span>
                <div className="kw-chips">
                  ${matched.map(m => html`<span key=${m} className="chip chip-success">${m}</span>`)}
                </div>
              </div>

              <div className="skill-group-box">
                <span className="box-label warning">⚠️ Missing Skills (${missing.length}):</span>
                <div className="kw-chips">
                  ${missing.map(m => html`<span key=${m} className="chip chip-warning">+ ${m}</span>`)}
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}


// --- Source: RecruiterDashboard.js ---



function RecruiterDashboard({ recruiter, myJobs, myApps, shortlisted }) {
  const selectedCount = myApps.filter(a => a.status === 'SELECTED').length;

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="welcome-hero-card recruiter">
        <div className="hero-text">
          <h2>Recruiter Console: ${recruiter.companyName}</h2>
          <p>Manage campus recruitment drives, candidate applications, and interview scheduling.</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💼</div>
          <div className="metric-info">
            <span className="metric-val">${myJobs.length}</span>
            <span className="metric-lbl">Active Job Postings</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📑</div>
          <div className="metric-info">
            <span className="metric-val">${myApps.length}</span>
            <span className="metric-lbl">Total Applicants</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-info">
            <span className="metric-val">${shortlisted.length}</span>
            <span className="metric-lbl">Shortlisted Candidates</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <span className="metric-val">${selectedCount}</span>
            <span className="metric-lbl">Offers Extended</span>
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- Source: CompanyProfile.js ---



function CompanyProfile({ recruiter }) {
  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Company Profile</h2>
      </div>
      <div className="card max-w-2xl">
        <div className="card-header">
          <h3>Company Details</h3>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" value=${recruiter.companyName} readOnly className="input-disabled" />
            </div>
            <div className="form-group">
              <label>Industry Sector</label>
              <input type="text" value=${recruiter.industry} readOnly className="input-disabled" />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input type="text" value=${recruiter.contactPerson} readOnly className="input-disabled" />
            </div>
            <div className="form-group">
              <label>Work Email</label>
              <input type="text" value=${recruiter.email} readOnly className="input-disabled" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- Source: JobPostingManager.js ---



function JobPostingManager({ myJobs, onPostJob }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobCtc, setJobCtc] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobMinCgpa, setJobMinCgpa] = useState('7.5');
  const [jobLastDate, setJobLastDate] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobDesc, setJobDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPostJob({
      title: jobTitle,
      ctc: jobCtc,
      location: jobLocation,
      minCgpa: parseFloat(jobMinCgpa),
      lastDate: jobLastDate,
      skillsRequired: jobSkills.split(',').map(s => s.trim()).filter(Boolean),
      description: jobDesc,
      eligibleBranches: ['Computer Science & Engineering', 'Information Technology']
    });
    alert('Job opening posted successfully!');
    setJobTitle('');
    setJobCtc('');
    setJobLocation('');
    setJobSkills('');
    setJobDesc('');
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Post Job Opportunities</h2>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Create New Job Posting</h3>
        </div>
        <div className="card-body">
          <form className="form-grid" onSubmit=${handleSubmit}>
            <div className="form-group">
              <label>Job Title / Role Name</label>
              <input 
                type="text" 
                value=${jobTitle} 
                onChange=${e => setJobTitle(e.target.value)} 
                placeholder="e.g. Software Engineer - SDE 1" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Package CTC (in LPA)</label>
              <input 
                type="text" 
                value=${jobCtc} 
                onChange=${e => setJobCtc(e.target.value)} 
                placeholder="e.g. 15.5 LPA" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value=${jobLocation} 
                onChange=${e => setJobLocation(e.target.value)} 
                placeholder="e.g. Remote / Hybrid / Bengaluru" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Minimum Eligibility CGPA</label>
              <input 
                type="number" 
                step="0.1" 
                value=${jobMinCgpa} 
                onChange=${e => setJobMinCgpa(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Application Deadline</label>
              <input 
                type="date" 
                value=${jobLastDate} 
                onChange=${e => setJobLastDate(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group form-full">
              <label>Required Technical Skills (Comma separated)</label>
              <input 
                type="text" 
                value=${jobSkills} 
                onChange=${e => setJobSkills(e.target.value)} 
                placeholder="React, Node.js, Python, SQL" 
                required 
              />
            </div>
            <div className="form-group form-full">
              <label>Job Description & Responsibilities</label>
              <textarea 
                rows="3" 
                value=${jobDesc} 
                onChange=${e => setJobDesc(e.target.value)} 
                placeholder="Describe role requirements..." 
                required
              ></textarea>
            </div>
            <div className="form-actions form-full">
              <button type="submit" className="btn btn-primary">Submit Job Posting for Officer Approval</button>
            </div>
          </form>
        </div>
      </div>

      <div className="jobs-grid">
        ${myJobs.map(job => html`
          <div key=${job.id} className="job-card">
            <div className="job-card-header">
              <div>
                <h3 className="job-title">${job.title}</h3>
                <span className="company-name">${job.companyName}</span>
              </div>
              <span className=${`badge ${job.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>
                ${job.status}
              </span>
            </div>

            <div className="job-meta-list">
              <span>💰 CTC: <strong>${job.ctc}</strong></span>
              <span>📍 ${job.location}</span>
              <span>🎓 Min CGPA: ${job.minCgpa}</span>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}


// --- Source: StudentApplicationsTable.js ---



function StudentApplicationsTable({ myApps }) {
  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>View Student Applications</h2>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Applicants (${myApps.length} Candidates)</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>ATS Score</th>
                  <th>Job Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${myApps.map(a => html`
                  <tr key=${a.id}>
                    <td><strong>${a.studentName}</strong></td>
                    <td>${a.rollNo}</td>
                    <td>${a.branch}</td>
                    <td><span className="cgpa-pill">${a.cgpa}</span></td>
                    <td><span className="score-pill-sm">${a.atsScore}%</span></td>
                    <td>${a.jobTitle}</td>
                    <td><span className=${`status-badge ${a.status.toLowerCase()}`}>${a.status.replace('_', ' ')}</span></td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- Source: CandidatePipeline.js ---



function CandidatePipeline({ myApps, onUpdateStatus }) {
  const handleStatusUpdate = (appId, status) => {
    onUpdateStatus(appId, status);
    alert(`Candidate status updated to: ${status}`);
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Shortlist Candidates & Update Selection Status</h2>
        <p>Manage candidate selection pipeline: Shortlist, Schedule Interview, Select, or Reject.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Candidate Status Pipeline</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>ATS Match</th>
                  <th>Applied For</th>
                  <th>Current Pipeline Status</th>
                  <th>Update Action</th>
                </tr>
              </thead>
              <tbody>
                ${myApps.map(a => html`
                  <tr key=${a.id}>
                    <td><strong>${a.studentName}</strong></td>
                    <td>${a.rollNo}</td>
                    <td><span className=${`score-pill-sm ${a.atsScore >= 80 ? 'high' : 'med'}`}>${a.atsScore}%</span></td>
                    <td>${a.jobTitle}</td>
                    <td><span className=${`status-badge ${a.status.toLowerCase()}`}>${a.status.replace('_', ' ')}</span></td>
                    <td>
                      <div className="action-btn-group">
                        <button className="btn btn-sm btn-success" onClick=${() => handleStatusUpdate(a.id, 'SHORTLISTED')}>Shortlist ⭐</button>
                        <button className="btn btn-sm btn-purple" onClick=${() => handleStatusUpdate(a.id, 'INTERVIEW_SCHEDULED')}>Schedule 📅</button>
                        <button className="btn btn-sm btn-primary" onClick=${() => handleStatusUpdate(a.id, 'SELECTED')}>Select Offer ✅</button>
                        <button className="btn btn-sm btn-danger" onClick=${() => handleStatusUpdate(a.id, 'REJECTED')}>Reject ❌</button>
                      </div>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- Source: InterviewScheduler.js ---



function InterviewScheduler({ myApps, onUpdateStatus }) {
  const [schedAppId, setSchedAppId] = useState(myApps[0]?.id || '');
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [schedMode, setSchedMode] = useState('Virtual (Google Meet)');
  const [schedLink, setSchedLink] = useState('');

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!schedAppId) return;
    onUpdateStatus(schedAppId, 'INTERVIEW_SCHEDULED', {
      date: schedDate,
      time: schedTime,
      mode: schedMode,
      link: schedLink
    });
    alert('Interview scheduled successfully!');
    setSchedDate('');
    setSchedTime('');
    setSchedLink('');
  };

  const scheduledApps = myApps.filter(a => a.interviewDetails);

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Schedule Interviews & Drives</h2>
      </div>

      <div className="content-row">
        <div className="card card-flex-1">
          <div className="card-header">
            <h3>Schedule Slot</h3>
          </div>
          <div className="card-body">
            <form onSubmit=${handleScheduleSubmit}>
              <div className="form-group">
                <label>Candidate:</label>
                <select value=${schedAppId} onChange=${e => setSchedAppId(e.target.value)} required>
                  ${myApps.map(a => html`<option key=${a.id} value=${a.id}>${a.studentName} (${a.rollNo})</option>`)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value=${schedDate} onChange=${e => setSchedDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Time Slot</label>
                <input type="text" value=${schedTime} onChange=${e => setSchedTime(e.target.value)} placeholder="11:00 AM EST" required />
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select value=${schedMode} onChange=${e => setSchedMode(e.target.value)}>
                  <option value="Virtual (Google Meet)">Virtual (Google Meet)</option>
                  <option value="On-Campus Auditorium">On-Campus Auditorium</option>
                </select>
              </div>
              <div className="form-group">
                <label>Meeting Link / Venue</label>
                <input type="text" value=${schedLink} onChange=${e => setSchedLink(e.target.value)} placeholder="https://meet.google.com/..." required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Confirm Interview Schedule</button>
            </form>
          </div>
        </div>

        <div className="card card-flex-2">
          <div className="card-header">
            <h3>Scheduled Rounds</h3>
          </div>
          <div className="card-body">
            ${scheduledApps.length === 0 ? html`<p className="text-muted">No interviews scheduled yet.</p>` : scheduledApps.map(a => html`
              <div key=${a.id} className="interview-card mb-2">
                <h4>${a.studentName} (${a.rollNo})</h4>
                <p>📅 ${a.interviewDetails.date} at ${a.interviewDetails.time} (${a.interviewDetails.mode})</p>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `;
}


// --- Source: CandidateCommunication.js ---



function CandidateCommunication() {
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert('Announcement message sent to candidate notifications!');
    setMsgSubject('');
    setMsgContent('');
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Communicate with Students</h2>
        <p>Send direct messages and updates to applicants or shortlisted candidates.</p>
      </div>

      <div className="card max-w-2xl">
        <div className="card-header">
          <h3>Send Direct Message / Alert</h3>
        </div>
        <div className="card-body">
          <form onSubmit=${handleSendMessage}>
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                value=${msgSubject}
                onChange=${e => setMsgSubject(e.target.value)}
                placeholder="e.g. Next Round Preparation Notes" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Message Content</label>
              <textarea 
                rows="4" 
                value=${msgContent}
                onChange=${e => setMsgContent(e.target.value)}
                placeholder="Enter message to candidates..." 
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Send Announcement 💬</button>
          </form>
        </div>
      </div>
    </div>
  `;
}


// --- Source: loginView.js ---



function LoginView() {
  const { state, login, register } = usePortal();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('STUDENT'); // 'STUDENT' | 'RECRUITER' | 'ADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Registration Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');
  const [regCgpa, setRegCgpa] = useState('8.50');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
  };


  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const res = login(email, password, selectedRole);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const userData = {
      role: selectedRole,
      name: regName,
      email: regEmail,
      password: regPassword,
      branch: regBranch,
      cgpa: regCgpa
    };
    const res = register(userData);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return html`
    <div className="auth-page-container animate-fade-in">
      <div className="ambient-glow-blob blob-1"></div>
      <div className="ambient-glow-blob blob-2"></div>

      <div className="auth-card-glass">
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <h2>Virtual Placement Cell Portal</h2>
          <p className="auth-subtitle">Secure University Career & Campus Placement Gateway</p>
        </div>

        <div className="auth-tabs">
          <button 
            className=${`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick=${() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            🔐 Sign In
          </button>
          <button 
            className=${`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick=${() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            📝 Create Account
          </button>
        </div>

        ${errorMessage && html`
          <div className="auth-alert error animate-fade-in">
            <span>⚠️ ${errorMessage}</span>
          </div>
        `}
        ${successMessage && html`
          <div className="auth-alert success animate-fade-in">
            <span>✓ ${successMessage}</span>
          </div>
        `}

        ${activeTab === 'login' ? html`
          <form className="auth-form mt-3" onSubmit=${handleLoginSubmit}>
            <div className="form-group">
              <label>Select Portal User Role:</label>
              <div className="auth-role-pills">
                <button type="button" className=${`role-pill-btn ${selectedRole === 'STUDENT' ? 'selected' : ''}`} onClick=${() => handleRoleChange('STUDENT')}>🎓 Student</button>
                <button type="button" className=${`role-pill-btn ${selectedRole === 'RECRUITER' ? 'selected' : ''}`} onClick=${() => handleRoleChange('RECRUITER')}>🏢 Recruiter</button>
                <button type="button" className=${`role-pill-btn ${selectedRole === 'ADMIN' ? 'selected' : ''}`} onClick=${() => handleRoleChange('ADMIN')}>🛡️ Officer</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-with-icon">
                <span className="field-icon">📧</span>
                <input 
                  type="email" 
                  id="login-email" 
                  value=${email}
                  onChange=${(e) => setEmail(e.target.value)}
                  placeholder="user@university.edu" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-with-icon">
                <span className="field-icon">🔑</span>
                <input 
                  type=${showPassword ? 'text' : 'password'}
                  id="login-password" 
                  value=${password}
                  onChange=${(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  className="btn-toggle-pwd"
                  onClick=${() => setShowPassword(!showPassword)}
                >
                  ${showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Remember login session
              </label>
              <a 
                href="#forgot" 
                className="forgot-link"
                onClick=${(e) => {
                  e.preventDefault();
                  alert('Please contact the placement office to reset your password.');
                }}
              >Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block mt-3">
              Sign In to ${selectedRole.replace('_', ' ')} Portal ➔
            </button>
          </form>
        ` : html`
          <form className="auth-form mt-3" onSubmit=${handleRegisterSubmit}>
            <div className="form-group">
              <label>Account Role:</label>
              <div className="auth-role-pills">
                <button type="button" className=${`role-pill-btn ${selectedRole === 'STUDENT' ? 'selected' : ''}`} onClick=${() => handleRoleChange('STUDENT')}>🎓 Student</button>
                <button type="button" className=${`role-pill-btn ${selectedRole === 'RECRUITER' ? 'selected' : ''}`} onClick=${() => handleRoleChange('RECRUITER')}>🏢 Recruiter</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-name">${selectedRole === 'STUDENT' ? 'Full Name' : 'Company Name'}</label>
              <input 
                type="text" 
                id="reg-name" 
                value=${regName}
                onChange=${(e) => setRegName(e.target.value)}
                placeholder=${selectedRole === 'STUDENT' ? 'John Doe' : 'Acme Innovations'} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Work/University Email</label>
              <input 
                type="email" 
                id="reg-email" 
                value=${regEmail}
                onChange=${(e) => setRegEmail(e.target.value)}
                placeholder="user@domain.com" 
                required 
              />
            </div>

            ${selectedRole === 'STUDENT' && html`
              <div className="form-group">
                <label htmlFor="reg-branch">Engineering Branch</label>
                <select id="reg-branch" value=${regBranch} onChange=${(e) => setRegBranch(e.target.value)}>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="reg-cgpa">Current CGPA</label>
                <input 
                  type="number" 
                  step="0.01" 
                  id="reg-cgpa" 
                  value=${regCgpa}
                  onChange=${(e) => setRegCgpa(e.target.value)}
                  required 
                />
              </div>
            `}

            <div className="form-group">
              <label htmlFor="reg-password">Password (Min 6 chars)</label>
              <input 
                type="password" 
                id="reg-password" 
                value=${regPassword}
                onChange=${(e) => setRegPassword(e.target.value)}
                placeholder="Create strong password" 
                required 
              />
            </div>

            <button type="submit" className="btn btn-success btn-lg btn-block mt-3">
              Complete Registration & Sign In 🚀
            </button>
          </form>
        `}
      </div>
    </div>
  `;
}


// --- Source: studentView.js ---



function StudentView() {
  const { state, updateStudentProfile, updateResumeContent, markAllNotificationsRead } = usePortal();
  const student = state.studentProfile;
  const jobs = state.jobs.filter(j => j.status === 'APPROVED');
  const myApps = state.applications.filter(a => a.studentId === student.id);
  const unreadNotifs = state.notifications.filter(n => !n.isRead);

  const [activeTab, setActiveTab] = useState('readiness');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone,
    program: student.program,
    branch: student.branch,
    cgpa: student.cgpa,
    passingYear: student.passingYear,
    skills: student.skills.join(', ')
  });

  // Resume Text Editor State
  const [resumeText, setResumeText] = useState(student.resume.content);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateStudentProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      program: profileForm.program,
      branch: profileForm.branch,
      cgpa: parseFloat(profileForm.cgpa),
      passingYear: parseInt(profileForm.passingYear),
      skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    alert('Profile updated successfully!');
  };

  const handleSaveResumeText = () => {
    const score = updateResumeContent(resumeText, student.resume.fileName);
    alert(`Resume text saved! Updated ATS Match Score: ${score}%`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        setResumeText(text);
        const score = updateResumeContent(text, file.name);
        alert(`Uploaded ${file.name}! Calculated ATS Score: ${score}%`);
        setActiveTab('ats');
      };
      reader.readAsText(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'readiness':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="welcome-hero-card">
              <div className="hero-text">
                <h2>Placement Readiness Score Diagnostic</h2>
                <p>Overall Readiness Rating: <strong>${student.readinessBreakdown.overall} / 100</strong> (Top 15% of Batch)</p>
              </div>
            </div>

            <div className="card max-w-2xl">
              <div className="card-header">
                <h3>Readiness Breakdown & Diagnostic Meter</h3>
                <span className="score-pill-lg high">${student.readinessBreakdown.overall} / 100</span>
              </div>
              <div className="card-body">
                <div className="readiness-bars">
                  <div className="readiness-item">
                    <div className="item-head">
                      <span>Technical & Coding Skills</span>
                      <span className="item-val">${student.readinessBreakdown.technical}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill green" style=${{ width: `${student.readinessBreakdown.technical}%` }}></div></div>
                  </div>

                  <div className="readiness-item">
                    <div className="item-head">
                      <span>Resume & Profile Quality</span>
                      <span className="item-val">${student.readinessBreakdown.resumeQuality}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill blue" style=${{ width: `${student.readinessBreakdown.resumeQuality}%` }}></div></div>
                  </div>

                  <div className="readiness-item">
                    <div className="item-head">
                      <span>Soft Skills & Communication</span>
                      <span className="item-val">${student.readinessBreakdown.softSkills}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill purple" style=${{ width: `${student.readinessBreakdown.softSkills}%` }}></div></div>
                  </div>

                  <div className="readiness-item">
                    <div className="item-head">
                      <span>Aptitude & Problem Solving</span>
                      <span className="item-val">${student.readinessBreakdown.aptitude}%</span>
                    </div>
                    <div className="bar-track"><div className="bar-fill amber" style=${{ width: `${student.readinessBreakdown.aptitude}%` }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'profile':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Manage Student Profile</h2>
              <p>Edit your profile information, CGPA, branch, and technical skills.</p>
            </div>

            <div className="card max-w-2xl">
              <div className="card-header">
                <h3>Academic Profile Details</h3>
                <span className=${`badge ${student.isVerified ? 'badge-success' : 'badge-warning'}`}>
                  ${student.isVerified ? 'Profile Verified ✓' : 'Pending Verification'}
                </span>
              </div>
              <div className="card-body">
                <form className="form-grid" onSubmit=${handleProfileSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value=${profileForm.name} 
                      onChange=${e => setProfileForm({ ...profileForm, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Roll Number</label>
                    <input type="text" value=${student.rollNo} readOnly className="input-disabled" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value=${profileForm.email} 
                      onChange=${e => setProfileForm({ ...profileForm, email: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      value=${profileForm.phone} 
                      onChange=${e => setProfileForm({ ...profileForm, phone: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Program / Degree</label>
                    <input 
                      type="text" 
                      value=${profileForm.program} 
                      onChange=${e => setProfileForm({ ...profileForm, program: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch / Specialization</label>
                    <select 
                      value=${profileForm.branch} 
                      onChange=${e => setProfileForm({ ...profileForm, branch: e.target.value })}
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Current CGPA</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value=${profileForm.cgpa} 
                      onChange=${e => setProfileForm({ ...profileForm, cgpa: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Passing Year</label>
                    <input 
                      type="number" 
                      value=${profileForm.passingYear} 
                      onChange=${e => setProfileForm({ ...profileForm, passingYear: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group form-full">
                    <label>Key Technical Skills (Comma separated)</label>
                    <input 
                      type="text" 
                      value=${profileForm.skills} 
                      onChange=${e => setProfileForm({ ...profileForm, skills: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-actions form-full">
                    <button type="submit" className="btn btn-primary btn-lg">Save Profile Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `;

      case 'resume':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Upload & Manage Resume</h2>
              <p>Upload your official resume file and inspect parsed text.</p>
            </div>

            <div className="content-row">
              <div className="card card-flex-1">
                <div className="card-header">
                  <h3>Active Resume File</h3>
                  <span className="badge badge-success">${student.resume.atsScore}% ATS Score</span>
                </div>
                <div className="card-body">
                  <div className="resume-preview-box mb-4">
                    <div className="file-icon">📄</div>
                    <div className="file-details">
                      <strong>${student.resume.fileName}</strong>
                      <span className="file-date">Uploaded on ${student.resume.uploadDate}</span>
                    </div>
                  </div>

                  <div className="upload-zone" onClick=${() => document.getElementById('resume-file-input').click()}>
                    <input 
                      type="file" 
                      id="resume-file-input" 
                      accept=".txt,.pdf,.doc,.docx" 
                      className="hidden-file-input" 
                      onChange=${handleFileUpload} 
                    />
                    <div className="drop-text">
                      <span className="drop-icon">📤</span>
                      <strong>Click or Drag new resume file here</strong>
                      <span>Supports TXT, PDF, DOCX (Simulated File Parser)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card card-flex-2">
                <div className="card-header">
                  <h3>Parsed Resume Text Editor</h3>
                  <button className="btn btn-sm btn-primary" onClick=${handleSaveResumeText}>
                    Save Resume Text & Recalculate ATS
                  </button>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>Resume Content:</label>
                    <textarea 
                      rows="14" 
                      style=${{ fontFamily: 'monospace' }}
                      value=${resumeText}
                      onChange=${e => setResumeText(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'ats':
        return html`<${AtsChecker} />`;

      case 'heatmap':
        return html`<${AtsChecker} isHeatmapOnly=${true} />`;

      case 'skillgap':
        return html`<${SkillGapAnalyzer} />`;

      case 'recommendations':
        return html`<${JobDrives} isRecommendationsOnly=${true} />`;

      case 'jobs':
        return html`<${JobDrives} />`;

      case 'applications':
        return html`<${JobDrives} isApplicationsOnly=${true} />`;

      case 'mock_interview':
        return html`<${MockInterview} />`;

      case 'experiences':
        return html`<${InterviewExperiences} />`;

      case 'notifications':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Notifications & Alerts Center</h2>
              <p>University drive announcements, interview schedules, and application updates.</p>
            </div>

            <div className="card max-w-2xl">
              <div className="card-header">
                <h3>All Notifications (${state.notifications.length})</h3>
                <button className="btn btn-sm btn-secondary" onClick=${markAllNotificationsRead}>Mark All Read</button>
              </div>
              <div className="card-body">
                <div className="notif-full-list">
                  ${state.notifications.map(n => html`
                    <div key=${n.id} className=${`notif-item ${n.isRead ? 'read' : 'unread'} mb-2`}>
                      <div className="notif-content">
                        <strong>${n.title}</strong>
                        <p className="notif-msg">${n.message}</p>
                        <span className="notif-time">${n.date}</span>
                      </div>
                    </div>
                  `)}
                </div>
              </div>
            </div>
          </div>
        `;

      default:
        return html`<${AtsChecker} />`;
    }
  };

  return html`
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="student-mini-card">
          <div className="avatar-circle">
            ${student.name.charAt(0)}${student.name.split(' ')[1] ? student.name.split(' ')[1].charAt(0) : ''}
          </div>
          <div className="mini-info">
            <h4 className="student-name-text">${student.name}</h4>
            <span className="roll-badge">${student.rollNo}</span>
            <span className="cgpa-pill">CGPA: ${student.cgpa}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className=${`nav-tab-btn ${activeTab === 'readiness' ? 'active' : ''}`} onClick=${() => setActiveTab('readiness')}>
            <span className="tab-icon">🏆</span> Readiness Score
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick=${() => setActiveTab('profile')}>
            <span className="tab-icon">👤</span> Manage Profile
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'resume' ? 'active' : ''}`} onClick=${() => setActiveTab('resume')}>
            <span className="tab-icon">📄</span> Upload Resume
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'ats' ? 'active' : ''}`} onClick=${() => setActiveTab('ats')}>
            <span className="tab-icon">🔍</span> ATS Resume Checker
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'heatmap' ? 'active' : ''}`} onClick=${() => setActiveTab('heatmap')}>
            <span className="tab-icon">🔥</span> Resume Heatmap
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'skillgap' ? 'active' : ''}`} onClick=${() => setActiveTab('skillgap')}>
            <span className="tab-icon">🎯</span> Skill Gap Analyzer
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`} onClick=${() => setActiveTab('recommendations')}>
            <span className="tab-icon">🌟</span> Company Recommendations
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick=${() => setActiveTab('jobs')}>
            <span className="tab-icon">💼</span> View Eligible Jobs (${jobs.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick=${() => setActiveTab('applications')}>
            <span className="tab-icon">📋</span> Track Applications (${myApps.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'mock_interview' ? 'active' : ''}`} onClick=${() => setActiveTab('mock_interview')}>
            <span className="tab-icon">🎙️</span> Mock Interviews
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'experiences' ? 'active' : ''}`} onClick=${() => setActiveTab('experiences')}>
            <span className="tab-icon">💡</span> Interview Experience Hub
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick=${() => setActiveTab('notifications')}>
            <span className="tab-icon">🔔</span> Notifications ${unreadNotifs.length > 0 && html`<span className="badge badge-warning">${unreadNotifs.length}</span>`}
          </button>
        </nav>

        <div className="readiness-widget-mini">
          <div className="widget-header">
            <span>Readiness Score</span>
            <span className="score-num">${student.readinessBreakdown.overall}/100</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style=${{ width: `${student.readinessBreakdown.overall}%` }}></div>
          </div>
        </div>
      </aside>

      <main className="portal-content">
        ${renderTabContent()}
      </main>
    </div>
  `;
}


// --- Source: recruiterView.js ---



function RecruiterView() {
  const { state, postNewJob, updateApplicationStatus } = usePortal();
  const recruiter = state.recruiterProfile;
  const myJobs = state.jobs.filter(j => j.recruiterId === recruiter.id || j.companyName === recruiter.companyName);
  const myApps = state.applications.filter(a => a.companyName === recruiter.companyName);
  const shortlisted = myApps.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED');

  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return html`<${RecruiterDashboard} 
          recruiter=${recruiter} 
          myJobs=${myJobs} 
          myApps=${myApps} 
          shortlisted=${shortlisted} 
        />`;

      case 'profile':
        return html`<${CompanyProfile} recruiter=${recruiter} />`;

      case 'jobs':
        return html`<${JobPostingManager} 
          myJobs=${myJobs} 
          onPostJob=${postNewJob} 
        />`;

      case 'applications':
        return html`<${StudentApplicationsTable} myApps=${myApps} />`;

      case 'shortlist':
        return html`<${CandidatePipeline} 
          myApps=${myApps} 
          onUpdateStatus=${updateApplicationStatus} 
        />`;

      case 'interviews':
        return html`<${InterviewScheduler} 
          myApps=${myApps} 
          onUpdateStatus=${updateApplicationStatus} 
        />`;

      case 'communication':
        return html`<${CandidateCommunication} />`;

      default:
        return html`<div>Select a tab</div>`;
    }
  };

  return html`
    <div className="portal-layout">
      <aside className="portal-sidebar recruiter-theme">
        <div className="recruiter-mini-card">
          <div className="company-logo-placeholder">🏢</div>
          <div className="mini-info">
            <h4 className="company-name-text">${recruiter.companyName}</h4>
            <span className="industry-badge">${recruiter.industry}</span>
            <span className="contact-name">Contact: ${recruiter.contactPerson}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className=${`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick=${() => setActiveTab('dashboard')}>
            <span className="tab-icon">📈</span> Recruiter Dashboard
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick=${() => setActiveTab('profile')}>
            <span className="tab-icon">🏢</span> Company Profile
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick=${() => setActiveTab('jobs')}>
            <span className="tab-icon">💼</span> Post & Manage Jobs (${myJobs.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick=${() => setActiveTab('applications')}>
            <span className="tab-icon">👥</span> View Student Applications (${myApps.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'shortlist' ? 'active' : ''}`} onClick=${() => setActiveTab('shortlist')}>
            <span className="tab-icon">⭐</span> Shortlist & Selection Status
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'interviews' ? 'active' : ''}`} onClick=${() => setActiveTab('interviews')}>
            <span className="tab-icon">📅</span> Schedule Interviews & Drives
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'communication' ? 'active' : ''}`} onClick=${() => setActiveTab('communication')}>
            <span className="tab-icon">💬</span> Communicate with Students
          </button>
        </nav>
      </aside>

      <main className="portal-content">
        ${renderTabContent()}
      </main>
    </div>
  `;
}


// --- Source: adminView.js ---



function AdminView() {
  const { state, verifyStudent, approveJob } = usePortal();
  const pendingJobs = state.jobs.filter(j => j.status === 'PENDING');
  const pendingStudents = state.studentsList.filter(s => s.status === 'PENDING');
  const analytics = state.analytics;
  const recruiter = state.recruiterProfile;

  const [activeTab, setActiveTab] = useState('analytics');

  // Broadcast Notification Form State
  const [bcastTitle, setBcastTitle] = useState('');
  const [bcastMsg, setBcastMsg] = useState('');

  // Report Generator State
  const [showReport, setShowReport] = useState(false);

  const handleVerify = (studentId, isVerified) => {
    verifyStudent(studentId, isVerified);
    alert(`Student profile ${isVerified ? 'verified' : 'unverified'}!`);
  };

  const handleApproveJob = (jobId, status) => {
    approveJob(jobId, status);
    alert(`Job post status updated to ${status}!`);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    alert(`Notification broadcasted to all students & portal users!`);
    setBcastTitle('');
    setBcastMsg('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>University Placement Analytics Dashboard</h2>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-info">
                  <span className="metric-val">${analytics.placementRate}%</span>
                  <span className="metric-lbl">Placement Rate</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">💰</div>
                <div className="metric-info">
                  <span className="metric-val">${analytics.avgPackage}</span>
                  <span className="metric-lbl">Average CTC</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">🏢</div>
                <div className="metric-info">
                  <span className="metric-val">${analytics.totalCompaniesVisited}</span>
                  <span className="metric-lbl">Companies Visited</span>
                </div>
              </div>
            </div>

            <${AnalyticsCharts} 
              branchStats=${analytics.branchStats} 
              salaryDistribution=${analytics.salaryDistribution} 
            />
          </div>
        `;

      case 'students':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Manage Student Accounts</h2>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Registered Students Directory (${state.studentsList.length})</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${state.studentsList.map(s => html`
                        <tr key=${s.id}>
                          <td><strong>${s.rollNo}</strong></td>
                          <td>${s.name}</td>
                          <td>${s.branch}</td>
                          <td><span className="cgpa-pill">${s.cgpa}</span></td>
                          <td>
                            <span className=${`status-badge ${s.status === 'VERIFIED' ? 'approved' : 'pending'}`}>
                              ${s.status}
                            </span>
                          </td>
                        </tr>
                      `)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'verify_students':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Verify Student Profiles</h2>
              <p>Review student academic records and grant verified status badges.</p>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Student Profile Verification Queue</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Verification Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${state.studentsList.map(s => html`
                        <tr key=${s.id}>
                          <td><strong>${s.rollNo}</strong></td>
                          <td>${s.name}</td>
                          <td>${s.branch}</td>
                          <td><span className="cgpa-pill">${s.cgpa}</span></td>
                          <td>
                            ${s.status === 'PENDING' ? html`
                              <button className="btn btn-sm btn-success" onClick=${() => handleVerify(s.id, true)}>
                                Verify Account ✓
                              </button>
                            ` : html`
                              <button className="btn btn-sm btn-secondary" onClick=${() => handleVerify(s.id, false)}>
                                Revoke Verification
                              </button>
                            `}
                          </td>
                        </tr>
                      `)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'recruiters':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Manage Recruiters</h2>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Recruiter Accounts Directory</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Industry Sector</th>
                        <th>Contact Person</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>${recruiter.companyName}</strong></td>
                        <td>${recruiter.industry}</td>
                        <td>${recruiter.contactPerson}</td>
                        <td>${recruiter.email}</td>
                        <td>${recruiter.mobile}</td>
                        <td><span className="badge badge-success">Approved Recruiter ✓</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'job_approvals':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Approve Job Posts</h2>
            </div>

            <div className="jobs-approval-grid">
              ${state.jobs.map(job => html`
                <div key=${job.id} className="card mb-3">
                  <div className="card-header">
                    <h3>${job.title} - ${job.companyName}</h3>
                    <span className=${`status-badge ${job.status.toLowerCase()}`}>${job.status}</span>
                  </div>
                  <div className="card-body">
                    <p>💰 CTC: <strong>${job.ctc}</strong> | Min CGPA: ${job.minCgpa}</p>
                    <p className="text-muted mt-1">${job.description}</p>
                    <div className="form-actions mt-3">
                      ${job.status === 'PENDING' ? html`
                        <button className="btn btn-success" onClick=${() => handleApproveJob(job.id, 'APPROVED')}>Approve Job Post ✓</button>
                        <button className="btn btn-danger" onClick=${() => handleApproveJob(job.id, 'REJECTED')}>Reject ✗</button>
                      ` : html`<span className="text-muted">Approved & Live</span>`}
                    </div>
                  </div>
                </div>
              `)}
            </div>
          </div>
        `;

      case 'notifications':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Send Notifications & Alerts</h2>
            </div>

            <div className="card max-w-2xl">
              <div className="card-header">
                <h3>Broadcast University Notification</h3>
              </div>
              <div className="card-body">
                <form onSubmit=${handleBroadcast}>
                  <div className="form-group">
                    <label>Announcement Title</label>
                    <input 
                      type="text" 
                      value=${bcastTitle}
                      onChange=${e => setBcastTitle(e.target.value)}
                      placeholder="e.g. Campus Placement Alert" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Message Content</label>
                    <textarea 
                      rows="4" 
                      value=${bcastMsg}
                      onChange=${e => setBcastMsg(e.target.value)}
                      placeholder="Enter announcement..." 
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Broadcast Alert 📢</button>
                </form>
              </div>
            </div>
          </div>
        `;

      case 'reports':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Generate Placement Reports</h2>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h3>Report Generator Configurator</h3>
              </div>
              <div className="card-body">
                <form onSubmit=${(e) => { e.preventDefault(); setShowReport(true); }}>
                  <div className="form-group">
                    <label>Report Type</label>
                    <select>
                      <option value="annual_summary">Annual Campus Placement Summary (2026)</option>
                      <option value="branch_wise">Branch-wise Placement Statistics</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">Generate Placement Report 📄</button>
                </form>
              </div>
            </div>

            ${showReport && html`
              <div className="card animate-fade-in">
                <div className="card-header">
                  <h3>Generated Report Preview</h3>
                  <button className="btn btn-sm btn-secondary" onClick=${() => window.print()}>🖨️ Print Report</button>
                </div>
                <div className="card-body">
                  <div className="official-report-sheet">
                    <h2>STATE UNIVERSITY - VIRTUAL PLACEMENT CELL REPORT</h2>
                    <p>Placement Rate: ${analytics.placementRate}% | Placed: ${analytics.placedStudents} / ${analytics.totalStudents}</p>
                    <p>Highest Package: ${analytics.highestPackage} | Average Package: ${analytics.avgPackage}</p>
                  </div>
                </div>
              </div>
            `}
          </div>
        `;

      default:
        return html`<div>Select a tab</div>`;
    }
  };

  return html`
    <div className="portal-layout">
      <aside className="portal-sidebar admin-theme">
        <div className="admin-mini-card">
          <div className="admin-avatar-icon">🛡️</div>
          <div className="mini-info">
            <h4 className="admin-title-text">Placement Cell Head</h4>
            <span className="dept-badge">University T&P Department</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className=${`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick=${() => setActiveTab('analytics')}>
            <span className="tab-icon">📊</span> Placement Analytics
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'students' ? 'active' : ''}`} onClick=${() => setActiveTab('students')}>
            <span className="tab-icon">🎓</span> Manage Students (${state.studentsList.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'verify_students' ? 'active' : ''}`} onClick=${() => setActiveTab('verify_students')}>
            <span className="tab-icon">🔍</span> Verify Students (${pendingStudents.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'recruiters' ? 'active' : ''}`} onClick=${() => setActiveTab('recruiters')}>
            <span className="tab-icon">🏢</span> Manage Recruiters
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'job_approvals' ? 'active' : ''}`} onClick=${() => setActiveTab('job_approvals')}>
            <span className="tab-icon">⚡</span> Approve Jobs (${pendingJobs.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick=${() => setActiveTab('notifications')}>
            <span className="tab-icon">📢</span> Send Notifications
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick=${() => setActiveTab('reports')}>
            <span className="tab-icon">📄</span> Generate Reports
          </button>
        </nav>
      </aside>

      <main className="portal-content">
        ${renderTabContent()}
      </main>
    </div>
  `;
}


// --- Source: app.js ---



function MainView() {
  const { state } = usePortal();

  if (!state.isAuthenticated) {
    return html`
      <div>
        <${LoginView} />
        <${Footer} />
      </div>
    `;
  }

  const role = state.currentUserRole;

  return html`
    <div>
      <${Header} />
      ${role === 'STUDENT' ? html`<${StudentView} />` : null}
      ${role === 'RECRUITER' ? html`<${RecruiterView} />` : null}
      ${role === 'ADMIN' ? html`<${AdminView} />` : null}
      <${Footer} />
    </div>
  `;
}

function App() {
  return html`
    <${PortalProvider}>
      <${MainView} />
    <//>
  `;
}

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(html`<${App} />`);
}


})();