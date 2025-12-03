// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lowkey | Subtlety is the New Status',
  description:
    'Lowkey is an ideology expressed through objects and community. For those who understand that true influence is silent and legacy is built in the shadows.',
  openGraph: {
    title: 'Lowkey | Subtlety is the New Status',
    description: 'An ideology for those who understand true influence is silent.',
    type: 'website',
    url: 'https://lowkey.luxury',
    siteName: 'Lowkey'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lowkey | Subtlety is the New Status',
    description: 'An ideology for those who understand true influence is silent.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
