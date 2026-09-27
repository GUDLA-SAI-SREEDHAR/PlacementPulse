import React, { useEffect, useRef } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { renderBranchBarChart, renderSalaryDonutChart } from '../../utils/charts.js';

const html = htm.bind(React.createElement);

export function AnalyticsCharts({ branchStats, salaryDistribution }) {
  const barContainerRef = useRef(null);
  const donutContainerRef = useRef(null);

  useEffect(() => {
    if (barContainerRef.current) {
      barContainerRef.current.id = 'chart-branch-bar-container';
      renderBranchBarChart('chart-branch-bar-container', branchStats);
    }
    if (donutContainerRef.current) {
      donutContainerRef.current.id = 'chart-salary-donut-container';
      renderSalaryDonutChart('chart-salary-donut-container', salaryDistribution);
    }
  }, [branchStats, salaryDistribution]);

  return html`
    <div className="content-row mt-4">
      <div className="card card-flex-1">
        <div className="card-body">
          <div ref=${barContainerRef}></div>
        </div>
      </div>
      <div className="card card-flex-1">
        <div className="card-body">
          <div ref=${donutContainerRef}></div>
        </div>
      </div>
    </div>
  `;
}
