export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Visão Geral</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 bg-white border border-border rounded-xl text-xs font-bold text-secondary tracking-widest uppercase hover:bg-gray-50 transition-colors shadow-sm">
                        Exportar Dados
                    </button>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
                        Novo Relatório
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Card 1 */}
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1">Novos Pedidos</p>
                            <h3 className="text-4xl font-extrabold text-foreground">1</h3>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <p className="text-[10px] font-bold text-secondary/60 tracking-wider uppercase">Aguardando Cozinha</p>
                    </div>
                </div>

                {/* Stats Card 2 */}
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-green-500 tracking-[0.2em] uppercase mb-1">Pedidos Hoje</p>
                            <h3 className="text-4xl font-extrabold text-foreground">1</h3>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-secondary/60 uppercase tracking-wider font-bold">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <p className="text-[10px]">Total Processado</p>
                    </div>
                </div>

                {/* Stats Card 3 */}
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase mb-1">Receita Hoje</p>
                            <h3 className="text-4xl font-extrabold text-foreground">12.000 CFA</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-13a9 9 0 110 18 9 9 0 010-18zm0 0V3m0 18v-3" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-secondary/60 uppercase tracking-wider font-bold">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <p className="text-[10px]">Valor Bruto de Vendas</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden min-h-[400px]">
                <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-foreground tracking-tight">Pedidos Recentes</h2>
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-secondary uppercase tracking-widest">1 Total</span>
                </div>

                <div className="p-8 space-y-4">
                    {/* Order Item Card */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-gray-50 border border-border rounded-[2rem] hover:border-primary/30 transition-colors group">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm text-primary group-hover:scale-105 transition-transform">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-extrabold text-foreground">Mesa 5</h4>
                                    <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Novo</span>
                                </div>
                                <p className="text-xs font-medium text-secondary tracking-tighter">Mamadu Baldé • 955000000</p>
                                <div className="pt-2">
                                    <span className="px-3 py-1 bg-white border border-border rounded-lg text-[10px] font-semibold text-secondary">1x Russian Pizza</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 lg:mt-0 flex flex-col items-end gap-3">
                            <p className="text-2xl font-extrabold text-foreground">12.000 CFA</p>
                            <button className="px-8 py-2 bg-primary text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                                Aceitar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
