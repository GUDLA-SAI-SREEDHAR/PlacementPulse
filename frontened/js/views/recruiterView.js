import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../context/PortalContext.js';
import { RecruiterDashboard } from '../components/recruiter/RecruiterDashboard.js';
import { CompanyProfile } from '../components/recruiter/CompanyProfile.js';
import { JobPostingManager } from '../components/recruiter/JobPostingManager.js';
import { StudentApplicationsTable } from '../components/recruiter/StudentApplicationsTable.js';
import { CandidatePipeline } from '../components/recruiter/CandidatePipeline.js';
import { InterviewScheduler } from '../components/recruiter/InterviewScheduler.js';
import { CandidateCommunication } from '../components/recruiter/CandidateCommunication.js';

const html = htm.bind(React.createElement);

export function RecruiterView() {
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
