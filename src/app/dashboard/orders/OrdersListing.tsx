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
    const [filter, setFilter] = useState<'active' | 'history'>('active')
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
                    const targetId = (payload.new as { id: string })?.id || (payload.old as { id: string })?.id
                    if (!targetId) return

                    const { data: newOrder } = await supabase
                        .from('orders')
                        .select(`
                            *,
                            order_items (
                                *,
                                menu_items (name)
                            )
                        `)
                        .eq('id', targetId)
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
    const historyOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled')

    const displayOrders = filter === 'active' ? activeOrders : historyOrders

    return (
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Fluxo da Cozinha</h2>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{activeOrders.length} Pendentes</span>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-[1.2rem] self-start sm:self-center">
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${filter === 'active' ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Fila Ativa
                    </button>
                    <button
                        onClick={() => setFilter('history')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${filter === 'history' ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Concluídos
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {displayOrders.length === 0 ? (
                    <div className="lg:col-span-2 py-32 bg-slate-50 border border-slate-100 border-dashed rounded-[3rem] text-center space-y-4">
                        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                            <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Cozinha em repouso</p>
                    </div>
                ) : (
                    displayOrders.map((order) => (
                        <div key={order.id} className="premium-card p-1 items-stretch flex animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-[2.5rem] p-8 w-full group relative overflow-hidden flex flex-col h-full">
                                {/* Side Indicator */}
                                <div className={`absolute top-0 left-0 w-2 h-full ${order.status === 'pending' ? 'bg-orange-500' : order.status === 'accepted' ? 'bg-blue-500' : order.status === 'ready' ? 'bg-purple-500' : 'bg-green-500'}`}></div>

                                <div className="flex justify-between items-start mb-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-glow">
                                                Mesa {order.table_number || 'S/N'}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">ID {order.id.slice(0, 4)}</p>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{order.customer_name}</h3>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase mb-1">Status</p>
                                        <span className={`inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${order.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            order.status === 'accepted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                order.status === 'ready' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                            {order.status === 'pending' ? 'Novo Pedido' : order.status === 'accepted' ? 'Em Preparo' : order.status === 'ready' ? 'Pronto' : 'Concluído'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-grow space-y-6 mb-10">
                                    <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">Itens do Pedido</p>
                                    <div className="space-y-4">
                                        {order.order_items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between group/item">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-xs font-black text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-sm">
                                                        {item.quantity}x
                                                    </div>
                                                    <p className="text-base font-bold text-slate-600">{item.menu_items?.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Valor Total</p>
                                        <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                            {new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(order.total_amount)} CFA
                                        </p>
                                    </div>

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
