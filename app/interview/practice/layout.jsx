// app/interview/layout.jsx
import Navbar from "../../components/layout/Navbar";

export default function InterviewLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-[#FAF8F5] overflow-hidden font-sans selection:bg-sky-100 selection:text-sky-700">
      {/* Ambient Animated Futuristic Mesh Orbs */}
      <div className="absolute top-0 left-0 w-full h-full -z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] md:w-[620px] md:h-[620px] bg-gradient-to-br from-sky-200/40 via-sky-100/30 to-transparent rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-slate-200/50 via-sky-50/30 to-amber-50/40 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-sky-100/50 via-slate-100/40 to-transparent rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      
      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24 md:pt-4">
        {children}
      </main>
    </div>
  );
}