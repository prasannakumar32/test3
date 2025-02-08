import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from '../../components/DashboardCard';
import { useAuth } from '../../hooks/useAuth';

function Dashboard({ site, periods }) {
  const [activeView, setActiveView] = useState('overview');
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!site || !periods) {
    return <div>No data available</div>;
  }

  const reportData = periods.map((period, index) => ({
    name: period.name,
    production: site.productionSite[period.name],
    consumption: period.demand,
    allocation: period.allocation,
    banking: period.bankingAllocation || 0,
    lapse: site.productionSite[period.name] - period.demand,
    key: `${period.name}-${index}`
  }));

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="report-cards">
        <DashboardCard
          title="Graph Report"
          type="graph"
          onClick={() => setActiveView('graph')}
          isActive={activeView === 'graph'}
        />
        <DashboardCard
          title="Tabular Report"
          type="table"
          onClick={() => setActiveView('table')}
          isActive={activeView === 'table'}
        />
      </div>

      <div className="dashboard-content">
        {activeView === 'graph' && (
          <section className="graph-section">
            <h3>Graph Report</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="production" fill="#82ca9d" name="Production" />
                <Bar dataKey="consumption" fill="#8884d8" name="Consumption" />
                <Bar dataKey="banking" fill="#ffc658" name="Banking" />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}

        {activeView === 'table' && (
          <section className="table-section">
            <h3>Tabular Report</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Production</th>
                    <th>Consumption</th>
                    <th>Lapse</th>
                    <th>Allocation</th>
                    <th>Banking</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map(period => (
                    <tr key={period.key}>
                      <td>{period.name}</td>
                      <td>{period.production}</td>
                      <td>{period.consumption}</td>
                      <td>{period.lapse}</td>
                      <td>{period.allocation}</td>
                      <td>{period.banking}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <style>
        {`
          .dashboard {
            padding: 20px;
          }

          h2 {
            margin-bottom: 20px;
            color: #333;
          }

          .report-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .dashboard-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          section {
            padding: 20px;
          }

          h3 {
            color: #444;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }

          .table-container {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
          }

          th {
            background-color: #f5f5f5;
            text-align: center;
            font-weight: 600;
          }

          td {
            font-family: monospace;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          tr:hover {
            background-color: #f0f0f0;
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard; 