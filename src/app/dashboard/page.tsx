import { createClient } from '@/utils/supabase/server'
import { OrderActions } from './orders/OrderActions'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Get restaurant
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const stats = {
        pending: 0,
        today: 0,
        revenue: 0
    }

    interface OrderItem {
        id: string;
        quantity: number;
        menu_items: { name: string } | null;
    }

    interface Order {
        id: string;
        customer_name: string;
        customer_phone: string;
        status: string;
        total_amount: number;
        order_items: OrderItem[];
        created_at: string;
    }

    let recentOrders: Order[] = []

    if (restaurant) {
        // Fetch stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { data: ordersToday } = await supabase
            .from('orders')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .gte('created_at', today.toISOString())

        if (ordersToday) {
            stats.today = ordersToday.length
            stats.pending = ordersToday.filter((o: { status: string }) => o.status === 'pending').length
            stats.revenue = ordersToday
                .filter((o: { status: string }) => o.status === 'completed')
                .reduce((acc: number, current: { total_amount: number }) => acc + Number(current.total_amount), 0)
        }

        // Fetch recent orders
        const { data: orders } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    menu_items (name)
                )
            `)
            .eq('restaurant_id', restaurant.id)
            .order('created_at', { ascending: false })
            .limit(5)

        recentOrders = orders || []
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Painel de Controle</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest">{restaurant?.name || 'Seu Restaurante'}</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats Card 1 */}
                <div className="premium-card p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-primary tracking-[0.25em] uppercase mb-2">Novos Pedidos</p>
                            <h3 className="text-5xl font-black text-foreground tracking-tighter">{stats.pending}</h3>
                        </div>
                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary shadow-glow group-hover:scale-110 transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        {stats.pending > 0 && <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-glow"></span>}
                        <p className="text-[11px] font-black text-secondary tracking-widest uppercase opacity-60">
                            {stats.pending > 0 ? 'Aguardando Cozinha' : 'Nenhum pedido pendente'}
                        </p>
                    </div>
                </div>

                {/* Stats Card 2 */}
                <div className="premium-card p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-green-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-green-500 tracking-[0.25em] uppercase mb-2">Pedidos Hoje</p>
                            <h3 className="text-5xl font-black text-foreground tracking-tighter">{stats.today}</h3>
                        </div>
                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10 font-bold tracking-widest uppercase opacity-60">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                        <p className="text-[11px] text-secondary">Total Processado</p>
                    </div>
                </div>

                {/* Stats Card 3 */}
                <div className="premium-card p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-blue-500 tracking-[0.25em] uppercase mb-2">Receita Hoje</p>
                            <h3 className="text-3xl font-black text-foreground tracking-tighter truncate">
                                {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF' }).format(stats.revenue)}
                            </h3>
                        </div>
                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-all duration-500">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-13a9 9 0 110 18 9 9 0 010-18zm0 0V3m0 18v-3" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10 font-bold tracking-widest uppercase opacity-60">
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                        <p className="text-[11px] text-secondary">Vendas Concluídas</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="premium-card p-1 overflow-hidden min-h-[500px]">
                <div className="px-10 py-8 border-b border-border/5 flex items-center justify-between bg-white/0.5">
                    <div>
                        <h2 className="text-2xl font-black text-foreground tracking-tighter">Pedidos Recentes</h2>
                        <p className="text-[10px] font-bold text-secondary tracking-widest uppercase opacity-50">Atividade em Tempo Real</p>
                    </div>
                    <span className="px-5 py-2 glass rounded-2xl text-[10px] font-black text-secondary tracking-[0.2em] uppercase">
                        {recentOrders.length} Total
                    </span>
                </div>

                <div className="p-10 space-y-6">
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-24 glass rounded-[2rem]">
                            <svg className="w-16 h-16 text-secondary/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-secondary font-bold tracking-widest uppercase text-xs">Nenhum pedido recente.</p>
                        </div>
                    ) : (
                        recentOrders.map((order) => (
                            <div key={order.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-8 glass rounded-[2.5rem] hover:border-primary/50 transition-all duration-500 group">
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 bg-background border border-border/10 rounded-3xl flex items-center justify-center shadow-lg text-primary group-hover:scale-105 group-hover:border-primary/30 transition-all duration-500">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-xl font-black text-foreground tracking-tight">{order.customer_name}</h4>
                                            {order.status === 'pending' && (
                                                <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full animate-pulse shadow-glow">Novo</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-secondary/60 tracking-wider font-mono">{order.customer_phone}</p>
                                        <div className="pt-3 flex flex-wrap gap-3">
                                            {order.order_items.map((item: { id: string, quantity: number, menu_items: { name: string } | null }) => (
                                                <span key={item.id} className="px-4 py-1.5 bg-background/50 border border-border/5 rounded-xl text-[11px] font-black text-secondary tracking-tight">
                                                    {item.quantity}x {item.menu_items?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 lg:mt-0 flex flex-col items-end gap-5">
                                    <p className="text-3xl font-black text-foreground tracking-tighter">
                                        {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF' }).format(order.total_amount)}
                                    </p>
                                    <div className="lg:scale-110">
                                        <OrderActions orderId={order.id} status={order.status} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
