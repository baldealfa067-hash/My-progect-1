import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

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
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Admin Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">Painel de Controle</h1>
                    <p className="text-sm font-bold text-slate-400 tracking-tight">Gestão centralizada da rede BissauFood.</p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Avatars & Bell */}
                    <div className="flex items-center gap-5">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                                    <Image
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        alt="User"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                                +12
                            </div>
                        </div>
                        <button className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors shadow-sm relative">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                        </button>
                    </div>

                    <Link href="/admin/restaurants/new" className="px-6 py-4 bg-[#0F172A] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Novo Parceiro
                    </Link>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Volume Geral', value: `${stats.totalOrders}`, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'text-green-500' },
                    { label: 'Restaurantes', value: `${stats.totalRestaurants}`, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5', color: 'text-primary' },
                    { label: 'Crescimento', value: '18%', icon: 'M2.25 18L9 11.25l4.306 4.307L21.75 8.25', color: 'text-blue-500' },
                    { label: 'Receita Total', value: `${new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(stats.totalRevenue)} CFA`, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182-1.172-.879-1.94-1.1-2.707-1.1', color: 'text-orange-500' }
                ].map((stat) => (
                    <div key={stat.label} className="premium-card p-1">
                        <div className="bg-white rounded-[2rem] p-7 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">+4.2%</span>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Partners Table Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Restaurantes Parceiros</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Filtrar parceiros..."
                                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all w-64 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Restaurante / Local</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Criado em</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {restaurants?.map((res: { id: string, name: string, slug: string, created_at: string }) => (
                                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 shadow-sm relative group-hover:scale-105 transition-transform">
                                                <Image
                                                    src={`https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=100&auto=format&fit=crop`}
                                                    fill
                                                    className="object-cover"
                                                    alt={res.name}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 tracking-tight">{res.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest lowercase">/{res.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1.5 bg-green-50 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-green-100">
                                            ATIVO
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                        {new Date(res.created_at).toLocaleDateString('pt-GW', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/restaurants/${res.id}`} className="p-2 bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-colors border border-slate-100">
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
    )
}
