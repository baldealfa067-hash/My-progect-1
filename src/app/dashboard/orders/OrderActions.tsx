'use client'

import { updateOrderStatus } from './actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getWhatsAppLink } from '@/utils/notifications'

export function OrderActions({
    orderId,
    status,
    customerName,
    customerPhone
}: {
    orderId: string,
    status: string,
    customerName: string,
    customerPhone: string
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleUpdate = async (newStatus: string) => {
        setLoading(true)
        try {
            await updateOrderStatus(orderId, newStatus)

            // Generate and open WhatsApp link for communication
            const waLink = getWhatsAppLink(customerPhone, customerName, newStatus, orderId)
            window.open(waLink, '_blank')

            router.refresh()
        } catch (error) {
            console.error('Failed to update order:', error)
            alert('Erro ao atualizar pedido')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'pending') {
        return (
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                    onClick={() => handleUpdate('accepted')}
                    disabled={loading}
                    className="flex-grow flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-[1.8rem] hover:bg-primary-hover hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
                >
                    {loading ? 'Processando...' : (
                        <>
                            Começar Preparo
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </>
                    )}
                </button>
                <button
                    onClick={() => handleUpdate('rejected')}
                    disabled={loading}
                    className="px-6 py-5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.8rem] hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50 border border-slate-100"
                >
                    Rejeitar
                </button>
            </div>
        )
    }

    if (status === 'accepted') {
        return (
            <button
                onClick={() => handleUpdate('ready')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-purple-600 text-white text-sm font-black uppercase tracking-widest rounded-[1.8rem] hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-purple-200 disabled:opacity-50"
            >
                {loading ? '...' : (
                    <>
                        Pedido Pronto
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </>
                )}
            </button>
        )
    }

    if (status === 'ready') {
        return (
            <button
                onClick={() => handleUpdate('completed')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-green-600 text-white text-sm font-black uppercase tracking-widest rounded-[1.8rem] hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
            >
                {loading ? '...' : (
                    <>
                        Entregar Pedido
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </>
                )}
            </button>
        )
    }

    return null
}
