import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { OrdersListing } from './orders/OrdersListing'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

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
        table_number: number | null;
        order_items: OrderItem[];
        created_at: string;
    }

    let recentOrders: Order[] = []

    if (restaurant) {
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
            .limit(10)

        recentOrders = (orders || []) as unknown as Order[]
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Operational Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white shadow-premium relative group">
                            <Image
                                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop"
                                alt="Restaurant"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter font-display">{restaurant?.name || 'Sua Operação'}</h1>
                        <p className="text-sm font-bold text-slate-400 tracking-tight flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Painel Operacional Ativo
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex px-6 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Live Status</span>
                            <span className="text-[11px] font-black text-slate-900 uppercase">Monitorando Pedidos</span>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Receita Hoje', value: `${new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(stats.revenue)} CFA`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-600' },
                    { label: 'Pedidos Ativos', value: `${stats.pending}`, icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-orange-500' },
                    { label: 'Ticket Médio', value: `${new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(stats.today > 0 ? stats.revenue / stats.today : 0)} CFA`, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-primary' }
                ].map((stat) => (
                    <div key={stat.label} className="premium-card p-8 group">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} group-hover:bg-primary group-hover:text-white transition-all shadow-sm`}>
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kitchen Orders Interface */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Fila de Produção</h2>
                </div>
                {restaurant && (
                    <OrdersListing
                        restaurantId={restaurant.id}
                        initialOrders={JSON.parse(JSON.stringify(recentOrders))}
                    />
                )}
            </div>
        </div>
    )
}
