/**
 * Common View Components (Header, Navbar, Role Switcher, Notifications Drawer)
 */
import { store } from '../store.js';

export function renderHeader(container) {
  const state = store.getState();
  const currentRole = state.currentUserRole;
  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  container.innerHTML = `
    <header class="app-header">
      <div class="header-left">
        <div class="brand-logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">PlacementPulse</span>
            <span class="brand-tag">Virtual Placement Cell Portal</span>
          </div>
        </div>
      </div>

      <div class="header-center">
        <!-- Active Portal Security Badge -->
        <div class="active-portal-badge ${currentRole.toLowerCase()}">
          <span class="portal-badge-icon">
            ${currentRole === 'STUDENT' ? '🎓' : currentRole === 'RECRUITER' ? '🏢' : '🛡️'}
          </span>
          <span class="portal-badge-text">
            ${currentRole === 'STUDENT' ? 'Student Career Portal' : currentRole === 'RECRUITER' ? 'Recruiter Dashboard' : 'Placement Officer Admin'}
          </span>
        </div>
      </div>

      <div class="header-right">
        <!-- Notification Bell -->
        <div class="notif-wrapper">
          <button class="notif-bell-btn" id="notif-bell-trigger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            ${unreadCount > 0 ? `<span class="notif-badge-count">${unreadCount}</span>` : ''}
          </button>
          <div class="notif-dropdown hidden" id="notif-dropdown-menu">
            <div class="notif-header">
              <h5>Notifications (${unreadCount} New)</h5>
              <button class="text-btn" id="mark-read-btn">Mark All Read</button>
            </div>
            <div class="notif-list">
              ${state.notifications.length === 0 ? '<div class="empty-notif">No notifications</div>' : ''}
              ${state.notifications.map(n => `
                <div class="notif-item ${n.isRead ? 'read' : 'unread'}">
                  <div class="notif-icon-box ${n.type}">
                    ${n.type === 'INTERVIEW' ? '📅' : n.type === 'APPLICATION' ? '📋' : '📢'}
                  </div>
                  <div class="notif-content">
                    <span class="notif-title">${n.title}</span>
                    <p class="notif-msg">${n.message}</p>
                    <span class="notif-time">${n.date}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- User Profile Pill & Logout -->
        <div class="user-profile-pill">
          <div class="user-avatar">
            ${currentRole === 'STUDENT' ? 'AJ' : currentRole === 'RECRUITER' ? 'NA' : 'PO'}
          </div>
          <div class="user-meta">
            <span class="user-name">
              ${currentRole === 'STUDENT' ? state.studentProfile.name : currentRole === 'RECRUITER' ? state.recruiterProfile.companyName : 'Dr. M. Sharma'}
            </span>
            <span class="user-role-badge ${currentRole.toLowerCase()}">${currentRole.replace('_', ' ')}</span>
          </div>
          <button class="btn-logout-icon" id="btn-logout-trigger" title="Sign Out / Change User">
            🚪
          </button>
        </div>
      </div>
    </header>
  `;

  // Attach Event Listeners
  const bellTrigger = container.querySelector('#notif-bell-trigger');
  const dropdown = container.querySelector('#notif-dropdown-menu');
  if (bellTrigger && dropdown) {
    bellTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !bellTrigger.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  const markReadBtn = container.querySelector('#mark-read-btn');
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      store.markAllNotificationsRead();
    });
  }

  const logoutBtn = container.querySelector('#btn-logout-trigger');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to sign out?')) {
        store.logout();
      }
    });
  }
}

export function renderFooter(container) {
  container.innerHTML = `
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span>PlacementPulse &copy; 2026 Virtual Placement Cell Portal</span>
          <span class="dot-sep">•</span>
          <span>Designed for Excellence & Career Success</span>
        </div>
        <div class="footer-links">
          <a href="#reset" id="reset-demo-link">Reset Demo Data</a>
          <span class="dot-sep">•</span>
          <a href="#help">Help & Documentation</a>
        </div>
      </div>
    </footer>
  `;

  const resetLink = container.querySelector('#reset-demo-link');
  if (resetLink) {
    resetLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to reset all portal demo data to default?')) {
        store.resetDemoData();
      }
    });
  }
}
