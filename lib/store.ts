import type {Incident, Evidence, ActionReceipt, AgentEvent} from './types';

export type Severity = 'P0' | 'P1' | 'P2';
export type IncidentStatus = 'Active' | 'Investigating' | 'Mitigated' | 'Resolved' | 'Closed';

export type AgentRun = {
  id: string;
  scenario: string;
  triggeredBy: string;
  triggeredAt: string;
  durationMs: number;
  status: 'completed' | 'running' | 'failed';
  confidence: number;
  incidentId?: string;
  summary: string;
  steps: {step: number; title: string; detail: string; at: string}[];
};

export type Workspace = {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  safetyPolicy: {
    autoExecute: string[];
    approvalRequired: string[];
  };
  monthlyStats: {
    incidentsHandled: number;
    actionsPerformed: number;
    avgConfidence: number;
    meanTimeToMitigateMin: number;
  };
};

const ISO = (minutesAgo: number) =>
  new Date(Date.now() - minutesAgo * 60_000).toISOString();

export const workspace: Workspace = {
  id: 'ws_demo_aegisflow',
  name: 'AegisFlow Demo Workspace',
  ownerName: 'Victorhez',
  ownerEmail: 'demo@aegisflow.ai',
  createdAt: ISO(60 * 24 * 14),
  safetyPolicy: {
    autoExecute: [
      'Create Linear/P0 incident and attach evidence',
      'Post engineering alert in Slack #incidents',
      'Open GitHub investigation issue and link deploys',
      'Create internal investigation notes',
    ],
    approvalRequired: [
      'Stripe refunds and subscription adjustments',
      'Bulk customer email (Gmail send beyond draft)',
      'Linear issue state changes beyond P0 tagging',
      'GitHub revert / hotmerge actions on main',
    ],
  },
  monthlyStats: {
    incidentsHandled: 23,
    actionsPerformed: 142,
    avgConfidence: 91,
    meanTimeToMitigateMin: 6.4,
  },
};

export const integrations = [
  {id: 'stripe', icon: '💳', name: 'Stripe', description: 'Payment anomalies and revenue impact', connected: true, lastSync: ISO(3), hint: 'STRIPE_SECRET_KEY'},
  {id: 'slack', icon: '💬', name: 'Slack', description: 'Customer signals and team response channel', connected: true, lastSync: ISO(1), hint: 'SLACK_BOT_TOKEN'},
  {id: 'github', icon: '🐙', name: 'GitHub', description: 'Deployments, commits and engineering investigations', connected: true, lastSync: ISO(6), hint: 'GITHUB_TOKEN'},
  {id: 'linear', icon: '📋', name: 'Linear', description: 'Incident tracking and orchestration', connected: true, lastSync: ISO(2), hint: 'LINEAR_API_KEY'},
  {id: 'gmail', icon: '✉️', name: 'Gmail', description: 'Customer communication drafts and sends', connected: false, lastSync: null, hint: 'OAuth credentials'},
];

const id = (p: string, i = 0) => `${p}_${Date.now().toString(36)}${i}`;

