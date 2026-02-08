import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { MenuItemActions } from './MenuItemActions'

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

    let menuItems: {
        id: string
        name: string
        price: number
        description: string | null
        image_url: string | null
        is_available: boolean
    }[] = []

    if (restaurant) {
        const { data } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .order('created_at', { ascending: false })

        menuItems = data || []
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Seu Cardápio</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Gestão de Sabores e Preços</p>
                    </div>
                </div>
                <Link
                    href="/dashboard/menu/new"
                    className="px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all text-center"
                >
                    Adicionar Novo Item
                </Link>
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
                            <p className="text-secondary text-sm mb-4">Você precisa configurar seu restaurante antes de adicionar itens ao cardápio.</p>
                            <Link href="/dashboard/settings" className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-glow inline-block hover:scale-105 transition-all">
                                Configurar agora
                            </Link>
                        </div>
                    </div>
                </div>
            ) : menuItems.length === 0 ? (
                <div className="premium-card p-24 text-center glass">
                    <div className="w-20 h-20 bg-background/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-border/5">
                        <svg className="w-10 h-10 text-secondary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-secondary font-black tracking-widest uppercase text-xs">Seu cardápio está vazio.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item) => (
                        <div key={item.id} className="premium-card overflow-hidden group">
                            <div className="relative h-64 overflow-hidden">
                                {item.image_url ? (
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-accent/30 text-secondary/20 font-black text-4xl uppercase">
                                        {item.name.charAt(0)}
                                    </div>
                                )}{/* Status Overlay */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest glass shadow-lg ${item.is_available ? 'text-green-400' : 'text-red-400'}`}>
                                        {item.is_available ? 'Disponível' : 'Indisponível'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-2xl font-black text-foreground tracking-tighter leading-tight">{item.name}</h3>
                                    <span className="text-xl font-black text-primary tracking-tighter">
                                        {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(item.price)}
                                    </span>
                                </div>

                                <p className="text-secondary/60 text-sm font-medium line-clamp-2 leading-relaxed h-10">
                                    {item.description || 'Sem descrição definida para este item.'}
                                </p>

                                <div className="pt-6 border-t border-border/5">
                                    <MenuItemActions item={item} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
