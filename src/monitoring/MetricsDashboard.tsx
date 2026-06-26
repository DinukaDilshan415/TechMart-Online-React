

import { useMetrics } from '../monitoring/useMetrics';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function MetricsDashboard() {
  const { data, history, error, loading } = useMetrics(3000);
  const chartRef  = useRef<HTMLCanvasElement>(null);
  const chartInst = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInst.current) {
      chartInst.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: history.map((_, i) => `T-${history.length - i}`),
          datasets: [{
            label: 'Response time (ms)',
            data: history,
            borderColor: '#185FA5',
            borderWidth: 1.5,
            pointRadius: 2,
            fill: true,
            tension: 0.35,
            backgroundColor: 'rgba(24,95,165,0.08)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { ticks: { font: { size: 10 } } }
          }
        }
      });
    } else {
      chartInst.current.data.datasets[0].data = history;
      chartInst.current.data.labels = history.map((_, i) => `T-${history.length - i}`);
      chartInst.current.update('none'); 
    }
  }, [history]);

  if (loading) return <div className="p-4 text-gray-500">Connecting to Payara...</div>;

  if (error) return (
    <div className="p-4 text-red-500 bg-red-50 rounded-lg">
      ⚠ {error} — make sure Payara is running on port 8080 and techmart is deployed
    </div>
  );

  if (!data) return null;


  const dbPercent   = Math.round((data.dbConnectionsInUse / data.dbConnectionsMax) * 100);
  const heapPercent = Math.round((data.heapUsedMB / data.heapMaxMB) * 100);
  const mdbPercent  = Math.round((data.activeMdbPoolCount / data.maxMdbPoolSize) * 100 || 0);

  return (
    <div className="py-6 px-10 bg-gray-50 min-h-screen font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">TechMart Performance Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Enterprise Java EE Telemetry Monitoring Engine</p>
        </div>
        <span className="text-sm text-green-600 font-bold bg-green-50 border border-green-200 px-3 py-1 rounded-full animate-pulse">
          ● Live
        </span>
      </div>

      {/* Core KPI Grid */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Core Transaction Metrics</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard label="Avg response"    value={data.avgResponseTimeMs.toFixed(1)} unit="ms" />
        <KpiCard label="Active sessions" value={data.activeSessionCount} />
        <KpiCard label="Active orders"   value={data.activeOrders} />
        <KpiCard label="JMS messages"    value={data.jmsMessageCount.toLocaleString()} />
        <KpiCard label="MDB rate"        value={data.mdbProcessingRate} unit="/min" />
        <KpiCard label="DB connections"  value={`${data.dbConnectionsInUse}/${data.dbConnectionsMax}`} />
      </div>

      {/* Advanced Telemetry Section (Newly Added Fields) */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Advanced Component Profiling</h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        <KpiCard label="Min EJB Latency" value={data.minResponseTimeMs ?? 0} unit="ms" color="bg-blue-50 border border-blue-100" />
        <KpiCard label="Max EJB Latency" value={data.maxResponseTimeMs ?? 0} unit="ms" color={data.maxResponseTimeMs > 1000 ? "bg-red-50 border border-red-100" : "bg-blue-50 border border-blue-100"} />
        <KpiCard label="DB Acquisition Wait" value={(data.dbConnectionAcquisitionWaitMs ?? 0).toFixed(1)} unit="ms" color="bg-amber-50 border border-amber-100" />
        <KpiCard label="Async Timeout Faults" value={data.asyncTimeoutCount ?? 0} unit="err" color={data.asyncTimeoutCount > 0 ? "bg-red-50 border border-red-100 text-red-600" : "bg-green-50 border border-green-100"} />
      </div>

      {/* Sparkline */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 shadow-sm">
        <p className="text-xs font-medium text-gray-700 mb-1">EJB Response Time History</p>
        <p className="text-xs text-gray-400 mb-3">ms</p>
        <div style={{ position: 'relative', height: 140 }}>
          <canvas ref={chartRef} />
        </div>
      </div>

      {/* Progress bars & Resource Saturation Profiles */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Resource Saturation Profiles</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatusBar label="DB Connection Pool" percent={dbPercent}
          detail={`${data.dbConnectionsInUse} / ${data.dbConnectionsMax}`} />
        <StatusBar label="JVM Heap Memory"    percent={heapPercent}
          detail={`${data.heapUsedMB.toFixed(0)} / ${data.heapMaxMB.toFixed(0)} MB`} />
        <StatusBar label="JMS Queue Depth"    percent={Math.min(data.jmsQueueDepth * 2, 100)}
          detail={`${data.jmsQueueDepth} pending`} />
        <StatusBar label="Uptime SLA"         percent={data.uptimePercent}
          detail={`${data.uptimePercent}%`} />
        <StatusBar label="MDB Thread Pool Utilization" percent={mdbPercent}
          detail={`${data.activeMdbPoolCount ?? 0} / ${data.maxMdbPoolSize ?? 0} active`} />
        <StatusBar label="Async Background Work" percent={Math.min((data.asyncExecutionDurationMs / 5000) * 100, 100)}
          detail={`${data.asyncExecutionDurationMs ?? 0} ms duration`} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, unit = '', color = 'bg-gray-100' }: { label: string; value: any; unit?: string; color?: string }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">
        {value}<span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}

function StatusBar({ label, percent, detail }: { label: string; percent: number; detail: string }) {
  const color = percent > 80 ? '#BA7517' : '#0F6E56';
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between text-xs font-medium mb-2">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-500">{detail}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div style={{ width: `${percent}%`, background: color }}
             className="h-full rounded-full transition-all duration-500" />
      </div>
    </div>
  );
}