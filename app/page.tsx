"use client";

import React, { useState } from "react";
import { Shield, Activity, Database, TrendingUp, AlertCircle, Bot, Send, MapPin } from "lucide-react";

const GlassCard = ({ children, className = "" }: any) => (
    <div className={`bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 ${className}`}>
        {children}
    </div>
);

export default function CommandCenter() {
    const [activeCity, setActiveCity] = useState("Lakeland");
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const cities = ["Lakeland", "Orlando", "All Cities"];

    const stats = {
        Lakeland: { touches: 142, enrichment: 87, daemons: 4, revenue: "$18,450", health: "Normal" },
        Orlando: { touches: 89, enrichment: 64, daemons: 3, revenue: "$12,300", health: "Normal" },
        "All Cities": { touches: 231, enrichment: 78, daemons: 7, revenue: "$30,750", health: "Normal" },
    }[activeCity as keyof typeof stats_map] || { touches: 0, enrichment: 0, daemons: 0, revenue: "$0", health: "Normal" };

    // Helper for type safety if needed, but the user provided direct code
    const stats_map = {
        Lakeland: { touches: 142, enrichment: 87, daemons: 4, revenue: "$18,450", health: "Normal" },
        Orlando: { touches: 89, enrichment: 64, daemons: 3, revenue: "$12,300", health: "Normal" },
        "All Cities": { touches: 231, enrichment: 78, daemons: 7, revenue: "$30,750", health: "Normal" },
    };

    const currentStats = stats_map[activeCity as keyof typeof stats_map];

    const handleSend = async (e: any) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: "user", content: input }]);
        const userMsg = input;
        setInput("");
        setIsTyping(true);

        const res = await fetch("/api/grok-proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMsg, city: activeCity }),
        });

        const data = await res.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        setIsTyping(false);
    };

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/10 bg-zinc-950 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                    <Shield className="w-8 h-8 text-blue-500" />
                    <div className="font-black text-3xl tracking-tighter">EMPIRE</div>
                </div>

                <div className="space-y-2 mb-12">
                    {cities.map(city => (
                        <button
                            key={city}
                            onClick={() => setActiveCity(city)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${activeCity === city ? "bg-blue-600 text-white" : "hover:bg-white/5"
                                }`}
                        >
                            <MapPin className="w-5 h-5" />
                            <span className="font-semibold">{city}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-auto text-xs text-zinc-500">Sovereign Empire • Phase 7</div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-20 border-b border-white/10 flex items-center px-10">
                    <h1 className="text-3xl font-black">{activeCity} Command Center</h1>
                </header>

                <div className="flex-1 p-10 overflow-auto">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-5 gap-6 mb-10">
                        <GlassCard>
                            <div className="text-sm text-zinc-400">Touches Today</div>
                            <div className="text-4xl font-mono font-bold mt-2">{currentStats.touches}</div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-sm text-zinc-400">Enrichment %</div>
                            <div className="text-4xl font-mono font-bold mt-2">{currentStats.enrichment}%</div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-sm text-zinc-400">Active Daemons</div>
                            <div className="text-4xl font-mono font-bold mt-2">{currentStats.daemons}</div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-sm text-zinc-400">7D Revenue Forecast</div>
                            <div className="text-4xl font-mono font-bold mt-2">{currentStats.revenue}</div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-sm text-zinc-400">System Health</div>
                            <div className="text-4xl font-mono font-bold mt-2 text-emerald-400">{currentStats.health}</div>
                        </GlassCard>
                    </div>

                    {/* Grok Chat */}
                    <GlassCard className="h-[calc(100vh-280px)] flex flex-col">
                        <div className="p-6 border-b border-white/10 flex items-center gap-3">
                            <Bot className="w-6 h-6 text-blue-400" />
                            <div>
                                <div className="font-bold">Grok Orchestrator</div>
                                <div className="text-xs text-zinc-500">Connected • grok-4-1-fast-reasoning</div>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-auto space-y-6">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[70%] px-5 py-3 rounded-2xl ${m.role === "user" ? "bg-blue-600" : "bg-zinc-800"}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSend} className="p-6 border-t border-white/10">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Commander, what is our objective?"
                                    className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500"
                                />
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-8 rounded-2xl font-medium">
                                    Send
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
