
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
            {/* Admin Topbar */}
            <header className="bg-[#1F2029] h-16 flex items-center px-8 justify-between sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">BF</span>
                        </div>
                        <span className="text-white font-bold text-sm tracking-tight uppercase">Admin Console</span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Language Selector */}
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
                        </svg>
                        <div className="flex gap-2 text-[10px] font-bold text-gray-400">
                            <button className="text-white">PT</button>
                            <button className="hover:text-white transition-colors">EN</button>
                            <button className="hover:text-white transition-colors">FR</button>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-gray-700"></div>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-medium text-gray-400 lowercase">admin@bissaufood.com</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow p-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