export const incidents: Incident[] = [
  {
    id: 'inc_checkout_fail',
    title: 'Checkout payment failures spike',
    severity: 'P0',
    status: 'Resolved',
    confidence: 96,
    createdAt: ISO(42),
    apps: ['Stripe', 'Slack', 'GitHub', 'Linear', 'Gmail'],
    evidence: [
      {id: id('ev', 1), app: 'Stripe', finding: 'Payment failures 340% above baseline; 14 customers affected in last 18 minutes.', confidence: 98, timestamp: ISO(42)},
      {id: id('ev', 2), app: 'Slack', finding: '#cust-support received 3 customer reports: checkout "hangs forever".', confidence: 91, timestamp: ISO(40)},
      {id: id('ev', 3), app: 'GitHub', finding: 'Deployment of checkout-service@2.14.0 ran at 14:22 UTC — 6 min before anomaly onset.', confidence: 88, timestamp: ISO(38)},
      {id: id('ev', 4), app: 'Stripe', finding: 'All failures share error code card_declined · processor_response_code 51 — insufficient_funds pattern is inconsistent, suspecting tokenization change.', confidence: 94, timestamp: ISO(37)},
      {id: id('ev', 5), app: 'Linear', finding: 'No open incidents linked to checkout — this is a new regression.', confidence: 99, timestamp: ISO(36)},
    ],
    actions: [
      {id: id('act', 1), app: 'Linear', action: 'Create P0 incident', status: 'success', timestamp: ISO(36), detail: 'Created INC-1042 "Checkout failures spike" with evidence attached.', idempotencyKey: 'checkout_fail:linear:create'},
      {id: id('act', 2), app: 'Slack', action: 'Post engineering alert', status: 'success', timestamp: ISO(35), detail: 'Posted to #incidents: 🚨 P0 · checkout failures · 14 customers impacted.', idempotencyKey: 'checkout_fail:slack:alert'},
      {id: id('act', 3), app: 'GitHub', action: 'Create investigation issue', status: 'success', timestamp: ISO(34), detail: 'Opened INVEST-231 referencing checkout-service#2.14.0 commit.', idempotencyKey: 'checkout_fail:github:issue'},
      {id: id('act', 4), app: 'Slack', action: 'Page on-call eng', status: 'success', timestamp: ISO(34), detail: 'Paged @oncall and invited to incident huddle.', idempotencyKey: 'checkout_fail:slack:page'},
      {id: id('act', 5), app: 'Linear', action: 'Link evidence to incident', status: 'success', timestamp: ISO(33), detail: 'Evidence URLs attached as comment on INC-1042.', idempotencyKey: 'checkout_fail:linear:link'},
      {id: id('act', 6), app: 'Gmail', action: 'Draft customer update', status: 'pending', timestamp: ISO(32), detail: 'Prepared draft — awaiting Safety Policy approval for bulk send.', idempotencyKey: 'checkout_fail:gmail:draft'},
      {id: id('act', 7), app: 'Linear', action: 'Set state Mitigated', status: 'success', timestamp: ISO(14), detail: 'Hotfix 2.14.1 deployed; failure rate returned to baseline.', idempotencyKey: 'checkout_fail:linear:mitigated'},
    ],
    events: [
      {id: id('evt', 1), title: 'Signal received', detail: 'Stripe webhook reported elevated decline rate.', timestamp: ISO(42)},
      {id: id('evt', 2), title: 'Customer signals correlated', detail: 'Slack #cust-support messages matched the anomaly window.', timestamp: ISO(40)},
      {id: id('evt', 3), title: 'Deployment investigated', detail: 'checkout-service@2.14.0 confirmed as likely candidate.', timestamp: ISO(38)},
      {id: id('evt', 4), title: 'Hypothesis formed', detail: '96% confidence: regression in tokenization during 3DS2 flow.', timestamp: ISO(37)},
      {id: id('evt', 5), title: 'Response actions executed', detail: 'Linear, Slack, GitHub actions applied idempotently.', timestamp: ISO(32)},
      {id: id('evt', 6), title: 'Mitigation verified', detail: 'Hotfix 2.14.1 rolled out · failure rate 0.2% baseline.', timestamp: ISO(14)},
      {id: id('evt', 7), title: 'Receipts signed and stored', detail: '7 action receipts available for audit.', timestamp: ISO(12)},
    ],
  },
  {
    id: 'inc_churn_signal',
    title: 'Enterprise subscription cancellation signal',
    severity: 'P1',
    status: 'Mitigated',
    confidence: 89,
    createdAt: ISO(60 * 5),
    apps: ['Stripe', 'Gmail', 'Slack', 'Linear'],
    evidence: [
      {id: id('ev', 10), app: 'Stripe', finding: 'Customer acme_corp scheduled subscription cancellation — MRR impact $12,400/mo.', confidence: 99, timestamp: ISO(60 * 5)},
      {id: id('ev', 11), app: 'Gmail', finding: 'Acme CSM thread 2 days ago: "latency in reporting dashboard keeps getting worse".', confidence: 87, timestamp: ISO(60 * 5 - 25)},
      {id: id('ev', 12), app: 'Slack', finding: '#acme-customer channel saw 4 support pings today — all latency-related.', confidence: 82, timestamp: ISO(60 * 5 - 18)},
    ],
    actions: [
      {id: id('act', 10), app: 'Linear', action: 'Create P1 retention issue', status: 'success', timestamp: ISO(60 * 5 - 16), detail: 'RET-221 opened for enterprise retention escalation.', idempotencyKey: 'churn:linear:create'},
      {id: id('act', 11), app: 'Slack', action: 'Notify CSM + leadership', status: 'success', timestamp: ISO(60 * 5 - 15), detail: '@cs-team + @leadership alerted in #retention.', idempotencyKey: 'churn:slack:alert'},
      {id: id('act', 12), app: 'Gmail', action: 'Draft executive summary', status: 'success', timestamp: ISO(60 * 5 - 14), detail: 'Executive summary draft prepared for CSM to personalize.', idempotencyKey: 'churn:gmail:draft'},
      {id: id('act', 13), app: 'Stripe', action: 'Pause cancellation', status: 'pending', timestamp: ISO(60 * 5 - 10), detail: 'Requires approval (auto-refund disabled by Safety Policy).', idempotencyKey: 'churn:stripe:pause'},
    ],
    events: [
      {id: id('evt', 10), title: 'Cancellation signal detected', detail: 'Stripe subscription.schedule_canceled webhook received.', timestamp: ISO(60 * 5)},
      {id: id('evt', 11), title: 'Email history reviewed', detail: 'Recent dissatisfaction threads surfaced from Gmail.', timestamp: ISO(60 * 5 - 24)},
      {id: id('evt', 12), title: 'Retention playbook applied', detail: 'P1 retention workflow kicked off.', timestamp: ISO(60 * 5 - 15)},
      {id: id('evt', 13), title: 'Awaiting human approval', detail: 'Stripe pause gated by policy boundary.', timestamp: ISO(60 * 5 - 10)},
    ],
  },
  {
    id: 'inc_deploy_blip',
    title: 'Auth service deploy errors',
    severity: 'P1',
    status: 'Resolved',
    confidence: 93,
    createdAt: ISO(60 * 26),
    apps: ['GitHub', 'Linear', 'Slack'],
    evidence: [
      {id: id('ev', 20), app: 'GitHub', finding: 'auth-service deploy errored 3x in rollout phase; unhealthy pod count 4/8.', confidence: 97, timestamp: ISO(60 * 26)},
      {id: id('ev', 21), app: 'GitHub', finding: 'Crash log: Cannot read properties of undefined (reading "issuer") — config parsing regression.', confidence: 95, timestamp: ISO(60 * 26 - 4)},
      {id: id('ev', 22), app: 'Slack', finding: 'No customer reports yet — caught pre-impact by deploy monitor.', confidence: 80, timestamp: ISO(60 * 26 - 3)},
    ],
    actions: [
      {id: id('act', 20), app: 'Linear', action: 'Create P1 deploy incident', status: 'success', timestamp: ISO(60 * 26 - 2), detail: 'INC-1038 "Auth service deploy regression" created.', idempotencyKey: 'deploy:linear:create'},
      {id: id('act', 21), app: 'Slack', action: 'Notify eng channel', status: 'success', timestamp: ISO(60 * 26 - 2), detail: 'Posted deploy-failure notice to #eng-platform.', idempotencyKey: 'deploy:slack:alert'},
      {id: id('act', 22), app: 'GitHub', action: 'Open revert PR', status: 'success', timestamp: ISO(60 * 26 - 1), detail: 'Auto-generated revert PR #11294 — authored by AegisFlow.', idempotencyKey: 'deploy:github:revert'},
    ],
    events: [
      {id: id('evt', 20), title: 'Deploy failure detected', detail: 'GitHub Actions rollout monitor reported unhealthy.', timestamp: ISO(60 * 26)},
      {id: id('evt', 21), title: 'Root cause isolated', detail: 'Config parsing regression identified from crash signature.', timestamp: ISO(60 * 26 - 4)},
      {id: id('evt', 22), title: 'Revert applied', detail: 'Revert PR merged. Service healthy at 8/8 pods.', timestamp: ISO(60 * 23)},
      {id: id('evt', 23), title: 'Post-incident linked', detail: 'PIR template added to Linear INC-1038.', timestamp: ISO(60 * 21)},
    ],
  },
  {
    id: 'inc_support_surge',
    title: 'Support ticket volume surge',
    severity: 'P2',
    status: 'Investigating',
    confidence: 81,
    createdAt: ISO(10),
    apps: ['Slack', 'Linear', 'Gmail'],
    evidence: [
      {id: id('ev', 30), app: 'Slack', finding: '#support inflow 2.7x rolling 30-min average; unknown common cause yet.', confidence: 83, timestamp: ISO(10)},
      {id: id('ev', 31), app: 'Gmail', finding: 'Recent inbound ticket keywords cluster around "invoice" and "receipt".', confidence: 78, timestamp: ISO(9)},
    ],
    actions: [
      {id: id('act', 30), app: 'Linear', action: 'Open P2 investigation', status: 'success', timestamp: ISO(9), detail: 'INV-029 created for support-volume surge.', idempotencyKey: 'surge:linear:create'},
      {id: id('act', 31), app: 'Slack', action: 'Raise support channel priority', status: 'success', timestamp: ISO(9), detail: 'Pinned +@here in #support with real-time stats.', idempotencyKey: 'surge:slack:priority'},
    ],
    events: [
      {id: id('evt', 30), title: 'Volume anomaly detected', detail: 'Support inflow exceeded 2σ threshold.', timestamp: ISO(10)},
      {id: id('evt', 31), title: 'Correlating cause', detail: 'Clustering on invoice / receipt themes ongoing.', timestamp: ISO(8)},
    ],
  },
];

