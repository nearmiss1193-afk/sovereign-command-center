"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Shield,
    Activity,
    Database,
    TrendingUp,
    AlertCircle,
    MapPin,
    Search,
    LayoutDashboard,
    Radio,
    Mail,
    PieChart,
    Mic,
    Share2,
    Settings,
    Bot,
    Send,
    Loader2,
    Cpu,
    ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold" />
        {children}
    </div>
);

const KPICard = ({ label, value, icon: Icon, color = "blue" }: { label: string, value: string | number, icon: any, color?: string }) => {
    const colorMap: Record<string, string> = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5",
        fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20 shadow-fuchsia-500/5",
        red: "text-red-400 bg-red-500/10 border-red-500/20 shadow-red-500/5",
    };

    return (
        <GlassCard className="p-5 flex items-center gap-5 transition-all duration-300 hover:scale-[1.02]">
            <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-2xl font-mono font-black text-white">{value}</p>
            </div>
        </GlassCard>
    );
};

// --- Main Page ---

export default function Home() {
    const [activeCity, setActiveCity] = useState("All Cities");
    const [stats, setStats] = useState({
        touches: 142,
        enrichment: 87,
        active_daemons: 4,
        revenue_forecast: "$18,450",
        health: "Normal"
    });
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const cities = ["Lakeland", "Orlando", "All Cities"];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/dashboard-stats?city=${activeCity.toLowerCase().replace(' ', '_')}`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Stats Fetch Failed");
            }
        };
        fetchStats();
    }, [activeCity]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch('/api/grok-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, city: activeCity })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Core intelligence connection error. Please verify XAI_API_KEY." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <main className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-20 lg:w-72 border-r border-white/5 flex flex-col py-10 bg-zinc-950/60 backdrop-blur-3xl z-30">
                <div className="mb-14 px-10 flex items-center gap-4">
                    <div className="p-2.5 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/50">
                        <Shield className="w-7 h-7" />
                    </div>
                    <span className="hidden lg:block font-black text-2xl tracking-tighter italic">EMPIRE</span>
                </div>

                <nav className="flex-1 px-6 space-y-8">
                    <div>
                        <h4 className="hidden lg:block text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-4">Operations Sectors</h4>
                        <div className="space-y-2">
                            {cities.map(city => (
                                <button
                                    key={city}
                                    onClick={() => setActiveCity(city)}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative
                                        ${activeCity === city
                                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-xl shadow-blue-500/5'
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}
                                    `}
                                >
                                    <MapPin className={`w-5 h-5 transition-colors duration-300 ${activeCity === city ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                    <span className="hidden lg:block text-sm font-bold tracking-tight">{city}</span>
                                    {activeCity === city && (
                                        <motion.div layoutId="active-city" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-4">
                        <h4 className="hidden lg:block text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4">Executive Modules</h4>
                        <div className="space-y-1">
                            <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-blue-400 bg-blue-600/10 border border-blue-500/20">
                                <LayoutDashboard className="w-6 h-6" />
                                <span className="hidden lg:block text-sm font-bold tracking-tight">Command Center</span>
                            </button>
                            <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors group">
                                <Radio className="w-6 h-6 group-hover:text-amber-400 transition-colors" />
                                <span className="hidden lg:block text-sm font-bold tracking-tight">Live Intelligence</span>
                            </button>
                            <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors group">
                                <Cpu className="w-6 h-6 group-hover:text-emerald-400 transition-colors" />
                                <span className="hidden lg:block text-sm font-bold tracking-tight">Daemon Control</span>
                            </button>
                        </div>
                    </div>
                </nav>

                <div className="px-8 mt-auto pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-xl group-hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-full bg-zinc-950 border border-white/20 flex items-center justify-center text-xs font-black tracking-tighter">SOV</div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse font-bold" />
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-[11px] font-black text-white uppercase tracking-tight">Sovereign Owner</p>
                            <p className="text-[10px] text-zinc-500 font-mono font-bold">LVL 5_AUTHORITY</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden z-10">
                {/* Visual Ambient Effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-25%] left-[-15%] w-[90%] h-[90%] bg-blue-600/[0.03] rounded-full blur-[180px]" />
                    <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-purple-600/[0.03] rounded-full blur-[160px]" />
                </div>

                <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-zinc-950/20 backdrop-blur-3xl z-20">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-3">
                                Mission Control
                                <span className="text-blue-500 font-mono text-[10px] tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">V6.0 ALPHA</span>
                            </h1>
                            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-blue-500" />
                                {activeCity} Sector Dashboard
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 px-5 py-3 bg-zinc-900/40 rounded-2xl border border-white/10 ring-1 ring-white/5 transition-all focus-within:ring-blue-500/40 focus-within:border-blue-500/40 w-80 shadow-inner group">
                            <Search className="w-5 h-5 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                            <input type="text" placeholder="Search system logs..." className="bg-transparent text-sm outline-none w-full font-bold placeholder:text-zinc-600" />
                        </div>
                        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-zinc-950/50 border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.15em]">System Live</span>
                        </div>
                        <Settings className="w-6 h-6 text-zinc-500 hover:text-white hover:rotate-90 transition-all duration-500 cursor-pointer" />
                    </div>
                </header>

                <div className="flex-1 p-10 grid grid-rows-[auto_1fr] gap-10 overflow-hidden relative">
                    {/* KPI Dashboard Grid */}
                    <div className="grid grid-cols-5 gap-6 z-10">
                        <KPICard label="Touches Today" value={stats.touches} icon={Activity} color="blue" />
                        <KPICard label="Enrichment %" value={`${stats.enrichment}%`} icon={Database} color="emerald" />
                        <KPICard label="Active Daemons" value={stats.active_daemons} icon={Cpu} color="amber" />
                        <KPICard label="7D Revenue" value={stats.revenue_forecast} icon={TrendingUp} color="fuchsia" />
                        <KPICard label="System Health" value={stats.health} icon={AlertCircle} color={stats.health === 'Normal' ? 'blue' : 'red'} />
                    </div>

                    {/* Chat Interface Container */}
                    <div className="relative flex flex-col h-full min-h-0 z-10">
                        <GlassCard className="flex-1 flex flex-col mb-4 overflow-hidden border-white/20">
                            {/* Chat Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/40 backdrop-blur-3xl">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-zinc-900 rounded-2xl border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                        <Bot className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg tracking-tighter uppercase">Grok Orchestrator</h3>
                                        <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                            grok-4-1-fast-reasoning | Sector: {activeCity}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono font-bold text-zinc-600 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">LATENCY: 42MS</span>
                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                        <TrendingUp className="w-5 h-5 text-zinc-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-6">
                                        <Bot className="w-20 h-20 text-zinc-400 animate-float" />
                                        <div className="max-w-md">
                                            <p className="text-xl font-black uppercase tracking-widest italic">&quot;Awaiting Sovereign Directive&quot;</p>
                                            <p className="text-sm font-medium text-zinc-500 mt-2 font-mono">Channel established for {activeCity} Sector intelligence.</p>
                                        </div>
                                    </div>
                                )}
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                                            animate={{ opacity: 1, x: 0, y: 0 }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`relative group max-w-[75%] px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed font-medium shadow-2xl border
                                                ${msg.role === 'user'
                                                    ? 'bg-blue-600 text-white border-blue-400/30 rounded-br-none'
                                                    : 'bg-zinc-900/90 text-zinc-100 border-white/10 rounded-bl-none'}
                                            `}>
                                                {msg.role === 'assistant' && (
                                                    <div className="absolute -left-12 top-0 p-2 bg-zinc-900 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Bot className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                )}
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-zinc-900/90 px-6 py-4 rounded-[2rem] rounded-bl-none border border-white/10 shadow-xl">
                                            <div className="flex gap-1.5 items-center h-5">
                                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input Form */}
                            <form onSubmit={handleSendMessage} className="p-8 bg-zinc-950/60 border-t border-white/10 backdrop-blur-3xl relative z-20">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={`System Directive for ${activeCity} Sector...`}
                                        className="w-full bg-zinc-900/60 border border-white/10 rounded-[1.5rem] px-8 py-5 pr-20 text-base font-bold outline-none ring-1 ring-white/5 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 shadow-2xl"
                                        disabled={isTyping}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTyping || !input.trim()}
                                        className="absolute right-3 top-3 bottom-3 aspect-square bg-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 transition-all group-active:scale-95 shadow-xl shadow-blue-600/20"
                                    >
                                        {isTyping ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                                    </button>
                                </div>
                                <div className="mt-4 flex justify-between items-center px-4">
                                    <div className="flex gap-8">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                                            <Mic className="w-3.5 h-3.5" /> Voice Input
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                                            <PieChart className="w-3.5 h-3.5" /> Market Context
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">SOVEREIGN_OS v1.0.4.52</p>
                                </div>
                            </form>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* Global Animation Styles */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </main>
    );
}
