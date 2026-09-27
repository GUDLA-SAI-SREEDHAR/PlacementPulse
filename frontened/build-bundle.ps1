# PowerShell script to create js/bundle.js for file:// direct double-click execution

$outPath = "d:\wtproject\frontened\js\bundle.js"

$files = @(
    "d:\wtproject\frontened\js\data.js",
    "d:\wtproject\frontened\js\api.js",
    "d:\wtproject\frontened\js\utils\atsEngine.js",
    "d:\wtproject\frontened\js\utils\charts.js",
    "d:\wtproject\frontened\js\utils\heatmapRenderer.js",
    "d:\wtproject\frontened\js\utils\mockInterviewEngine.js",
    "d:\wtproject\frontened\js\context\PortalContext.js",
    "d:\wtproject\frontened\js\components\Header.js",
    "d:\wtproject\frontened\js\components\Footer.js",
    "d:\wtproject\frontened\js\components\admin\AnalyticsCharts.js",
    "d:\wtproject\frontened\js\components\student\AtsChecker.js",
    "d:\wtproject\frontened\js\components\student\InterviewExperiences.js",
    "d:\wtproject\frontened\js\components\student\JobDrives.js",
    "d:\wtproject\frontened\js\components\student\MockInterview.js",
    "d:\wtproject\frontened\js\components\student\SkillGapAnalyzer.js",
    "d:\wtproject\frontened\js\components\recruiter\RecruiterDashboard.js",
    "d:\wtproject\frontened\js\components\recruiter\CompanyProfile.js",
    "d:\wtproject\frontened\js\components\recruiter\JobPostingManager.js",
    "d:\wtproject\frontened\js\components\recruiter\StudentApplicationsTable.js",
    "d:\wtproject\frontened\js\components\recruiter\CandidatePipeline.js",
    "d:\wtproject\frontened\js\components\recruiter\InterviewScheduler.js",
    "d:\wtproject\frontened\js\components\recruiter\CandidateCommunication.js",
    "d:\wtproject\frontened\js\views\loginView.js",
    "d:\wtproject\frontened\js\views\studentView.js",
    "d:\wtproject\frontened\js\views\recruiterView.js",
    "d:\wtproject\frontened\js\views\adminView.js",
    "d:\wtproject\frontened\js\app.js"
)

$bundle = @"
/**
 * PlacementPulse - Bundled Single File Application (No CORS / Module Restrictions)
 * Optimized for file:// protocol direct double-click loading
 */
(function() {
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

"@

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw -Encoding UTF8
        # Remove import lines
        $content = $content -replace '(?m)^import\s+.*?;\r?\n?', ''
        # Replace export const -> const
        $content = $content -replace '(?m)^export\s+const\s+', 'const '
        # Replace export function -> function
        $content = $content -replace '(?m)^export\s+function\s+', 'function '
        # Replace const html = htm.bind(React.createElement); -> // const html ...
        $content = $content -replace '(?m)^const html = htm\.bind\(React\.createElement\);', ''
        
        $bundle += "`n// --- Source: " + [System.IO.Path]::GetFileName($f) + " ---`n"
        $bundle += $content + "`n"
    }
}

$bundle += @"

})();
"@

[System.IO.File]::WriteAllText($outPath, $bundle, [System.Text.Encoding]::UTF8)
Write-Host "bundle.js successfully created at $outPath"
