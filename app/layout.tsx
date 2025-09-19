import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Affiliate Store Builder - Create Your Online Affiliate Store',
  description: 'Build and customize your own affiliate store. Add products, create promotional slides, and start earning commissions through affiliate marketing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
