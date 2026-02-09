'use client'

import React from 'react'
import { useCart } from './CartContext'
import Link from 'next/link'
import Image from 'next/image'

interface MenuItem {
    id: string
    name: string
    price: number
    description: string | null
    image_url: string | null
    category: string | null
}

interface Restaurant {
    id: string
    name: string
    description: string | null
}

interface MenuClientProps {
    restaurant: Restaurant
    menuItems: MenuItem[]
}

export function MenuClient({ restaurant, menuItems }: MenuClientProps) {
    const { addToCart, total, itemCount, setTableNumber } = useCart()

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const table = params.get('table')
        if (table) {
            setTableNumber(table)
        }
    }, [setTableNumber])

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            {/* Header / Hero */}
            <div className="relative h-[40vh] overflow-hidden cultural-border">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px]"></div>

                {/* Content */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 px-6 text-center">
                    <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-primary text-4xl font-black mb-6 shadow-glow border-primary/20">
                        {restaurant.name.charAt(0)}
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter mb-2 drop-shadow-2xl">{restaurant.name}</h1>
                    <p className="text-secondary/70 font-bold max-w-md text-sm leading-relaxed">
                        {restaurant.description || 'Bem-vindo ao nosso cardápio digital.'}
                    </p>
                </div>
            </div>

            {/* Menu Items */}
            <div className="max-w-4xl mx-auto px-6 -mt-6 relative z-30 pb-32">
                <div className="space-y-12">
                    {/* Search/Filter */}
                    <div className="glass p-2 rounded-2xl flex items-center gap-4 border-white/5 shadow-xl">
                        <div className="flex-1 flex items-center gap-3 px-4">
                            <svg className="w-5 h-5 text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar no cardápio..."
                                className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full placeholder:text-secondary/20"
                            />
                        </div>
                    </div>

                    {/* Grouped Menu */}
                    {Array.from(new Set(menuItems?.map(i => i.category || 'Outros'))).map(category => (
                        <div key={category} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black tracking-tight uppercase border-l-4 border-primary pl-4">{category}</h2>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {menuItems?.filter(item => (item.category || 'Outros') === category).map((item) => (
                                    <div key={item.id} className="premium-card group hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                                        {item.image_url && (
                                            <div className="h-48 overflow-hidden relative">
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            </div>
                                        )}
                                        <div className="p-8 space-y-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-xl font-black tracking-tight leading-tight">{item.name}</h3>
                                                <span className="text-primary font-black tracking-tighter text-xl">
                                                    {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(item.price)}
                                                </span>
                                            </div>
                                            <p className="text-secondary/50 text-xs font-bold leading-relaxed line-clamp-2">
                                                {item.description}
                                            </p>
                                            <button
                                                onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1 }, restaurant.id)}
                                                className="w-full py-4 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary hover:text-white hover:bg-primary transition-all shadow-lg border-white/5"
                                            >
                                                Adicionar ao Pedido
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {(!menuItems || menuItems.length === 0) && (
                        <div className="text-center py-20 opacity-30">
                            <p className="text-sm font-black uppercase tracking-widest">Cardápio vazio no momento</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Footnote/Cart Preview */}
            {itemCount > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <Link href="/cart" className="w-full bg-primary text-white p-6 rounded-3xl flex items-center justify-between shadow-[0_20px_50px_rgba(255,107,53,0.3)] hover:scale-105 active:scale-95 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black">{itemCount}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Ver Pedido</p>
                                <p className="font-black tracking-tight">Carrinho de Compras</p>
                            </div>
                        </div>
                        <span className="font-black text-xl">
                            {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(total)}
                        </span>
                    </Link>
                </div>
            )}
        </div>
    )
}
