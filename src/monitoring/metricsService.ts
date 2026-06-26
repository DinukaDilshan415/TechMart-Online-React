import { TECHMART_BASE_URL, DEFAULT_HEADERS } from '../api/client';

// src/services/metricsService.ts

export interface MetricsDTO {
  avgResponseTimeMs:  number;
  activeSessionCount: number;
  activeOrders:       number;
  jmsMessageCount:    number;
  mdbProcessingRate:  number;
  dbConnectionsInUse: number;
  dbConnectionsMax:   number;  // now 200
  dbPoolMin:          number;  // now 50
  dbUsagePercent:     number;  // real % from tracker
  jmsQueueDepth:      number;
  heapUsedMB:         number;
  heapMaxMB:          number;
  uptimePercent:      number;
  minResponseTimeMs: number;
  maxResponseTimeMs: number;
  asyncTimeoutCount: number;
  asyncExecutionDurationMs: number;
  dbConnectionAcquisitionWaitMs: number;
  activeMdbPoolCount: number;
  maxMdbPoolSize: number;
}

// Full Payara URL — change 'techmart' to match your WAR context root
const METRICS_URL = `${TECHMART_BASE_URL}/api/metrics`;

export async function fetchMetrics(): Promise<MetricsDTO> {
  const res = await fetch(METRICS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  return res.json();
}