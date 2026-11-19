import { monthlySocialPerformance } from './social-performance';

export const performanceFilters = [
  { id: 'all', label: 'All', tone: 'yellow' },
  { id: 'branding', label: 'Branding', tone: 'pink' },
  { id: 'social-media-marketing', label: 'Social Media Marketing', tone: 'blue' },
  { id: 'website-development', label: 'Website Development', tone: 'red' },
  { id: 'ppc-google-ads', label: 'PPC and GDN', tone: 'green' },
  { id: 'influencer-marketing', label: 'Influencer Marketing', tone: 'pink' },
] as const;

export type PerformanceFilter = typeof performanceFilters[number]['id'];
export type PerformanceMetric = {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  context?: string;
};
export type PerformanceReport = {
  id: PerformanceFilter;
  title: string;
  tone: string;
  metrics: PerformanceMetric[];
};

// Demo September snapshots matching the supplied performance reference.
export const performanceReports: PerformanceReport[] = [
  {
    id: 'social-media-marketing', title: 'Social Media Marketing', tone: 'blue',
    metrics: monthlySocialPerformance[0].metrics.map(({ platform, ...metric }) => ({ ...metric, context: platform })),
  },
  {
    id: 'ppc-google-ads', title: 'PPC / Google Ads', tone: 'green',
    metrics: [
      { label: 'Spend', value: '19.2k NPR', change: '10.5%', trend: 'down' },
      { label: 'Impressions', value: '48.9k', change: '21.5%', trend: 'down' },
      { label: 'Engagement rate', value: '6.1%', change: '21.1%', trend: 'up' },
      { label: 'Reach', value: '31.2k', change: '10.5%', trend: 'down' },
      { label: 'CPC', value: '582 NPR', change: '21.5%', trend: 'down' },
      { label: 'ROAS', value: '6.1%', change: '21.1%', trend: 'up' },
    ],
  },
  {
    id: 'influencer-marketing', title: 'Influencer Marketing', tone: 'pink',
    metrics: monthlySocialPerformance[0].metrics.map(({ platform, ...metric }) => ({ ...metric, context: platform === 'Facebook' ? 'Creator content' : 'Campaign content' })),
  },
];

export function reportsForFilter(filter: PerformanceFilter) {
  return filter === 'all' ? performanceReports : performanceReports.filter(report => report.id === filter);
}
