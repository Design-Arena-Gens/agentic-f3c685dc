import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Midnight Knock - Short Horror Experience',
  description: 'A cinematic, narrated horror micro-experience in Hindi',
  themeColor: '#000000'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
