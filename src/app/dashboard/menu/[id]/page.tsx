import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function EditMenuItemPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get item
    const { data: item } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single()

    if (!item) {
        redirect('/dashboard/menu')
    }

    // Verify ownership
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!restaurant || item.restaurant_id !== restaurant.id) {
        redirect('/dashboard/menu')
    }

    async function updateMenuItem(formData: FormData) {
        'use server'

        const supabase = await createClient()
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const imageUrl = formData.get('image_url') as string
        const category = formData.get('category') as string

        await supabase
            .from('menu_items')
            .update({
                name,
                description,
                price,
                image_url: imageUrl,
                category,
            })
            .eq('id', id)

        revalidatePath('/dashboard/menu')
        redirect('/dashboard/menu')
    }

    return (
        <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Editar Item</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Refinando a Excelência do seu Cardápio</p>
                </div>
            </div>

            <div className="premium-card p-1 overflow-hidden">
                <form action={updateMenuItem} className="p-8 lg:p-12 space-y-10 bg-white/0.5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label htmlFor="name" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                    Nome do Prato/Bebida
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    defaultValue={item.name}
                                    placeholder="Ex: Pizza de Muzamba"
                                    className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans"
                                />
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="price" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                    Preço de Venda (XOF)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    required
                                    min="0"
                                    step="1"
                                    defaultValue={item.price}
                                    placeholder="0"
                                    className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono"
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="category" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                Categoria
                            </label>
                            <select
                                name="category"
                                id="category"
                                required
                                defaultValue={item.category || ''}
                                className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none bg-transparent"
                            >
                                <option value="" disabled className="bg-background">Selecionar...</option>
                                <option value="Entradas" className="bg-background">Entradas</option>
                                <option value="Pratos Principais" className="bg-background">Pratos Principais</option>
                                <option value="Bebidas" className="bg-background">Bebidas</option>
                                <option value="Sobremesas" className="bg-background">Sobremesas</option>
                                <option value="Outros" className="bg-background">Outros</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="description" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                Descrição e Ingredientes
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows={6}
                                defaultValue={item.description}
                                placeholder="Conte a história deste prato..."
                                className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none leading-relaxed font-sans"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="image_url" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                            URL da Foto (HD)
                        </label>
                        <div className="relative">
                            <input
                                type="url"
                                name="image_url"
                                id="image_url"
                                defaultValue={item.image_url}
                                placeholder="https://exemplo.com/item.jpg"
                                className="w-full pl-16 pr-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono"
                            />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/40">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-6 pt-10 border-t border-border/5">
                        <Link
                            href="/dashboard/menu"
                            className="px-8 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary hover:text-white transition-all text-center"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
