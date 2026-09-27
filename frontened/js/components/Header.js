import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../context/PortalContext.js';

const html = htm.bind(React.createElement);

export function Header() {
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
            ${currentRole === 'STUDENT' ? ((state.studentProfile?.name || 'S').slice(0, 2).toUpperCase()) : currentRole === 'RECRUITER' ? ((state.recruiterProfile?.companyName || 'R').slice(0, 2).toUpperCase()) : 'PO'}
          </div>
          <div className="user-meta">
            <span className="user-name">
              ${currentRole === 'STUDENT' ? (state.studentProfile?.name || 'Student') : currentRole === 'RECRUITER' ? (state.recruiterProfile?.companyName || 'Recruiter') : 'Dr. M. Sharma'}
            </span>
            <span className=${`user-role-badge ${(currentRole || 'STUDENT').toLowerCase()}`}>
              ${(currentRole || 'STUDENT').replace('_', ' ')}
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
