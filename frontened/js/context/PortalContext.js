import React, { createContext, useContext, useState, useEffect } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { INITIAL_DATA } from '../data.js';
import { api } from '../api.js';

const html = htm.bind(React.createElement);
const STORAGE_KEY = 'vpc_portal_state_v1';

const PortalContext = createContext(null);

export function PortalProvider({ children }) {
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
        nextStudent.id = 'STU-' + Date.now().toString().slice(-4);
        nextStudent.rollNo = '22BCS' + Math.floor(100 + Math.random() * 900);
        nextStudent.name = name;
        nextStudent.email = email;
        if (branch) nextStudent.branch = branch;
        if (cgpa) nextStudent.cgpa = parseFloat(cgpa);
        if (!nextStudent.skills || nextStudent.skills.length === 0) {
          nextStudent.skills = ['JavaScript', 'React', 'Python', 'Data Structures', 'SQL'];
        }
        if (!nextStudent.resume || !nextStudent.resume.content) {
          nextStudent.resume = {
            fileName: 'Resume_Draft.txt',
            uploadDate: new Date().toISOString().split('T')[0],
            atsScore: 78,
            content: 'Experienced student with skills in JavaScript, React, Python, Data Structures, and SQL.'
          };
        }
        if (!nextStudent.readinessBreakdown || nextStudent.readinessBreakdown.overall === 0) {
          nextStudent.readinessBreakdown = {
            overall: 78,
            technical: 80,
            aptitude: 75,
            softSkills: 80,
            resumeQuality: 78
          };
        }
      } else if (role === 'RECRUITER') {
        nextRecruiter.id = 'REC-' + Date.now().toString().slice(-4);
        nextRecruiter.companyName = name;
        nextRecruiter.email = email;
        nextRecruiter.industry = 'Technology & Software';
        nextRecruiter.contactPerson = name + ' HR Team';
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

    const currentStudentId = state.studentProfile?.id || state.studentProfile?.studentId || '101';
    const existing = state.applications.find(
      a => (String(a.studentId) === String(currentStudentId) || String(a.studentId) === String(state.studentProfile?.id)) && a.jobId === jobId
    );
    if (existing) return false;

    try {
      await api.applyForJob(jobId);
    } catch (err) {
      console.warn('[ApplyJob] Backend apply warning:', err.message);
    }

    const newApp = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      studentId: currentStudentId,
      studentName: state.studentProfile?.name || 'Student',
      rollNo: state.studentProfile?.rollNo || '22BCS101',
      branch: state.studentProfile?.branch || 'Computer Science',
      cgpa: state.studentProfile?.cgpa || 8.0,
      atsScore: state.studentProfile?.resume?.atsScore || 84,
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

    const recruiterId = state.recruiterProfile?.id || 'REC-01';
    const companyName = state.recruiterProfile?.companyName || 'Recruiter Corp';

    const newJob = {
      id: `JOB-${new Date().getFullYear()}-${(state.jobs.length + 1).toString().padStart(2, '0')}`,
      recruiterId,
      companyName,
      ...jobData,
      status: 'PENDING',
      postedDate: new Date().toISOString().split('T')[0]
    };

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Job Pending Approval',
      message: `Recruiter ${companyName} submitted a job: ${jobData.title}`,
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

  const broadcastNotification = (title, message, type = 'ANNOUNCEMENT') => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false
    };

    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }));
    return true;
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
    broadcastNotification,
    resetDemoData
  };

  return html`<${PortalContext.Provider} value=${value}>${children}<//>`;
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
