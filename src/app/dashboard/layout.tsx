'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '../auth/actions'
import { useState, useEffect } from 'react'

import { User } from '@supabase/supabase-js'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
            } else {
                setUser(user)
            }
        }
        checkUser()
    }, [router])

    const navItems = [
        { label: 'Visão Geral', href: '/dashboard', icon: 'm2.25 12 8.954-8.955c.446-.445 1.05-.695 1.796-.695s1.35.25 1.796.695L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
        { label: 'Cardápio', href: '/dashboard/menu', icon: 'M12 6.042c1.383-1.045 3.192-1.637 5.083-1.637.36 0 .717.021 1.067.062a.45.45 0 0 1 .4.447v11.813a.45.45 0 0 1-.537.439 9.27 9.27 0 0 0-1.28-.088c-1.607 0-3.111.41-4.42 1.122a2.468 2.468 0 0 1-2.67 0c-1.309-.712-2.813-1.122-4.42-1.122-1.238 0-2.396.242-3.453.684a.45.45 0 0 1-.547-.432V5.116a.45.45 0 0 1 .4-.447 9.264 9.264 0 0 1 1.066-.062c1.891 0 3.7.592 5.084 1.637ZM12 6.042V19.25' },
        { label: 'Pedidos', href: '/dashboard/orders', icon: 'M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z' },
        { label: 'Relatórios', href: '/dashboard/reports', icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z' },
        { label: 'Configurações', href: '/dashboard/settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z' },
    ]

    if (!user) return <div className="min-h-screen bg-background"></div>

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 h-screen glass border-r border-border/10 p-6 space-y-8 sticky top-0">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase whitespace-nowrap">BISSAUFOOD</span>
                </div>

                <nav className="flex-grow space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group ${isActive
                                    ? 'bg-primary text-white shadow-glow'
                                    : 'text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <svg className={`w-5 h-5 transition-transform group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="pt-6 border-t border-border/10">
                    <form action={logout}>
                        <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-sm font-semibold text-secondary hover:text-red-400 hover:bg-red-400/5 transition-all group">
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sair da Conta
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar relative">
                {/* Mobile Topbar */}
                <header className="lg:hidden glass border-b border-border/10 h-16 flex items-center px-4 justify-between sticky top-0 z-[60]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                        <span className="text-base font-bold tracking-tight uppercase">BISSAUFOOD</span>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/50 text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 glass animate-in fade-in duration-300">
                        <div className="flex flex-col h-full p-6 pt-24 space-y-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-6 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${pathname === item.href ? 'bg-primary text-white shadow-glow' : 'text-secondary hover:text-white'}`}
                                >
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {item.label}
                                </Link>
                            ))}
                            <div className="pt-6 border-t border-white/10">
                                <form action={logout}>
                                    <button className="flex items-center gap-6 w-full px-6 py-4 rounded-2xl text-lg font-bold text-red-400">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sair da Conta
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Header (Desktop) */}
                <div className="hidden lg:flex items-center justify-between px-8 py-6 sticky top-0 z-40">
                    <div>
                        <h2 className="text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-1">
                            {navItems.find(i => i.href === pathname)?.label || 'Painel'}
                        </h2>
                        <p className="text-[10px] text-secondary/60">Bem-vindo de volta ao seu restaurante.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl glass border-border/5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Ativo</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <main className="flex-grow p-4 lg:p-8 lg:pt-2">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
