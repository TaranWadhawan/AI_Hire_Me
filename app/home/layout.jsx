import React from 'react';
import Navbar from '../components/layout/Navbar';

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-700 font-sans">
      <Navbar />
      <main className="w-full">{children}</main>
    </div>
  );
}