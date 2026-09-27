/**
 * SVG Chart Generators for Placement Analytics
 */

export function renderBranchBarChart(containerId, branchData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const maxRate = 100;
  
  let barsHTML = branchData.map(b => {
    const heightPercent = (b.rate / maxRate) * 100;
    return `
      <div class="chart-bar-group">
        <div class="chart-bar-value">${b.rate}%</div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="height: ${heightPercent}%;"></div>
        </div>
        <div class="chart-bar-label">${b.branch}</div>
        <div class="chart-bar-sub">${b.placed}/${b.total}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="bar-chart-wrapper">
      <div class="chart-title-area">
        <h4>Branch-wise Placement Statistics (Batch 2026)</h4>
        <span class="badge badge-success">Overall 84.8% Placed</span>
      </div>
      <div class="bar-chart-grid">
        ${barsHTML}
      </div>
    </div>
  `;
}

export function renderSalaryDonutChart(containerId, salaryData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render visual donut segments and legend
  const totalCount = salaryData.reduce((acc, curr) => acc + curr.count, 0);

  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

  let legendHTML = salaryData.map((s, idx) => `
    <div class="donut-legend-item">
      <span class="legend-color" style="background: ${colors[idx % colors.length]}"></span>
      <div class="legend-info">
        <span class="legend-tier">${s.tier}</span>
        <span class="legend-count">${s.count} Students (${s.percentage}%)</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="donut-chart-card">
      <h4>Salary Package Distribution (CTC)</h4>
      <div class="donut-content">
        <div class="donut-visual">
          <svg viewBox="0 0 100 100" class="donut-svg">
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="14"></circle>
            <!-- SVG stroke dasharray representation -->
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#6366f1" stroke-width="14" stroke-dasharray="26 213" stroke-dashoffset="0"></circle>
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" stroke-width="14" stroke-dasharray="79 160" stroke-dashoffset="-26"></circle>
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" stroke-width="14" stroke-dasharray="102 137" stroke-dashoffset="-105"></circle>
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" stroke-width="14" stroke-dasharray="31 208" stroke-dashoffset="-207"></circle>
          </svg>
          <div class="donut-center-text">
            <span class="center-val">${totalCount}</span>
            <span class="center-lbl">Offers</span>
          </div>
        </div>
        <div class="donut-legend">
          ${legendHTML}
        </div>
      </div>
    </div>
  `;
}
