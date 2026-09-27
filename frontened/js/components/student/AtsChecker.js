import React, { useEffect, useRef } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../../context/PortalContext.js';
import { analyzeResume } from '../../utils/atsEngine.js';
import { renderResumeHeatmap } from '../../utils/heatmapRenderer.js';

const html = htm.bind(React.createElement);

export function AtsChecker({ isHeatmapOnly = false }) {
  const { state } = usePortal();
  const student = state.studentProfile || {};
  const heatmapContainerRef = useRef(null);

  const resumeContent = student.resume?.content || '';
  const analysis = analyzeResume(resumeContent, 'software');

  useEffect(() => {
    if (heatmapContainerRef.current) {
      renderResumeHeatmap(heatmapContainerRef.current, analysis.heatmapLines || []);
    }
  }, [student.resume?.content]);

  if (isHeatmapOnly) {
    return html`
      <div className="tab-pane animate-fade-in">
        <div className="page-title-bar">
          <h2>Resume Visual Heatmap</h2>
          <p>Interactive visualization showing section formatting density, target keyword highlights, and scanner line.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Interactive Keyword & Density Heatmap</h3>
          </div>
          <div className="card-body">
            <div ref=${heatmapContainerRef}></div>
          </div>
        </div>
      </div>
    `;
  }

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>ATS Resume Checker</h2>
        <p>Analyze how Applicant Tracking Systems (ATS) score your resume against target tech keywords.</p>
      </div>

      <div className="card max-w-2xl">
        <div className="card-header">
          <h3>ATS Analysis Scorecard</h3>
          <span className=${`score-pill-lg ${analysis.atsScore >= 80 ? 'high' : 'med'}`}>
            ${analysis.atsScore} / 100
          </span>
        </div>
        <div className="card-body">
          <div className="section-check-list mb-4">
            <h4>Section Format Checklist</h4>
            <div className=${`check-item ${analysis.sectionScores.contact > 50 ? 'pass' : 'fail'}`}>
              <span>Contact Info & Links</span>
              <span>${analysis.sectionScores.contact > 50 ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div className=${`check-item ${analysis.sectionScores.summary > 50 ? 'pass' : 'fail'}`}>
              <span>Professional Summary</span>
              <span>${analysis.sectionScores.summary > 50 ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div className=${`check-item ${analysis.sectionScores.education > 50 ? 'pass' : 'fail'}`}>
              <span>Education & CGPA</span>
              <span>${analysis.sectionScores.education > 50 ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div className=${`check-item ${analysis.sectionScores.skills > 50 ? 'pass' : 'fail'}`}>
              <span>Technical Skills Section</span>
              <span>${analysis.sectionScores.skills > 50 ? '✓ Present' : '✗ Missing'}</span>
            </div>
          </div>

          <h4>Matched Keywords (${analysis.matchedKeywords.length})</h4>
          <div className="kw-chips mb-3">
            ${analysis.matchedKeywords.map(kw => html`<span key=${kw} className="chip chip-success">${kw}</span>`)}
          </div>

          <h4>Recommended Missing Keywords</h4>
          <div className="kw-chips mb-3">
            ${analysis.missingKeywords.map(kw => html`<span key=${kw} className="chip chip-warning">+ ${kw}</span>`)}
          </div>

          <div className="mt-4">
            <h4>Live Resume Scan Heatmap</h4>
            <div ref=${heatmapContainerRef}></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
