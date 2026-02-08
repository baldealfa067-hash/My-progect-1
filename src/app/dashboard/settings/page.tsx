import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function SettingsPage() {
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
