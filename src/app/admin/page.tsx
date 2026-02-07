import Image from 'next/image'

export default function AdminPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Restaurantes', value: '1', trend: '+12%', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'blue' },
                    { label: 'Restaurantes Ativos', value: '1', trend: 'Active', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'green' },
                    { label: 'Total Pedidos', value: '1,245', trend: '+5%', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', color: 'purple' },
                    { label: 'Receita Total', value: '4.5M CFA', trend: '+1.8%', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'orange' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all">
                        <div className="flex justify-between items-center">
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                </svg>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold bg-${stat.color === 'green' ? 'green-50' : 'blue-50'} text-${stat.color === 'green' ? 'green-500' : 'blue-500'} flex items-center gap-1`}>
                                {stat.trend}
                                {stat.trend.includes('%') && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-extrabold text-foreground">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Restaurant Management Table */}
            <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden min-h-[500px]">
                <div className="px-10 py-8 border-b border-border flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 border border-border rounded-xl flex items-center justify-center text-secondary">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Restaurant Management</h2>
                    </div>

                    <div className="flex items-center gap-4 flex-grow max-w-xl">
                        <div className="relative flex-grow">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Pesquisar restaurante..."
                                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <button className="px-8 py-3.5 bg-blue-600 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                            ADICIONAR
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-border">
                                <th className="px-10 py-6">Restaurante & Local</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6">Criado Em</th>
                                <th className="px-10 py-6 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr className="hover:bg-gray-50 transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-border">
                                            <Image
                                                src="https://images.unsplash.com/photo-1517248135467-4c7ed9d8c47c?w=100&h=100&fit=crop"
                                                alt="Logo"
                                                width={100}
                                                height={100}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-foreground text-lg">Sabores da Bissau</p>
                                            <p className="text-xs text-gray-400 font-medium lowercase">Bissau, Praça dos Heróis</p>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mt-1">ir/sabores-da-bissau</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="px-3 py-1 bg-green-50 text-green-500 text-[9px] font-bold uppercase tracking-widest rounded-lg">ACTIVE</span>
                                </td>
                                <td className="px-10 py-8 text-xs font-bold text-secondary">04/02/2026</td>
                                <td className="px-10 py-8 text-right">
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M12 12h.01" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
