'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { OrderActions } from './OrderActions'

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

export function OrdersListing({
    restaurantId,
    initialOrders
}: {
    restaurantId: string;
    initialOrders: Order[];
}) {
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('orders-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `restaurant_id=eq.${restaurantId}`
                },
                async (payload) => {
                    // Fetch the full order details including order_items
                    const { data: newOrder } = await supabase
                        .from('orders')
                        .select(`
                            *,
                            order_items (
                                *,
                                menu_items (name)
                            )
                        `)
                        .eq('id', payload.new.id || payload.old.id)
                        .single()

                    if (newOrder) {
                        setOrders((current) => {
                            const index = current.findIndex((o) => o.id === newOrder.id)
                            if (index >= 0) {
                                const next = [...current]
                                next[index] = newOrder
                                return next.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            }
                            return [newOrder, ...current].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [restaurantId, supabase])

    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'accepted' || o.status === 'ready')

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Pedidos na Cozinha</h2>
                    <span className="w-7 h-7 bg-orange-100 text-primary rounded-full flex items-center justify-center text-[10px] font-black">
                        {activeOrders.length}
                    </span>
                </div>

                <div className="p-1 bg-slate-100 rounded-2xl flex gap-1">
                    <button className="px-5 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Ativos</button>
                    <button className="px-5 py-2 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-700">Histórico</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {activeOrders.length === 0 ? (
                    <div className="lg:col-span-2 py-24 bg-white border border-slate-100 rounded-[3rem] text-center">
                        <svg className="w-16 h-16 text-slate-100 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-slate-300 font-bold tracking-widest uppercase text-xs">Nenhum pedido na cozinha.</p>
                    </div>
                ) : (
                    activeOrders.map((order) => (
                        <div key={order.id} className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 flex flex-col items-end">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Total</p>
                                <h4 className="text-2xl font-black text-primary tracking-tight">
                                    {new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(order.total_amount)} CFA
                                </h4>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-1.5 bg-[#0F172A] text-white rounded-xl text-[9px] font-black uppercase tracking-widest">
                                        Mesa {order.table_number || 'S/N'}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        ORD-{order.id.slice(0, 4)}
                                    </p>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                            order.status === 'accepted' ? 'bg-blue-100 text-blue-600' :
                                                'bg-purple-100 text-purple-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-6">{order.customer_name}</h3>

                                    <div className="space-y-4">
                                        {order.order_items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-400">
                                                    {item.quantity}x
                                                </div>
                                                <p className="text-sm font-bold text-slate-600">{item.menu_items?.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <OrderActions
                                        orderId={order.id}
                                        status={order.status}
                                        customerName={order.customer_name}
                                        customerPhone={order.customer_phone}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
