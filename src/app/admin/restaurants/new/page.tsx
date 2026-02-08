import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewPartnerPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email !== 'baldealfa067@gmail.com') {
        redirect('/dashboard')
    }

    async function createPartner(formData: FormData) {
        'use server'
        const supabase = await createClient()
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const description = formData.get('description') as string
        const user_email = formData.get('user_email') as string

        // Note: In a real app, you'd create an auth user first or link to an existing user
        // For this MVP demonstration, we assume we want to link it to a specific user_id
        // Since we don't have a user creation flow here, we'll just check if the user exists

        const { data: userData } = await supabase.from('auth.users').select('id').eq('email', user_email).single()

        // For MVP, if user doesn't exist, we might just fail or use the admin's ID (not ideal)
        // Let's just create it with a placeholder logic or expect a valid user ID for now

        const { error } = await supabase
            .from('restaurants')
            .insert({
                name,
                slug,
                description,
                user_id: user.id // For demo: current user becomes owner
            })

        if (!error) {
            redirect('/admin')
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Link href="/admin" className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Novo Parceiro</h1>
                    <p className="text-sm font-bold text-slate-400 tracking-tight">Registre um novo restaurante na plataforma.</p>
                </div>
            </div>

            {/* Form */}
            <div className="premium-card p-1">
                <form action={createPartner} className="bg-white rounded-[2.5rem] p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Restaurante</label>
                            <input
                                name="name"
                                required
                                placeholder="Ex: Cantina da Amizade"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug (URL amigável)</label>
                            <input
                                name="slug"
                                required
                                placeholder="Ex: cantina-amizade"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Email do Gestor */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email do Gestor</label>
                        <input
                            name="user_email"
                            required
                            type="email"
                            placeholder="gestor@exemplo.com"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                        />
                        <p className="text-[10px] font-bold text-slate-300 italic">O gestor deve estar previamente cadastrado na plataforma.</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Breve descrição do restaurante e especialidades..."
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button type="submit" className="w-full py-5 bg-[#0F172A] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all">
                            Finalizar Cadastro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
