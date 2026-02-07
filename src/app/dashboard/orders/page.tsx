import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

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

    let orders: (any & {
        order_items: (any & {
            menu_items: { name: string } | null
        })[]
    })[] = []

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
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>

            {!restaurant ? (
                <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
                    Você precisa configurar seu restaurante antes de receber pedidos.
                    <Link href="/dashboard/settings" className="ml-2 font-bold hover:underline">
                        Configurar agora
                    </Link>
                </div>
            ) : orders.length === 0 ? (
                <div className="rounded-lg bg-white p-12 text-center shadow">
                    <p className="text-gray-500">Nenhum pedido recebido ainda.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <ul role="list" className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <li key={order.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-indigo-600">
                                            #{order.id.slice(0, 8)}
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-gray-900">
                                            {order.customer_name}
                                        </p>
                                        <p className="text-sm text-gray-500">{order.customer_phone}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : order.status === 'accepted'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : order.status === 'ready'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : order.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {order.status === 'pending' && 'Pendente'}
                                            {order.status === 'accepted' && 'Aceito'}
                                            {order.status === 'ready' && 'Pronto'}
                                            {order.status === 'completed' && 'Concluído'}
                                            {order.status === 'rejected' && 'Rejeitado'}
                                        </span>
                                        <p className="mt-2 text-lg font-bold text-gray-900">
                                            XOF {order.total_amount}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-900">Itens:</h4>
                                    <ul className="mt-2 list-inside list-disc text-sm text-gray-500">
                                        {order.order_items.map((item: { id: string; quantity: number; menu_items: { name: string } | null }) => (
                                            <li key={item.id}>
                                                {item.quantity}x {item.menu_items?.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    {order.status === 'pending' && (
                                        <>
                                            <button className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
                                                Rejeitar
                                            </button>
                                            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                                                Aceitar
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'accepted' && (
                                        <button className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-500">
                                            Marcar como Pronto
                                        </button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500">
                                            Concluir Pedido
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
