import { createTextPdf } from '../../../../lib/report-pdf';
import { monthlySocialPerformance } from '../../../../lib/social-performance';

export function GET() {
  const period = monthlySocialPerformance.find(snapshot => snapshot.id === 'august-2026');
  if (!period) return new Response('Report not found', { status: 404 });

  const lines = [
    'FlyDigital | ABC Restaurant',
    `SMM Performance Report - ${period.label}`,
    '',
    'Demo report - sample data for the client portal preview.',
    '',
    ...['Facebook', 'Instagram'].flatMap(platform => [
      platform,
      ...period.metrics.filter(metric => metric.platform === platform).map(metric => `${metric.label}: ${metric.value} (${metric.trend === 'up' ? '+' : '-'}${metric.change} vs previous month)`),
      '',
    ]),
  ];

  return new Response(createTextPdf(lines), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="smm-performance-august-2026.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}
