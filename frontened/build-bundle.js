/**
 * PlacementPulse - Bundle Builder (Node.js Cross-Platform)
 * Builds frontened/js/bundle.js for file:// direct double-click execution and Vercel static serving
 */
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const outPath = path.join(baseDir, 'js', 'bundle.js');

const files = [
  path.join(baseDir, 'js', 'data.js'),
  path.join(baseDir, 'js', 'api.js'),
  path.join(baseDir, 'js', 'utils', 'atsEngine.js'),
  path.join(baseDir, 'js', 'utils', 'charts.js'),
  path.join(baseDir, 'js', 'utils', 'heatmapRenderer.js'),
  path.join(baseDir, 'js', 'utils', 'mockInterviewEngine.js'),
  path.join(baseDir, 'js', 'context', 'PortalContext.js'),
  path.join(baseDir, 'js', 'components', 'Header.js'),
  path.join(baseDir, 'js', 'components', 'Footer.js'),
  path.join(baseDir, 'js', 'components', 'admin', 'AnalyticsCharts.js'),
  path.join(baseDir, 'js', 'components', 'student', 'AtsChecker.js'),
  path.join(baseDir, 'js', 'components', 'student', 'InterviewExperiences.js'),
  path.join(baseDir, 'js', 'components', 'student', 'JobDrives.js'),
  path.join(baseDir, 'js', 'components', 'student', 'MockInterview.js'),
  path.join(baseDir, 'js', 'components', 'student', 'SkillGapAnalyzer.js'),
  path.join(baseDir, 'js', 'components', 'recruiter', 'RecruiterDashboard.js'),
  path.join(baseDir, 'js', 'components', 'recruiter', 'CompanyProfile.js'),
  path.join(baseDir, 'js', 'components', 'recruiter', 'JobPostingManager.js'),
  path.join(baseDir, 'js', 'components', 'recruiter', 'StudentApplicationsTable.js'),
  path.join(baseDir, 'js', 'components', 'recruiter', 'CandidatePipeline.js'),
  path.join(baseDir, 'js', 'components', 'recruiter', 'InterviewScheduler.js'),
  path.join(baseDir, 'js', 'components', 'recruiter', 'CandidateCommunication.js'),
  path.join(baseDir, 'js', 'views', 'loginView.js'),
  path.join(baseDir, 'js', 'views', 'studentView.js'),
  path.join(baseDir, 'js', 'views', 'recruiterView.js'),
  path.join(baseDir, 'js', 'views', 'adminView.js'),
  path.join(baseDir, 'js', 'app.js')
];

let bundle = `/**
 * PlacementPulse - Bundled Single File Application (No CORS / Module Restrictions)
 * Optimized for file:// protocol direct double-click loading & Vercel deployment
 */
(function () {
  'use strict';

  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const htm = window.htm;
  if (!React || !ReactDOM || !htm) {
    console.error('PlacementPulse: React, ReactDOM, or HTM libraries failed to load.');
    return;
  }

  const { createContext, useContext, useState, useEffect, useRef } = React;
  const html = htm.bind(React.createElement);
`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found: ' + filePath);
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Strip multi-line and single-line imports
  content = content.replace(/^import\s+[\s\S]*?;\s*$/gm, '');

  // Strip export statements
  content = content.replace(/^export\s+const\s+/gm, 'const ');
  content = content.replace(/^export\s+function\s+/gm, 'function ');
  content = content.replace(/^export\s+class\s+/gm, 'class ');
  content = content.replace(/^export\s+default\s+/gm, '');

  // Strip redundant html binding declarations in components since top-level provides it
  content = content.replace(/^const html = htm\.bind\(React\.createElement\);/gm, '');

  const fileName = path.basename(filePath);
  bundle += `\n// --- Source: ${fileName} ---\n` + content + '\n';
}

bundle += `\n})();\n`;

fs.writeFileSync(outPath, bundle, 'utf8');
console.log(`Bundle successfully created at ${outPath} (${(bundle.length / 1024).toFixed(1)} KB)`);
