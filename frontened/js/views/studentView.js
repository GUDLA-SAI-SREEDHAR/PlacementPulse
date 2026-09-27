import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../context/PortalContext.js';
import { AtsChecker } from '../components/student/AtsChecker.js';
import { SkillGapAnalyzer } from '../components/student/SkillGapAnalyzer.js';
import { MockInterview } from '../components/student/MockInterview.js';
import { JobDrives } from '../components/student/JobDrives.js';
import { InterviewExperiences } from '../components/student/InterviewExperiences.js';

const html = htm.bind(React.createElement);

export function StudentView() {
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
