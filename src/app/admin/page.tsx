import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email !== 'baldealfa067@gmail.com') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
                <p className="text-secondary">Você não tem permissão para visualizar esta página.</p>
                <Link href="/" className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Voltar ao Início</Link>
            </div>
        )
    }

    // Fetch total restaurants
    const { data: restaurants } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false })

    // Fetch all orders for platform stats
    const { data: allOrders } = await supabase
        .from('orders')
        .select('*')

    // Define a type for the order object to ensure type safety
    type Order = {
        status: string;
        total_amount: number;
    };

    const stats = {
        totalRestaurants: restaurants?.length || 0,
        activeRestaurants: restaurants?.length || 0, // Simplified for MVP
        totalOrders: allOrders?.length || 0,
        totalRevenue: ((allOrders || []) as Order[]) // Cast to Order[] for type safety
            ?.filter((o: Order) => o.status === 'completed')
            .reduce((acc: number, current: Order) => acc + Number(current.total_amount), 0) || 0
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Page Header */}
            <div>
                <h1 className="text-5xl font-black text-foreground tracking-tighter mb-2">Painel de Administração</h1>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 glass rounded-full text-[10px] font-black text-primary tracking-widest uppercase shadow-glow">Master Access</span>
                    <p className="text-secondary/40 font-bold text-[10px] uppercase tracking-widest">Controle Global da Plataforma</p>
                </div>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Restaurantes', value: stats.totalRestaurants, trend: '+0%', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'primary' },
                    { label: 'Restaurantes Ativos', value: stats.activeRestaurants, trend: 'Online', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'green-500' },
                    { label: 'Total Pedidos', value: stats.totalOrders.toLocaleString(), trend: '+0%', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', color: 'blue-500' },
                    { label: 'Receita Geral', value: new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(stats.totalRevenue), trend: '+0%', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'orange-500' }
                ].map((stat) => (
                    <div key={stat.label} className="premium-card p-8 group">
                        <div className="flex justify-between items-center mb-6">
                            <div className={`w-14 h-14 rounded-2xl glass flex items-center justify-center text-${stat.color} group-hover:bg-primary/5 transition-all duration-500`}>
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                </svg>
                            </div>
                            <span className="px-3 py-1 glass rounded-lg text-[9px] font-black tracking-widest uppercase opacity-60">
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.25em] mb-2">{stat.label}</p>
                            <h3 className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Restaurant Management Section */}
            <div className="premium-card p-1 overflow-hidden min-h-[600px]">
                <div className="px-10 py-10 border-b border-border/5 flex flex-col items-stretch gap-10 bg-white/0.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-primary shadow-glow">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-foreground tracking-tighter">Gestão de Restaurantes</h2>
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-40">Ecossistema BissauFood</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex-grow">
                        <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar restaurante pelo nome ou ID..."
                            className="w-full pl-16 pr-8 py-5 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/0.5 text-[10px] font-black text-secondary uppercase tracking-[0.3em] border-b border-border/5">
                                <th className="px-10 py-8">Restaurante & Logradouro</th>
                                <th className="px-10 py-8">Status</th>
                                <th className="px-10 py-8">Fundação</th>
                                <th className="px-10 py-8 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5">
                            {restaurants?.map((res: { id: string, name: string, slug: string, created_at: string }) => (
                                <tr key={res.id} className="hover:bg-white/0.5 transition-all group">
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden glass shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                <span className="text-2xl font-black text-primary/30 uppercase">{res.name.charAt(0)}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-foreground text-xl tracking-tight truncate">{res.name}</p>
                                                <p className="text-[11px] text-secondary font-bold opacity-50 lowercase tracking-widest truncate">/{res.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10">
                                        <span className="px-5 py-2 glass text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.1)]">ATIVO</span>
                                    </td>
                                    <td className="px-10 py-10 text-[11px] font-bold text-secondary tracking-widest uppercase opacity-60">
                                        {new Date(res.created_at).toLocaleDateString('pt-GW', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-10 py-10 text-right">
                                        <button className="glass p-3 rounded-xl text-secondary hover:text-primary hover:shadow-glow transition-all">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14m0-14l-4 4m4-4l4 4" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!restaurants || restaurants.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-10 py-32 text-center text-secondary/40 font-black tracking-widest uppercase text-sm italic">
                                        Nenhum restaurante detectado na rede.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
