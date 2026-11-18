import type { Metadata } from 'next';
import { ServiceOverview } from '../../../components/service-overview';

export const metadata: Metadata = {
  title: 'Social Media Marketing | FlyDigital Client Portal',
};

export default function SocialMediaMarketingPage() {
  return <ServiceOverview />;
}
