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
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Menu Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 font-display">Cardápio Digital</h1>
                    <p className="text-sm font-bold text-slate-400 tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        Gestão de pratos, preços e disponibilidade em tempo real.
                    </p>
                </div>
                <Link
                    href="/dashboard/menu/new"
                    className="px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-glow hover:scale-105 transition-all text-center flex items-center gap-3"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Item
                </Link>
            </div>

            {!restaurant ? (
                <div className="premium-card p-12 bg-orange-50/30 border-orange-500/10">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="w-20 h-20 bg-orange-500/10 rounded-[2rem] flex items-center justify-center text-orange-500 shadow-sm">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-grow space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Ação Requerida</h3>
                            <p className="text-slate-500 font-medium max-w-lg">Vimos que seu restaurante ainda não está configurado. Complete o perfil para liberar o cardápio digital.</p>
                        </div>
                        <Link href="/dashboard/settings" className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all">
                            Configurar Agora
                        </Link>
                    </div>
                </div>
            ) : menuItems.length === 0 ? (
                <div className="py-32 bg-slate-50 border border-slate-100 border-dashed rounded-[3rem] text-center space-y-6">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                        <svg className="w-12 h-12 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Cardápio Vazio</p>
                        <p className="text-secondary/50 text-sm font-medium">Você ainda não possui pratos cadastrados no sistema.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item) => (
                        <div key={item.id} className="premium-card p-1 items-stretch flex group animate-in zoom-in-95 duration-500">
                            <div className="bg-white rounded-[2.5rem] overflow-hidden w-full flex flex-col">
                                <div className="relative h-72 overflow-hidden">
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-200 font-black text-6xl tracking-tighter uppercase">
                                            {item.name.charAt(0)}
                                        </div>
                                    )}

                                    {/* Availability Badge */}
                                    <div className="absolute top-6 left-6">
                                        <div className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md border ${item.is_available ? 'bg-white/80 text-green-600 border-green-100' : 'bg-white/80 text-red-600 border-red-100'}`}>
                                            {item.is_available ? 'Disponível' : 'Indisponível'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6 flex-grow flex flex-col">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-[0.9] group-hover:text-primary transition-colors">{item.name}</h3>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                                {new Intl.NumberFormat('pt-GW', { maximumFractionDigits: 0 }).format(item.price)}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">CFA</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed flex-grow">
                                        {item.description || 'Um sabor único esperando para ser descoberto pelos seus clientes.'}
                                    </p>

                                    <div className="pt-8 border-t border-slate-50">
                                        <MenuItemActions item={item} />
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
