// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Quantix AI',
  description: 'AI-Powered Interview & Autonomous Screening Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#FAF8F5] text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-700 font-sans">
        {children}
      </body>
    </html>
  );
}