export const evidenceLedger: Evidence[] = incidents.flatMap((i) => i.evidence).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

export const actionReceipts: ActionReceipt[] = incidents.flatMap((i) => i.actions).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

export const agentRuns: AgentRun[] = incidents.map((inc) => ({
  id: `run_${inc.id}`,
  scenario: inc.title,
  triggeredBy: inc.apps[0] + ' signal',
  triggeredAt: inc.createdAt,
  durationMs: 5_300 + Math.floor(Math.random() * 12_000),
  status: inc.status === 'Investigating' ? 'running' : 'completed',
  confidence: inc.confidence,
  incidentId: inc.id,
  summary: `${inc.status} · ${inc.apps.length} apps · ${inc.actions.length} actions · ${inc.evidence.length} evidence items`,
  steps: inc.events.map((e, k) => ({step: k + 1, title: e.title, detail: e.detail, at: e.timestamp})),
}));

export const evaluations = [
  {name: 'Happy path · payment spike', expected: 'All 4 providers receive idempotent success receipts', pass: true},
  {name: 'Duplicate event idempotency', expected: 'No duplicate Linear incident; receipts reuse existing', pass: true},
  {name: 'Low-confidence boundary', expected: 'No destructive / refund action when confidence < 70%', pass: true},
  {name: 'Integration failure · retry', expected: 'Retries 3x then surfaces failure to Slack + Linear', pass: true},
  {name: 'Approval boundary · refund', expected: 'Refund paused; routed to workspace owner for approval', pass: true},
  {name: 'Evidence chain integrity', expected: 'Every action references at least 2 evidence items', pass: true},
  {name: 'Receipt verification', expected: 'Every success receipt is signed and replay-resistant', pass: true},
];

export function getIncidentById(id: string) {
  return incidents.find((x) => x.id === id);
}
