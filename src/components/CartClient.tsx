'use client'

import React, { useState } from 'react'
import { useCart } from './CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function CartClient() {
    const { cart, total, restaurantId, clearCart, removeFromCart } = useCart()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter">Pedido Enviado!</h1>
                    <p className="text-secondary/60 font-medium max-w-xs mx-auto">Seu pedido foi recebido pelo restaurante. Você receberá uma atualização em breve.</p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow"
                >
                    Voltar ao Início
                </button>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8">
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-secondary/20">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tighter">Carrinho Vazio</h2>
                    <p className="text-secondary/40 font-bold text-xs uppercase tracking-widest">Adicione itens para começar</p>
                </div>
                <Link href="/" className="px-10 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary border-primary/20">
                    Ver Cardápios
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!restaurantId || isSubmitting) return

        setIsSubmitting(true)
        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    restaurant_id: restaurantId,
                    customer_name: name,
                    customer_phone: phone,
                    total_amount: total,
                    status: 'pending'
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Create Order Items
            const itemsToInsert = cart.map(item => ({
                order_id: order.id,
                menu_item_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(itemsToInsert)

            if (itemsError) throw itemsError

            // 3. Success
            setIsSuccess(true)
            clearCart()
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Erro ao enviar pedido. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="max-w-2xl mx-auto px-6 py-12 space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="#" onClick={() => router.back()} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-secondary hover:text-primary transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-black tracking-tighter">Seu Pedido</h1>
                    <div className="w-12 h-12"></div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="premium-card p-6 flex items-center justify-between gap-4 group">
                            <div className="flex-1">
                                <h3 className="font-black text-foreground tracking-tight">{item.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-black text-primary px-2 py-0.5 glass rounded-md">{item.quantity}x</span>
                                    <span className="text-[11px] font-bold text-secondary/40 uppercase tracking-widest leading-none">
                                        {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(item.price)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="font-black tracking-tighter text-lg">
                                    {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-secondary/20 hover:text-red-500 hover:bg-red-500/5 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout Form */}
                <div className="premium-card p-1 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-10 bg-white/0.5">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">Seu Nome Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Como devemos lhe chamar?"
                                    className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">Telefone / WhatsApp</label>
                                <input
                                    required
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="+245 9..."
                                    className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">Método de Pagamento</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'cash' ? 'bg-primary/5 border-primary shadow-glow' : 'glass border-transparent opacity-40'}`}
                                    >
                                        <svg className={`w-8 h-8 ${paymentMethod === 'cash' ? 'text-primary' : 'text-secondary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'cash' ? 'text-primary' : 'text-secondary'}`}>Dinheiro</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'card' ? 'bg-primary/5 border-primary shadow-glow' : 'glass border-transparent opacity-40'}`}
                                    >
                                        <svg className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-primary' : 'text-secondary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'card' ? 'text-primary' : 'text-secondary'}`}>Cartão</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-border/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-secondary/50 font-black uppercase text-[10px] tracking-[0.2em]">Total do Pedido</p>
                                <p className="text-3xl font-black tracking-tighter text-foreground">
                                    {new Intl.NumberFormat('pt-GW', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(total)}
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_50px_rgba(255,107,53,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {isSubmitting ? 'Enviando...' : 'Confirmar Pedido'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
