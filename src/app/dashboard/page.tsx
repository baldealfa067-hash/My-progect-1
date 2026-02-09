import { createClient } from '@/utils/supabase/server'
import { OrderActions } from './orders/OrderActions'
import Image from 'next/image'
import { OrdersListing } from './orders/OrdersListing'

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
        table_number: number | null;
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
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Top Operational Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-orange-300 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-16 h-16 bg-white rounded-2xl p-1 shadow-sm overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop"
                                alt="Restaurant"
                                fill
                                className="object-cover rounded-xl"
                            />
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-1">Painel Operacional</p>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{restaurant?.name || 'Seu Restaurante'}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Tempo Médio: <span className="text-slate-900">18M</span></span>
                    </div>
                    <button className="w-12 h-12 bg-[#0F172A] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform relative">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                        <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-[#0F172A]"></span>
                    </button>
                </div>
            </div>

            {/* Main Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="premium-card p-1 items-stretch flex">
                    <div className="bg-white rounded-[2.2rem] p-8 flex flex-row items-center gap-6 w-full group">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307L21.75 8.25" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Faturamento</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                {new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(stats.revenue)} CFA
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="premium-card p-1 items-stretch flex">
                    <div className="bg-white rounded-[2.2rem] p-8 flex flex-row items-center gap-6 w-full group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25L3 7.5m18 0v9l-9 5.25L3 16.5v-9" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Total Pedidos</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stats.today}</h3>
                        </div>
                    </div>
                </div>

                {/* Avg Ticket Card */}
                <div className="premium-card p-1 items-stretch flex">
                    <div className="bg-white rounded-[2.2rem] p-8 flex flex-row items-center gap-6 w-full group">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Ticket Médio</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                {new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(stats.today > 0 ? stats.revenue / stats.today : 0)} CFA
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kitchen Orders Section */}
            {restaurant && (
                <OrdersListing
                    restaurantId={restaurant.id}
                    initialOrders={JSON.parse(JSON.stringify(recentOrders))}
                />
            )}
        </div>
    )
}
