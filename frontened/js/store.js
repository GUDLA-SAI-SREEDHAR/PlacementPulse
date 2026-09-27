/**
 * State Store for Virtual Placement Cell Portal
 */
import { INITIAL_DATA } from './data.js';

const STORAGE_KEY = 'vpc_portal_state_v1';

class PortalStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved portal state, loading defaults.', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.state));
  }

  getState() {
    return this.state;
  }

  setRole(role) {
    this.state.currentUserRole = role;
    this.saveState();
  }

  login(email, password, role) {
    const creds = this.state.validCredentials[role];
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

    // Check against predefined valid credentials or dynamically registered credentials
    if (creds && email.toLowerCase() === creds.email.toLowerCase() && password === creds.password) {
      this.state.isAuthenticated = true;
      this.state.currentUserRole = role;
      this.saveState();
      return { success: true, message: 'Login successful!' };
    }

    return { 
      success: false, 
      message: `Invalid credentials for ${role} role. Please check your email and password.` 
    };
  }

  logout() {
    this.state.isAuthenticated = false;
    this.saveState();
  }

  register(userData) {
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

    // Register user credentials
    this.state.validCredentials[role] = { email, password };
    
    if (role === 'STUDENT') {
      this.state.studentProfile.name = name;
      this.state.studentProfile.email = email;
      if (branch) this.state.studentProfile.branch = branch;
      if (cgpa) this.state.studentProfile.cgpa = parseFloat(cgpa);
    } else if (role === 'RECRUITER') {
      this.state.recruiterProfile.companyName = name;
      this.state.recruiterProfile.email = email;
    }

    this.state.isAuthenticated = true;
    this.state.currentUserRole = role;
    this.saveState();

    return { success: true, message: 'Registration successful! Logged in as ' + name };
  }

  updateStudentProfile(profileUpdates) {
    this.state.studentProfile = { ...this.state.studentProfile, ...profileUpdates };
    this.saveState();
  }

  updateResumeContent(newContent, newFileName = 'Uploaded_Resume.pdf') {
    // Re-calculate mock ATS score based on keyword density
    const score = this.calculateAtsScore(newContent);
    this.state.studentProfile.resume = {
      fileName: newFileName,
      uploadDate: new Date().toISOString().split('T')[0],
      atsScore: score,
      content: newContent
    };
    this.state.studentProfile.readinessBreakdown.resumeQuality = Math.min(100, score + 5);
    this.state.studentProfile.readinessBreakdown.overall = Math.round(
      (this.state.studentProfile.readinessBreakdown.technical +
        this.state.studentProfile.readinessBreakdown.aptitude +
        this.state.studentProfile.readinessBreakdown.softSkills +
        score) / 4
    );
    this.saveState();
    return score;
  }

  calculateAtsScore(text) {
    if (!text || text.trim().length === 0) return 0;
    const coreKeywords = ['react', 'javascript', 'python', 'node', 'sql', 'git', 'data structures', 'algorithms', 'project', 'experience', 'education', 'cgpa', 'full-stack', 'developer', 'aws'];
    const lower = text.toLowerCase();
    let matches = 0;
    coreKeywords.forEach(kw => {
      if (lower.includes(kw)) matches++;
    });
    const baseScore = Math.min(95, Math.round((matches / coreKeywords.length) * 100));
    return Math.max(45, baseScore);
  }

  applyForJob(jobId) {
    const job = this.state.jobs.find(j => j.id === jobId);
    if (!job) return false;

    // Check if already applied
    const existing = this.state.applications.find(
      a => a.studentId === this.state.studentProfile.id && a.jobId === jobId
    );
    if (existing) return false;

    const newApp = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      studentId: this.state.studentProfile.id,
      studentName: this.state.studentProfile.name,
      rollNo: this.state.studentProfile.rollNo,
      branch: this.state.studentProfile.branch,
      cgpa: this.state.studentProfile.cgpa,
      atsScore: this.state.studentProfile.resume.atsScore || 84,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      applyDate: new Date().toISOString().split('T')[0],
      status: 'APPLIED'
    };

    this.state.applications.unshift(newApp);

    // Add notification
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: 'Application Submitted',
      message: `You successfully applied for ${job.title} at ${job.companyName}.`,
      type: 'APPLICATION',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false
    });

    this.saveState();
    return true;
  }

  updateApplicationStatus(appId, newStatus, interviewDetails = null) {
    const app = this.state.applications.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      if (interviewDetails) {
        app.interviewDetails = interviewDetails;
      }
      this.state.notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        title: `Application Status Updated: ${newStatus.replace('_', ' ')}`,
        message: `Your application for ${app.jobTitle} at ${app.companyName} is now ${newStatus.replace('_', ' ')}.`,
        type: 'STATUS',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isRead: false
      });
      this.saveState();
    }
  }

  postNewJob(jobData) {
    const newJob = {
      id: `JOB-${new Date().getFullYear()}-${(this.state.jobs.length + 1).toString().padStart(2, '0')}`,
      recruiterId: this.state.recruiterProfile.id,
      companyName: this.state.recruiterProfile.companyName,
      ...jobData,
      status: 'PENDING', // Needs admin approval
      postedDate: new Date().toISOString().split('T')[0]
    };
    this.state.jobs.unshift(newJob);
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: 'New Job Pending Approval',
      message: `Recruiter ${this.state.recruiterProfile.companyName} submitted a job: ${jobData.title}`,
      type: 'JOB',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false
    });
    this.saveState();
    return newJob;
  }

  approveJob(jobId, status = 'APPROVED') {
    const job = this.state.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = status;
      this.saveState();
    }
  }

  verifyStudent(studentId, isVerified) {
    const s = this.state.studentsList.find(st => st.id === studentId);
    if (s) {
      s.status = isVerified ? 'VERIFIED' : 'PENDING';
      this.saveState();
    }
  }

  addInterviewExperience(expData) {
    const newExp = {
      id: `EXP-${Date.now()}`,
      ...expData,
      date: 'Just Now'
    };
    this.state.interviewExperiences.unshift(newExp);
    this.saveState();
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.isRead = true);
    this.saveState();
  }

  resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.notify();
  }
}

export const store = new PortalStore();
