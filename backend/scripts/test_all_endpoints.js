/**
 * Comprehensive Backend API Test Suite for PlacementPulse
 * Validates all REST API endpoints and business logic
 */
require('dotenv').config();
const http = require('http');
const app = require('../server');

const PORT = 8009;

let server;
let baseUrl = `http://127.0.0.1:${PORT}`;

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let body = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  return { status: res.status, ok: res.ok, body };
}

let passed = 0;
let failed = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    if (details) console.error(`     Details:`, details);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting PlacementPulse Backend Comprehensive Tests');
  console.log('====================================================\n');

  let studentToken = null;
  let recruiterToken = null;
  let adminToken = null;
  let testJobId = null;
  let testAppId = null;
  let testNotifId = null;

  // 1. Health & Root Checks
  console.log('--- 1. Health & Root Endpoints ---');
  {
    const resRoot = await request('/');
    assert(resRoot.status === 200 && resRoot.body.status === 'running', 'GET / returns running status');

    const resHealth = await request('/health');
    assert(resHealth.status === 200 && resHealth.body.status === 'ok', 'GET /health returns ok');

    const resApiHealth = await request('/api/health');
    assert(resApiHealth.status === 200 && resApiHealth.body.status === 'ok', 'GET /api/health returns ok');
  }

  // 2. Auth Endpoints
  console.log('\n--- 2. Auth Endpoints ---');
  {
    // Student Login
    const sLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alex.johnson@university.edu', password: 'student123', role: 'STUDENT' }),
    });
    assert(sLogin.status === 200 && sLogin.body.token, 'Student Login returns JWT token and 200');
    assert(sLogin.body.user && sLogin.body.user.role === 'STUDENT', 'Student Login user role is STUDENT');
    assert(sLogin.body.profile && sLogin.body.profile.id, 'Student Login returns profile with id');
    studentToken = sLogin.body.token;

    // Recruiter Login
    const rLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 's.jenkins@nexusai.com', password: 'recruiter123', role: 'RECRUITER' }),
    });
    assert(rLogin.status === 200 && rLogin.body.token, 'Recruiter Login returns JWT token and 200');
    assert(rLogin.body.profile && rLogin.body.profile.id, 'Recruiter Login returns profile with id');
    recruiterToken = rLogin.body.token;

    // Admin Login
    const aLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@university.edu', password: 'admin123', role: 'ADMIN' }),
    });
    assert(aLogin.status === 200 && aLogin.body.token, 'Admin Login returns JWT token and 200');
    adminToken = aLogin.body.token;

    // Bad Credentials
    const badLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alex.johnson@university.edu', password: 'wrongpassword' }),
    });
    assert(badLogin.status === 401, 'Bad credentials correctly rejected with 401');

    // Register New Student with safe random email
    const rand = Math.floor(1000 + Math.random() * 9000);
    const regStudent = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: `teststudent${rand}@university.edu`,
        password: 'password123',
        name: `Test Student ${rand}`,
        role: 'student', // lowercase test
        branch: 'Information Technology',
        cgpa: 8.8,
      }),
    });
    assert(regStudent.status === 201 && regStudent.body.token, 'Student Registration succeeds with 201 and token');
    assert(regStudent.body.profile && regStudent.body.profile.id, 'Registered student profile has id attribute');
  }

  // 3. Students Endpoints
  console.log('\n--- 3. Student Endpoints ---');
  {
    // Profile retrieval with token
    const profWithAuth = await request('/api/students/profile', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(profWithAuth.status === 200 && profWithAuth.body.name, 'GET /api/students/profile with token returns profile');
    assert(profWithAuth.body.id !== undefined, 'Student profile has id attribute for frontend compatibility');

    // Profile retrieval without token (fallback)
    const profNoAuth = await request('/api/students/profile');
    assert(profNoAuth.status === 200 && profNoAuth.body.id, 'GET /api/students/profile without token gracefully returns default profile');

    // Profile update
    const updateProf = await request('/api/students/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ phone: '+1 555-999-0000', program: 'B.Tech Honors' }),
    });
    assert(updateProf.status === 200 && updateProf.body.phone === '+1 555-999-0000', 'PUT /api/students/profile updates profile');

    // Resume Upload & ATS
    const resumeRes = await request('/api/students/resume', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        fileName: 'Resume_Test.pdf',
        content: 'Experienced software engineer skilled in React, Node.js, TypeScript, SQL, Docker, CGPA: 9.0',
      }),
    });
    assert(resumeRes.status === 200 && resumeRes.body.atsAnalysis, 'POST /api/students/resume analyzes resume');
    assert(typeof resumeRes.body.score === 'number' && resumeRes.body.score > 50, 'Resume ATS score calculated > 50');

    // List Students
    const sList = await request('/api/students');
    assert(sList.status === 200 && Array.isArray(sList.body) && sList.body.length > 0, 'GET /api/students returns student list');
    assert(sList.body[0].id !== undefined, 'Listed students have id attribute');

    // Get Student by ID
    const student1 = sList.body[0];
    const getById = await request(`/api/students/${student1.studentId || student1.id}`);
    assert(getById.status === 200 && getById.body.name, `GET /api/students/:id returns student details`);

    // Verify Student
    const verifyRes = await request(`/api/students/${student1.studentId || student1.id}/verify?is_verified=true`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(verifyRes.status === 200 && verifyRes.body.status === 'VERIFIED', 'PATCH /api/students/:id/verify updates status to VERIFIED');
  }

  // 4. Jobs Endpoints
  console.log('\n--- 4. Job Endpoints ---');
  {
    // List Jobs
    const jList = await request('/api/jobs');
    assert(jList.status === 200 && Array.isArray(jList.body) && jList.body.length > 0, 'GET /api/jobs returns jobs list');

    testJobId = jList.body[0].id;

    // Get Job by ID
    const singleJob = await request(`/api/jobs/${testJobId}`);
    assert(singleJob.status === 200 && singleJob.body.id === testJobId, `GET /api/jobs/${testJobId} returns job details`);

    // Post New Job
    const postJobRes = await request('/api/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${recruiterToken}` },
      body: JSON.stringify({
        title: 'Full Stack Cloud Developer',
        companyName: 'Apex Cloud Dynamics',
        location: 'Remote',
        ctc: '15.0 LPA',
        minCgpa: 7.5,
        eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
        skillsRequired: ['React', 'Node.js', 'Docker', 'AWS'],
        description: 'Building next generation distributed cloud platforms.',
      }),
    });
    assert(postJobRes.status === 201 && (postJobRes.body.job || postJobRes.body.id), 'POST /api/jobs creates new job with 201');
    const createdJob = postJobRes.body.job || postJobRes.body;
    assert(createdJob.id && createdJob.id.startsWith('JOB-2026-'), `Created job has valid formatted ID: ${createdJob.id}`);

    // Approve Job
    const approveRes = await request(`/api/jobs/${createdJob.id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    assert(approveRes.status === 200 && (approveRes.body.status === 'APPROVED' || approveRes.body.job?.status === 'APPROVED'), 'PATCH /api/jobs/:id/approve approves job');
  }

  // 5. Applications Endpoints
  console.log('\n--- 5. Applications Endpoints ---');
  {
    // List Applications
    const aList = await request('/api/applications');
    assert(aList.status === 200 && Array.isArray(aList.body), 'GET /api/applications returns array');

    // Apply for Job
    const applyRes = await request('/api/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ jobId: testJobId }),
    });
    assert(applyRes.status === 201 || (applyRes.status === 400 && applyRes.body.detail.includes('Already applied')),
      'POST /api/applications handles application correctly (applied or already applied)');

    if (applyRes.status === 201) {
      testAppId = applyRes.body.id || applyRes.body.application?.id;
    } else {
      const existingApps = await request(`/api/applications?job_id=${testJobId}`);
      if (existingApps.body.length > 0) {
        testAppId = existingApps.body[0].id;
      }
    }

    // Try applying again (should be rejected with 400)
    const dupApply = await request('/api/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ jobId: testJobId }),
    });
    assert(dupApply.status === 400, 'Duplicate application correctly prevented with 400');

    // Update Application Status
    if (testAppId) {
      const updateStatusRes = await request(`/api/applications/${testAppId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${recruiterToken}` },
        body: JSON.stringify({
          status: 'INTERVIEW_SCHEDULED',
          interviewDetails: {
            date: '2026-10-15',
            time: '10:00 AM',
            mode: 'Virtual (Google Meet)',
            link: 'https://meet.google.com/test-link',
          },
        }),
      });
      assert(updateStatusRes.status === 200, `PATCH /api/applications/${testAppId}/status updates status`);
    }
  }

  // 6. ATS Endpoints
  console.log('\n--- 6. ATS Resume Analyzer Endpoints ---');
  {
    // Get Target Roles
    const rolesRes = await request('/api/ats/target-roles');
    assert(rolesRes.status === 200 && Array.isArray(rolesRes.body) && rolesRes.body.length > 0, 'GET /api/ats/target-roles returns roles');

    // Analyze ATS
    const atsRes = await request('/api/ats/analyze', {
      method: 'POST',
      body: JSON.stringify({
        targetRoleId: 'fullstack',
        resumeText: 'Passionate developer proficient in React, Node.js, TypeScript, SQL, Docker, Git. Education: B.Tech CSE, CGPA: 9.2. Experience with projects and algorithms.',
      }),
    });
    assert(atsRes.status === 200 && typeof atsRes.body.score === 'number', 'POST /api/ats/analyze calculates score');
    assert(atsRes.body.matchedSkills && atsRes.body.matchedSkills.includes('React'), 'ATS correctly matches skills');
  }

  // 7. Interview Experience Endpoints
  console.log('\n--- 7. Interview Experience Endpoints ---');
  {
    const expList = await request('/api/experiences');
    assert(expList.status === 200 && Array.isArray(expList.body), 'GET /api/experiences returns experiences list');

    // Add First Experience
    const addExp1 = await request('/api/experiences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        company: 'Amazon Web Services',
        role: 'SDE Intern',
        author: 'Final Year CSE',
        rating: 4.8,
        difficulty: 'Medium-Hard',
        rounds: [
          { title: 'Online Assessment', details: '2 DSA problems + work simulation.' },
          { title: 'Technical Interview', details: 'Trees, Graphs, and Leadership Principles.' },
        ],
        tips: 'Focus heavily on BFS/DFS and STAR interview format.',
      }),
    });
    assert(addExp1.status === 201 && addExp1.body.id, `POST /api/experiences creates first experience (id: ${addExp1.body?.id})`);

    // Add Second Experience immediately (Verifying NO duplicate key collision)
    const addExp2 = await request('/api/experiences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        company: 'Google Cloud',
        role: 'SWE Intern',
        author: 'Class of 2026',
        rating: 5.0,
        difficulty: 'Hard',
        tips: 'Practice DP and Graph problems on LeetCode.',
      }),
    });
    assert(addExp2.status === 201 && addExp2.body.id && addExp2.body.id !== addExp1.body?.id,
      `POST /api/experiences creates second experience without duplicate key collision (id: ${addExp2.body?.id})`);
  }

  // 8. Notifications Endpoints
  console.log('\n--- 8. Notification Endpoints ---');
  {
    const notifs = await request('/api/notifications');
    assert(notifs.status === 200 && Array.isArray(notifs.body), 'GET /api/notifications returns array');

    // Create Notification
    const createNotif = await request('/api/notifications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Campus Placement Orientation',
        message: 'All registered students must attend the pre-placement talk tomorrow at 10 AM.',
        type: 'INFO',
      }),
    });
    assert(createNotif.status === 201 && createNotif.body.id, 'POST /api/notifications creates notification');
    testNotifId = createNotif.body.id;

    // Mark One Read
    if (testNotifId) {
      const readOne = await request(`/api/notifications/${testNotifId}/read`, { method: 'PATCH' });
      assert(readOne.status === 200 && readOne.body.success, `PATCH /api/notifications/:id/read marks single notification read`);
    }

    // Mark All Read
    const markAll = await request('/api/notifications/read-all', { method: 'PATCH' });
    assert(markAll.status === 200 && markAll.body.success, 'PATCH /api/notifications/read-all marks all notifications read');
  }

  // 9. Analytics Dashboard
  console.log('\n--- 9. Analytics Dashboard Endpoints ---');
  {
    const dash = await request('/api/analytics/dashboard');
    assert(dash.status === 200 && dash.body.totalStudents, 'GET /api/analytics/dashboard returns totalStudents');
    assert(dash.body.placementRate > 0 && dash.body.placementRate <= 100, `Placement rate is valid percentage: ${dash.body.placementRate}%`);
    assert(Array.isArray(dash.body.branchStats) && dash.body.branchStats.length > 0, 'Branch stats array present');
    assert(Array.isArray(dash.body.salaryDistribution) && dash.body.salaryDistribution.length > 0, 'Salary distribution present');
  }

  console.log('\n====================================================');
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
}

// Start testing server
server = app.listen(PORT, '127.0.0.1', () => {
  runTests().catch((err) => {
    console.error('Fatal Test Runner Error:', err);
    server.close();
    process.exit(1);
  });
});
