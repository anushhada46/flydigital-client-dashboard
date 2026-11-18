export type SocialMetric = {
  platform: 'Facebook' | 'Instagram';
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
};

type MonthlySocialPerformance = {
  id: string;
  label: string;
  metrics: SocialMetric[];
};

// Demo snapshots used by the service overview and monthly performance views.
export const monthlySocialPerformance: MonthlySocialPerformance[] = [
  {
    id: 'september-2026',
    label: 'September 2026',
    metrics: [
      { platform: 'Facebook', label: 'Reach', value: '31.2k', change: '10.5%', trend: 'down' },
      { platform: 'Facebook', label: 'Impressions', value: '48.9k', change: '21.5%', trend: 'down' },
      { platform: 'Facebook', label: 'Engagement rate', value: '6.1%', change: '21.1%', trend: 'up' },
      { platform: 'Instagram', label: 'Reach', value: '31.2k', change: '15.5%', trend: 'down' },
      { platform: 'Instagram', label: 'Impressions', value: '48.9k', change: '13.5%', trend: 'down' },
      { platform: 'Instagram', label: 'Engagement rate', value: '6.1%', change: '21.1%', trend: 'up' },
    ],
  },
  {
    id: 'august-2026',
    label: 'August 2026',
    metrics: [
      { platform: 'Facebook', label: 'Reach', value: '34.9k', change: '8.2%', trend: 'up' },
      { platform: 'Facebook', label: 'Impressions', value: '62.3k', change: '12.4%', trend: 'up' },
      { platform: 'Facebook', label: 'Engagement rate', value: '5.0%', change: '3.8%', trend: 'down' },
      { platform: 'Instagram', label: 'Reach', value: '36.9k', change: '6.7%', trend: 'up' },
      { platform: 'Instagram', label: 'Impressions', value: '56.5k', change: '9.1%', trend: 'up' },
      { platform: 'Instagram', label: 'Engagement rate', value: '5.0%', change: '4.2%', trend: 'up' },
    ],
  },
];
