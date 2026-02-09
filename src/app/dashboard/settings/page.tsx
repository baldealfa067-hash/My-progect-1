import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function SettingsPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>
}) {
    const params = await searchParams
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get existing restaurant data
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .single()

    async function updateRestaurant(formData: FormData) {
        'use server'

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) redirect('/login')

        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const slug = formData.get('slug') as string

        const restaurantData = {
            user_id: user.id,
            name,
            description,
            slug,
        }

        if (restaurant) {
            await supabase
                .from('restaurants')
                .update(restaurantData)
                .eq('id', restaurant.id)
        } else {
            await supabase
                .from('restaurants')
                .insert(restaurantData)
        }

        revalidatePath('/dashboard/settings')
        redirect('/dashboard/settings?success=true')
    }

    return (
        <div className="max-w-4xl space-y-12 animate-in fade-in duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Configurações da Loja</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Identidade e Presença Digital</p>
                </div>
            </div>

            {/* Success Message */}
            {params.success && (
                <div className="premium-card p-1 animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-green-50 rounded-[2.2rem] p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-black text-green-900">Restaurante atualizado com sucesso!</p>
                            <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Suas alterações foram salvas</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Public Menu URL */}
            {restaurant && (
                <div className="premium-card p-1">
                    <div className="bg-white rounded-[2.2rem] p-8 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Cardápio Público</p>
                                <p className="text-lg font-black text-slate-900 tracking-tight">Compartilhe com seus clientes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 glass rounded-2xl">
                            <code className="flex-1 text-sm font-mono font-bold text-primary">
                                {typeof window !== 'undefined' ? window.location.origin : 'https://my-progect-1.vercel.app'}/menu/{restaurant.slug}
                            </code>
                            <Link
                                href={`/menu/${restaurant.slug}`}
                                target="_blank"
                                className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap"
                            >
                                Visualizar
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-3xl">
                <form action={updateRestaurant} className="space-y-8">
                    <div className="premium-card p-1 overflow-hidden">
                        <div className="p-10 lg:p-12 space-y-12 bg-white/0.5">
                            {/* Section: Basic Info */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary shadow-glow">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-foreground tracking-tighter">Perfil Comercial</h3>
                                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-40">Como os clientes verão você</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label htmlFor="name" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                            Nome da Marca
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            defaultValue={restaurant?.name || ''}
                                            required
                                            className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                            placeholder="Ex: Sabores da Guiné"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="slug" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                            Identificador da URL
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="slug"
                                                id="slug"
                                                defaultValue={restaurant?.slug || ''}
                                                required
                                                className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all lowercase"
                                                placeholder="ex: sabores-da-guine"
                                            />
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/40 hidden lg:block">
                                                {/* Optional: Add a prefix like bissaufood.com/ */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="description" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                        Bio do Restaurante
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows={4}
                                        defaultValue={restaurant?.description || ''}
                                        className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none leading-relaxed"
                                        placeholder="Conte a história da sua cozinha e encante seus clientes..."
                                    />
                                </div>
                            </div>

                            {/* Section: Save */}
                            <div className="pt-10 border-t border-border/5 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all"
                                >
                                    Atualizar Identidade
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
