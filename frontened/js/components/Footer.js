import React from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

export function Footer() {
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
