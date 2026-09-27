import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import htm from 'https://esm.sh/htm';
import { PortalProvider, usePortal } from './context/PortalContext.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { LoginView } from './views/loginView.js';
import { StudentView } from './views/StudentView.js';
import { RecruiterView } from './views/RecruiterView.js';
import { AdminView } from './views/adminView.js';

const html = htm.bind(React.createElement);

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
