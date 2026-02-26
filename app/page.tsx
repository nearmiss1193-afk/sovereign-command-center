"use client";

import React, { useState, useEffect } from "react";
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
    Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden ${className}`}>
        {children}
    </div>
);

const KPICard = ({ label, value, icon: Icon, color = "blue" }: { label: string, value: string | number, icon: any, color?: string }) => {
    const colorMap: Record<string, string> = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20",
    };

    return (
        <GlassCard className="p-4 flex items-center gap-4 group hover:bg-zinc-800/40 transition-all duration-300">
            <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-lg font-mono font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</p>
                </div>
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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

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
            setMessages(prev => [...prev, { role: 'assistant', content: "Connection to core intelligence interrupted." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <main className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 border-r border-white/5 flex flex-col py-8 bg-zinc-950/40 backdrop-blur-2xl z-20">
                <div className="mb-12 px-8 flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/40">
                        <Shield className="w-6 h-6" />
                    </div>
                    <span className="hidden lg:block font-black text-xl tracking-tighter italic">EMPIRE</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <div className="mb-6">
                        <h4 className="hidden lg:block text-[10px] font-black text-zinc-600 uppercase tracking-widest px-3 mb-2">Sectors</h4>
                        {cities.map(city => (
                            <button
                                key={city}
                                onClick={() => setActiveCity(city)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
                                    ${activeCity === city ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}
                                `}
                            >
                                <MapPin className={`w-4 h-4 ${activeCity === city ? 'text-blue-400' : 'text-zinc-500'}`} />
                                <span className="hidden lg:block text-sm font-semibold">{city}</span>
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-1">
                        <h4 className="hidden lg:block text-[10px] font-black text-zinc-600 uppercase tracking-widest px-3 mb-2">Interface</h4>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-400 bg-blue-600/10 border border-blue-500/20">
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="hidden lg:block text-sm font-semibold">Command</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5">
                            <Radio className="w-5 h-5" />
                            <span className="hidden lg:block text-sm font-semibold">Live Comms</span>
                        </button>
                    </div>
                </nav>

                <div className="px-6 mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-zinc-950 border border-white/20 flex items-center justify-center text-[10px] font-bold">SOV</div>
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-xs font-black text-white uppercase tracking-tight">SOVEREIGN</p>
                            <span className="text-[10px] text-emerald-500 font-mono animate-pulse">● ONLINE</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/5 rounded-full blur-[160px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[140px]" />
                </div>

                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-zinc-950/20 backdrop-blur-md z-10">
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-zinc-300">Command Center</h1>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase">Sector Status: {activeCity}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 rounded-full border border-white/10">
                            <Search className="w-4 h-4 text-zinc-500" />
                            <input type="text" placeholder="Omni-search..." className="bg-transparent text-xs outline-none w-32 font-medium" />
                        </div>
                        <Settings className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </header>

                <div className="flex-1 p-8 grid grid-rows-[auto_1fr] gap-8 overflow-hidden">
                    {/* KPI Row */}
                    <div className="grid grid-cols-5 gap-4">
                        <KPICard label="Touches Today" value={stats.touches} icon={Activity} color="blue" />
                        <KPICard label="Enrichment %" value={`${stats.enrichment}%`} icon={Database} color="emerald" />
                        <KPICard label="Active Daemons" value={stats.active_daemons} icon={Cpu} color="amber" />
                        <KPICard label="7D Revenue" value={stats.revenue_forecast} icon={TrendingUp} color="fuchsia" />
                        <KPICard label="System Health" value={stats.health} icon={AlertCircle} color={stats.health === 'Normal' ? 'blue' : 'red'} />
                    </div>

                    {/* Chat Area */}
                    <div className="relative flex flex-col h-full min-h-0">
                        <GlassCard className="flex-1 flex flex-col relative">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/20">
                                <div className="flex items-center gap-3">
                                    <Bot className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-wider">Grok Orchestrator</h3>
                                        <p className="text-[10px] text-zinc-500 font-mono">grok-4-1-fast-reasoning</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                                        <Bot className="w-12 h-12 mb-4" />
                                        <p className="text-sm italic italic">&quot;Awaiting directive for {activeCity} Sector...&quot;</p>
                                    </div>
                                )}
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed border
                                                ${msg.role === 'user' ? 'bg-blue-600 border-blue-400/20 rounded-br-none' : 'bg-zinc-800/80 border-white/10 rounded-bl-none'}
                                            `}>
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-zinc-800/80 px-4 py-2 rounded-2xl rounded-bl-none border border-white/10">
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-zinc-950/40 border-t border-white/5">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={`Send directive to ${activeCity} Sector...`}
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTyping}
                                        className="absolute right-2 top-2 p-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-all"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </main>
    );
}
