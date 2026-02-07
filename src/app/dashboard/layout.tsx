import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from '../auth/actions'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
            {/* Topbar */}
            <header className="bg-white border-b border-border h-20 flex items-center px-8 justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground uppercase">BISSAUFOOD</span>
                    </div>
                    <div className="h-4 w-px bg-border hidden md:block"></div>
                    <span className="text-xs font-bold text-secondary tracking-widest uppercase hidden md:block">DASHBOARD</span>
                </div>

                <div className="flex items-center gap-6">
                    {/* Notification Bell */}
                    <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-border text-secondary hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white">2</span>
                    </button>

                    {/* Profile Toggle */}
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 border border-border rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-cover bg-center border-2 border-white" style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Sabores+da+Bissau&background=FF6B35&color=fff")' }}></div>
                        <div className="hidden lg:block text-left mr-2">
                            <p className="text-xs font-bold text-foreground">Sabores da Bissau</p>
                            <p className="text-[10px] font-medium text-green-500 uppercase tracking-tighter">Online</p>
                        </div>
                        <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    <div className="h-8 w-px bg-border"></div>

                    <form action={logout}>
                        <button className="flex items-center gap-2 text-secondary hover:text-red-500 transition-colors group">
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Sair</span>
                        </button>
                    </form>
                </div>
            </header>

            {/* Navigation Tabs (Simulated within layout if they are global) */}
            <div className="bg-white border-b border-border overflow-x-auto">
                <div className="max-w-7xl mx-auto px-8 flex">
                    {[
                        { label: 'PEDIDOS', href: '/dashboard', active: true },
                        { label: 'CARDÁPIO', href: '/dashboard/menu', active: false },
                        { label: 'RELATÓRIOS', href: '/dashboard/reports', active: false }
                    ].map((tab) => (
                        <Link
                            key={tab.label}
                            href={tab.href}
                            className={`px-6 h-14 flex items-center text-xs font-bold tracking-widest border-b-2 transition-all ${tab.active
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-secondary hover:text-foreground'
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>

            <main className="flex-grow p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
