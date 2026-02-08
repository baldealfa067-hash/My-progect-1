import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'baldealfa067@gmail.com'

export default async function AdminSettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
        redirect('/dashboard')
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Configurações Master</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Parâmetros Globais do Sistema</p>
                </div>
            </div>

            <div className="max-w-3xl space-y-8">
                <div className="premium-card p-1 overflow-hidden">
                    <div className="p-10 lg:p-12 space-y-12 bg-white/0.5">
                        <div className="space-y-10">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary shadow-glow">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-foreground tracking-tighter">Políticas do Sistema</h3>
                                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-40">Taxas e Regras de Negócio</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                        Taxa de Plataforma (%)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="12.5"
                                        className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                        Tempo Médio de Entrega (m)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="30"
                                        className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-border/5 flex justify-end">
                            <button
                                className="px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all"
                            >
                                Salvar Parâmetros
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
