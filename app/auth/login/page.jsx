'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles, KeyRound, Mail, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-sky-500" />
        <input
            {...props}
            className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5]/80 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm border border-slate-200/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-sky-400/15 focus:border-sky-400 transition-all font-sans"
        />
    </div>
);

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (loginError) throw loginError;

            // Redirect to home as per user request
            router.push('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 overflow-hidden font-sans selection:bg-sky-100 selection:text-sky-700">
            {/* Ambient Animated Futuristic Mesh Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-gradient-to-br from-sky-200/50 via-sky-100/40 to-transparent rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -35, 0],
                        y: [0, 35, 0],
                        scale: [1, 1.12, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-slate-200/60 via-sky-100/30 to-amber-50/50 rounded-full blur-3xl"
                />
            </div>

            {/* Glassmorphic & Neumorphic Card */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[430px] p-8 md:p-9 space-y-6 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06),0_1px_3px_rgba(0,0,0,0.03)]"
            >
                {/* Header Section */}
                <div className="text-center">
                    <Link href="/" className="inline-block group mb-4">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-3 rounded-2xl bg-gradient-to-br from-white to-sky-50 border border-white shadow-[0_8px_20px_rgba(2,132,199,0.12)] ring-1 ring-sky-200/50 flex items-center justify-center"
                        >
                            <Sparkles className="w-7 h-7 text-sky-500" />
                            <div className="absolute inset-0 rounded-2xl bg-sky-400/10 blur-sm -z-10 group-hover:bg-sky-400/20 transition-colors" />
                        </motion.div>
                    </Link>

                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                        Welcome Back
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Sign in to access your AI interview terminal
                    </p>
                </div>

                {/* Error Banner with Glassmorphism */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            className="p-3.5 bg-rose-50/80 backdrop-blur-md border border-rose-200/70 text-rose-700 text-xs md:text-sm rounded-xl flex items-center gap-2.5 shadow-sm"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Form */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    <InputField 
                        icon={Mail} 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />

                    <div className="relative">
                        <InputField 
                            icon={KeyRound} 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password" 
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Futuristic Gradient Button */}
                    <motion.button 
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 active:from-sky-600 active:to-sky-700 text-white text-sm font-semibold rounded-xl shadow-[0_10px_25px_-5px_rgba(2,132,199,0.35)] hover:shadow-[0_12px_28px_-5px_rgba(2,132,199,0.45)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </motion.button>
                </form>

                {/* Footer Switch */}
                <div className="pt-2 text-center text-xs md:text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link 
                        href="/auth/signup" 
                        className="font-semibold text-sky-600 hover:text-sky-700 transition-colors underline-offset-4 hover:underline"
                    >
                        Create an account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;