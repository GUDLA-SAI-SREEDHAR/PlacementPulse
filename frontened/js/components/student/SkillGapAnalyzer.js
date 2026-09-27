import React from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../../context/PortalContext.js';

const html = htm.bind(React.createElement);

export function SkillGapAnalyzer() {
  const { state } = usePortal();
  const student = state.studentProfile || {};
  const roles = state.targetRoles || [];
  const studentSkills = Array.isArray(student.skills) ? student.skills : [];

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>AI Skill Gap Analyzer</h2>
        <p>Compare your current technical skills against target industry career paths.</p>
      </div>

      <div className="target-roles-grid">
        ${roles.map(role => {
          const matched = (role.requiredSkills || []).filter(s => studentSkills.some(st => st.toLowerCase() === s.toLowerCase()));
          const missing = (role.requiredSkills || []).filter(s => !studentSkills.some(st => st.toLowerCase() === s.toLowerCase()));
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
