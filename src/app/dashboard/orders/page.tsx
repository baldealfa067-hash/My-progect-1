import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { OrderActions } from './OrderActions'

export default async function OrdersPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get restaurant
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.id)
        .single()

    interface OrderItem {
        id: string
        quantity: number
        menu_items: { name: string } | null
    }

    interface Order {
        id: string
        customer_name: string
        customer_phone: string
        status: string
        total_amount: number
        created_at: string
        order_items: OrderItem[]
    }

    let orders: Order[] = []

    if (restaurant) {
        const { data } = await supabase
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

        orders = data || []
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Gestão de Pedidos</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Acompanhamento em Tempo Real</p>
                </div>
            </div>

            {!restaurant ? (
                <div className="premium-card p-10 glass border-orange-500/20">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-foreground mb-1">Configuração Necessária</p>
                            <p className="text-secondary text-sm mb-4">Você precisa configurar seu restaurante antes de receber pedidos.</p>
                            <Link href="/dashboard/settings" className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-glow inline-block hover:scale-105 transition-all">
                                Configurar agora
                            </Link>
                        </div>
                    </div>
                </div>
            ) : orders.length === 0 ? (
                <div className="premium-card p-24 text-center glass">
                    <div className="w-20 h-20 bg-background/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-border/5">
                        <svg className="w-10 h-10 text-secondary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p className="text-secondary font-black tracking-widest uppercase text-xs">Nenhum pedido recebido ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="premium-card p-1 overflow-hidden group cultural-border">
                            <div className="p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10 bg-white/0.5">
                                <div className="flex items-start gap-8">
                                    <div className="w-20 h-20 bg-background border border-border/10 rounded-3xl flex items-center justify-center shadow-lg text-primary group-hover:scale-105 transition-all duration-500">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <p className="text-[10px] font-black text-primary tracking-[0.25em] uppercase opacity-60">
                                                #{order.id.slice(0, 8)}
                                            </p>
                                            <span
                                                className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest glass ${order.status === 'pending'
                                                    ? 'text-primary shadow-glow ring-1 ring-primary/30'
                                                    : order.status === 'accepted'
                                                        ? 'text-blue-400 ring-1 ring-blue-500/30'
                                                        : order.status === 'ready'
                                                            ? 'text-purple-400 ring-1 ring-purple-500/30'
                                                            : order.status === 'completed'
                                                                ? 'text-green-500 ring-1 ring-green-500/30'
                                                                : 'text-red-400 ring-1 ring-red-500/30'
                                                    }`}
                                            >
                                                {order.status === 'pending' && 'Pendente'}
                                                {order.status === 'accepted' && 'Aceito'}
                                                {order.status === 'ready' && 'Pronto'}
                                                {order.status === 'completed' && 'Concluído'}
                                                {order.status === 'rejected' && 'Rejeitado'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-foreground tracking-tighter mb-1">{order.customer_name}</h4>
                                            <p className="text-[12px] font-bold text-secondary/60 tracking-wider font-mono">{order.customer_phone}</p>
                                        </div>
                                        <div className="pt-4 flex flex-wrap gap-3">
                                            {order.order_items.map((item: OrderItem) => (
                                                <span key={item.id} className="px-5 py-2 glass rounded-xl text-[11px] font-black text-secondary tracking-tight">
                                                    {item.quantity}x {item.menu_items?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-border/5">
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-foreground tracking-tighter mb-1">
                                            {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF' }).format(order.total_amount)}
                                        </p>
                                        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">
                                            {new Date(order.created_at).toLocaleString('pt-GW', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                    <div className="scale-110 origin-right transition-transform group-hover:scale-[1.15]">
                                        <OrderActions
                                            orderId={order.id}
                                            status={order.status}
                                            customerName={order.customer_name}
                                            customerPhone={order.customer_phone}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
