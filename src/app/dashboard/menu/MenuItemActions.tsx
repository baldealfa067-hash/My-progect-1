'use client'

import { deleteMenuItem, toggleMenuItemAvailability } from './actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export function MenuItemActions({ item }: { item: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este item?')) return

        setLoading(true)
        try {
            await deleteMenuItem(item.id)
            router.refresh()
        } catch (error) {
            alert('Erro ao excluir item')
        } finally {
            setLoading(false)
        }
    }

    const handleToggle = async () => {
        setLoading(true)
        try {
            await toggleMenuItemAvailability(item.id, !item.is_available)
            router.refresh()
        } catch (error) {
            alert('Erro ao atualizar disponibilidade')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-between gap-4">
            <button
                onClick={handleToggle}
                disabled={loading}
                className={`flex-grow h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all glass disabled:opacity-50 ${item.is_available
                    ? 'text-green-500 hover:bg-green-500/10'
                    : 'text-red-500 hover:bg-red-500/10'
                    }`}
            >
                {item.is_available ? 'Pausar Vendas' : 'Ativar Vendas'}
            </button>
            <div className="flex gap-2">
                <Link
                    href={`/dashboard/menu/${item.id}`}
                    className="w-11 h-11 flex items-center justify-center glass rounded-xl text-secondary hover:text-primary hover:shadow-glow transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-11 h-11 flex items-center justify-center glass rounded-xl text-secondary hover:text-red-500 transition-all disabled:opacity-50"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
