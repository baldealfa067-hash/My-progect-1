import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { QRManager } from './QRManager'

export default async function QRCodePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!restaurant) {
        return (
            <div className="premium-card p-10 glass border-orange-500/20 text-center">
                <p className="text-secondary mb-4">Configure seu restaurante primeiro.</p>
                <Link href="/dashboard/settings" className="px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Configurar</Link>
            </div>
        )
    }

    const baseMenuUrl = `https://my-progect-1.vercel.app/menu/${restaurant.slug}`

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Seu QR Code</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Acesso Direto ao seu Cardápio Digital</p>
                </div>
            </div>

            <QRManager
                restaurantName={restaurant.name}
                baseMenuUrl={baseMenuUrl}
            />
        </div>
    )
}
