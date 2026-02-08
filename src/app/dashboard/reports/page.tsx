import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ReportsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.id)
        .single()

    const { data: orderStats } = await supabase
        .from('orders')
        .select('status, total_amount, created_at')
        .eq('restaurant_id', restaurant?.id)

    const totalRevenue = orderStats?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0
    const completedOrders = orderStats?.filter(o => o.status === 'completed').length || 0

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Relatórios de Vendas</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Inteligência de Negócio & Performance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="premium-card p-8 space-y-4">
                    <p className="text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">Receita Total</p>
                    <div>
                        <span className="text-sm font-black text-primary mr-1">CFA</span>
                        <span className="text-4xl font-black tracking-tighter text-foreground">{totalRevenue.toLocaleString()}</span>
                    </div>
                </div>
                <div className="premium-card p-8 space-y-4">
                    <p className="text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">Pedidos Concluídos</p>
                    <p className="text-4xl font-black tracking-tighter text-foreground">{completedOrders}</p>
                </div>
            </div>

            {/* Simulated Chart Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 premium-card p-1 overflow-hidden">
                    <div className="p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black tracking-tight uppercase">Fluxo de Vendas (7 dias)</h3>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full shadow-glow"></div>
                                <div className="w-3 h-3 bg-white/10 rounded-full"></div>
                            </div>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-4 pt-10 px-4">
                            {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        className="bg-primary/20 rounded-t-xl transition-all duration-500 group-hover:bg-primary shadow-glow"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-primary">
                                        {height}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between px-4 pt-4 text-[10px] font-black text-secondary uppercase tracking-widest opacity-40">
                            <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-1 overflow-hidden">
                    <div className="p-10 space-y-8">
                        <h3 className="text-xl font-black tracking-tight uppercase">Top Produtos</h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Pizza de Muzamba', sales: 42, growth: '+12%' },
                                { name: 'Peixe na Braza', sales: 38, growth: '+8%' },
                                { name: 'Arroz de Granja', sales: 25, growth: '-2%' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-foreground">{item.name}</p>
                                        <p className="text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">{item.sales} Vendas</p>
                                    </div>
                                    <div className={`text-[10px] font-black px-2 py-1 glass rounded-lg ${item.growth.startsWith('+') ? 'text-green-400' : 'text-primary'}`}>
                                        {item.growth}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
