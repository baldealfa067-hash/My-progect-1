import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email !== 'baldealfa067@gmail.com') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Acesso Restrito</h1>
                <p className="text-secondary font-medium">Esta área é exclusiva para a administração da plataforma.</p>
                <Link href="/" className="px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-glow">Voltar para Início</Link>
            </div>
        )
    }

    const { data: restaurants } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: allOrders } = await supabase
        .from('orders')
        .select('*')

    type Order = {
        status: string;
        total_amount: number;
    };

    const stats = {
        totalRestaurants: restaurants?.length || 0,
        activeRestaurants: restaurants?.length || 0,
        totalOrders: allOrders?.length || 0,
        totalRevenue: ((allOrders || []) as Order[])
            ?.filter((o: Order) => o.status === 'completed')
            .reduce((acc: number, current: Order) => acc + Number(current.total_amount), 0) || 0
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 font-display">Command Center</h1>
                    <p className="text-sm font-bold text-slate-400 tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Status Global da Rede BissauFood em tempo real.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex w-12 h-12 bg-white border border-slate-100 rounded-2xl items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                    </button>
                    <Link href="/admin/restaurants/new" className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow hover:scale-[1.02] transition-all flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Novo Parceiro
                    </Link>
                </div>
            </div>

            {/* Platform Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: 'Market Volume', value: `${stats.totalOrders}`, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'text-orange-500' },
                    { label: 'Partners', value: `${stats.totalRestaurants}`, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5', color: 'text-primary' },
                    { label: 'Avg Order Value', value: `${new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(stats.totalRevenue / (stats.totalOrders || 1))} CFA`, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-slate-900' },
                    { label: 'Gross Revenue', value: `${new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(stats.totalRevenue)} CFA`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-600' }
                ].map((stat) => (
                    <div key={stat.label} className="premium-card p-8 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} group-hover:bg-primary group-hover:text-white transition-all shadow-sm`}>
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                            <div className="w-1.5 h-6 bg-slate-100 rounded-full group-hover:bg-primary/20 transition-colors"></div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Enhanced Partners Table */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Partners Ecosystem</h2>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Total: {restaurants?.length} Restaurantes</p>
                    </div>
                </div>

                <div className="premium-card overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Detail</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Integration Date</th>
                                    <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {restaurants?.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 relative group-hover:scale-110 transition-transform duration-500">
                                                    <Image
                                                        src={`https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=100&auto=format&fit=crop`}
                                                        fill
                                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                        alt={res.name}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-900 tracking-tight">{res.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] lowercase">bissau.food/{res.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-xl border border-green-100">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                Active
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-xs font-bold text-secondary tracking-tight">
                                            {new Date(res.created_at).toLocaleDateString('pt-GW', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                                                <Link href={`https://bissau.food/menu/${res.slug}`} target="_blank" className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary rounded-xl transition-all shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </Link>
                                                <Link href={`/admin/restaurants/${res.id}`} className="p-3 bg-slate-900 text-white hover:bg-primary rounded-xl transition-all shadow-glow">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
