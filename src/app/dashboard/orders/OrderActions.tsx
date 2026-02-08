'use client'

import { updateOrderStatus } from './actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function OrderActions({ orderId, status }: { orderId: string, status: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleUpdate = async (newStatus: string) => {
        setLoading(true)
        try {
            await updateOrderStatus(orderId, newStatus)
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
            <div className="flex gap-2">
                <button
                    onClick={() => handleUpdate('rejected')}
                    disabled={loading}
                    className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                    Rejeitar
                </button>
                <button
                    onClick={() => handleUpdate('accepted')}
                    disabled={loading}
                    className="px-8 py-2 bg-primary text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {loading ? '...' : 'Aceitar'}
                </button>
            </div>
        )
    }

    if (status === 'accepted') {
        return (
            <button
                onClick={() => handleUpdate('ready')}
                disabled={loading}
                className="px-8 py-2 bg-purple-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 disabled:opacity-50"
            >
                {loading ? '...' : 'Pronto'}
            </button>
        )
    }

    if (status === 'ready') {
        return (
            <button
                onClick={() => handleUpdate('completed')}
                disabled={loading}
                className="px-8 py-2 bg-green-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50"
            >
                {loading ? '...' : 'Concluir'}
            </button>
        )
    }

    return null
}
