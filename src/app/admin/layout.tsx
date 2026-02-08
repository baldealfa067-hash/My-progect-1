'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/app/auth/actions'
import { useState, useEffect } from 'react'

const ADMIN_EMAIL = 'baldealfa067@gmail.com'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user || user.email !== ADMIN_EMAIL) {
                router.push('/dashboard')
            } else {
                setUser(user)
            }
        }
        checkUser()
    }, [router])

    const navItems = [
        { label: 'Estatísticas', href: '/admin', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
        { label: 'Restaurantes', href: '/admin/restaurants', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { label: 'Usuários', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { label: 'Configurações', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ]

    if (!user) return <div className="min-h-screen bg-background"></div>

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 h-screen glass border-r border-border/10 p-6 space-y-8 sticky top-0">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
                        <span className="text-white font-black text-xl">B</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">ADMIN PANEL</span>
                </div>

                <nav className="flex-grow space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${isActive
                                    ? 'bg-primary text-white shadow-glow'
                                    : 'text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="pt-6 border-t border-border/10">
                    <div className="mb-6 px-4">
                        <p className="text-[10px] font-black text-secondary tracking-widest uppercase opacity-40 mb-1">Logado como</p>
                        <p className="text-xs font-bold text-secondary truncate">{user.email}</p>
                    </div>
                    <form action={logout}>
                        <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-secondary hover:text-red-400 hover:bg-red-400/5 transition-all group">
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
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
                            <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <span className="text-base font-black tracking-tight uppercase">ADMIN</span>
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
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <main className="flex-grow p-4 lg:p-12">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
