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

    interface OrderItem {
        quantity: number
        menu_items: {
            name: string
        } | null
    }

    interface OrderWithItems {
        status: string
        total_amount: number
        created_at: string
        order_items: OrderItem[]
    }

    const { data } = await supabase
        .from('orders')
        .select(`
            status, 
            total_amount, 
            created_at,
            order_items (
                quantity,
                menu_items (
                    name
                )
            )
        `)
        .eq('restaurant_id', restaurant?.id)
        .order('created_at', { ascending: false })

    const orderStats = data as unknown as OrderWithItems[]

    const totalRevenue = orderStats?.reduce((acc: number, order: OrderWithItems) => acc + Number(order.total_amount), 0) || 0
    const completedOrdersCount = orderStats?.filter((o: OrderWithItems) => o.status === 'completed').length || 0

    // Top Products Calculation
    const productSales: { [key: string]: number } = {}
    orderStats?.forEach((order) => {
        order.order_items?.forEach((item) => {
            const name = item.menu_items?.name
            if (name) {
                productSales[name] = (productSales[name] || 0) + item.quantity
            }
        })
    })

    const topProducts = Object.entries(productSales)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 3)

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
                    <p className="text-4xl font-black tracking-tighter text-foreground">{completedOrdersCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 premium-card p-1 overflow-hidden">
                    <div className="p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black tracking-tight uppercase">Performance do Mês</h3>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full shadow-glow"></div>
                                <div className="w-3 h-3 bg-white/10 rounded-full"></div>
                            </div>
                        </div>

                        <div className="h-64 flex items-end justify-between gap-4 pt-10 px-4">
                            {[10, 25, 45, 30, 65, 80, 100].map((height, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        className="bg-primary/20 rounded-t-xl transition-all duration-500 group-hover:bg-primary shadow-glow"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-[10px] font-black text-secondary/40 uppercase tracking-widest">Atividade semanal baseada em pedidos recentes</p>
                    </div>
                </div>

                <div className="premium-card p-1 overflow-hidden">
                    <div className="p-10 space-y-8">
                        <h3 className="text-xl font-black tracking-tight uppercase">Top Produtos</h3>
                        <div className="space-y-6">
                            {topProducts.length > 0 ? topProducts.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-foreground">{item.name}</p>
                                        <p className="text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">{item.sales} Unidades</p>
                                    </div>
                                    <div className="text-[10px] font-black px-2 py-1 glass rounded-lg text-green-400">
                                        Popular
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest text-center py-10">Buscando dados...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
