import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'baldealfa067@gmail.com'

export default async function AdminRestaurantsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
        redirect('/dashboard')
    }

    const { data: restaurants } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Restaurantes Parceiros</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Gestão Global do Ecossistema</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl glass">
                    <div className="px-6 py-2 text-center border-r border-white/5">
                        <p className="text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">Total</p>
                        <p className="text-xl font-black text-foreground">{restaurants?.length || 0}</p>
                    </div>
                </div>
            </div>

            <div className="premium-card p-1 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/5">
                                <th className="px-8 py-6 text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">Restaurante</th>
                                <th className="px-8 py-6 text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">Slug / URL</th>
                                <th className="px-8 py-6 text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">Data de Registro</th>
                                <th className="px-8 py-6 text-[10px] font-black text-secondary tracking-widest uppercase opacity-40 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5">
                            {restaurants?.map((restaurant: { id: string, name: string, slug: string, created_at: string }) => (
                                <tr key={restaurant.id} className="group hover:bg-white/1 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-primary font-black shadow-glow group-hover:scale-110 transition-transform">
                                                {restaurant.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{restaurant.name}</p>
                                                <p className="text-[10px] font-medium text-secondary truncate max-w-[200px]">{restaurant.description || 'Sem descrição'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <code className="text-[10px] font-black px-3 py-1 glass rounded-lg text-primary uppercase tracking-wider">
                                            {restaurant.slug}
                                        </code>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-secondary opacity-60">
                                        {new Date(restaurant.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="px-4 py-2 glass rounded-xl text-[10px] font-black text-secondary hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
                                            Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
