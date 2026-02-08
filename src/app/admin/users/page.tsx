import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'baldealfa067@gmail.com'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
        redirect('/dashboard')
    }

    // Since we don't have a profiles table, we list users who have restaurants
    // In a real app, this would query a dedicated profiles or auth.users (via service role)
    const { data: stats } = await supabase
        .from('restaurants')
        .select(`
            user_id,
            name,
            created_at
        `)

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Usuários & Proprietários</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Controle de Acesso e Identidade</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="premium-card p-8 space-y-4">
                    <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary shadow-glow">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-4xl font-black tracking-tighter text-foreground">{stats?.length || 0}</p>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-40">Proprietários Ativos</p>
                    </div>
                </div>
            </div>

            <div className="premium-card p-1 overflow-hidden opacity-50 cursor-not-allowed grayscale">
                <div className="p-24 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 glass rounded-full flex items-center justify-center text-secondary">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Módulo de Segurança Restrito</h3>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest max-w-xs leading-relaxed">A gestão direta de usuários requer credenciais de service_role e infraestrutura de auditoria em conformidade.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
