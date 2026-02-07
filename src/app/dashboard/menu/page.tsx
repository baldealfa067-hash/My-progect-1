import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function MenuPage() {
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

    let menuItems: any[] = []

    if (restaurant) {
        const { data } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .order('created_at', { ascending: false })

        menuItems = data || []
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Cardápio</h2>
                <Link
                    href="/dashboard/menu/new"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                    Adicionar Item
                </Link>
            </div>

            {!restaurant ? (
                <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
                    Você precisa configurar seu restaurante antes de adicionar itens ao cardápio.
                    <Link href="/dashboard/settings" className="ml-2 font-bold hover:underline">
                        Configurar agora
                    </Link>
                </div>
            ) : menuItems.length === 0 ? (
                <div className="rounded-lg bg-white p-12 text-center shadow">
                    <p className="text-gray-500">Nenhum item no cardápio ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item) => (
                        <div key={item.id} className="overflow-hidden rounded-lg bg-white shadow">
                            {item.image_url ? (
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-48 w-full items-center justify-center bg-gray-200 text-gray-400">
                                    Sem imagem
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                    <span className="text-sm font-bold text-indigo-600">
                                        XOF {item.price}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                    {item.description}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.is_available
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {item.is_available ? 'Disponível' : 'Indisponível'}
                                    </span>
                                    <button className="text-sm text-gray-400 hover:text-gray-600">
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
