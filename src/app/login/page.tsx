import { login } from '../auth/actions'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 -right-1/4 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -left-1/4 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-700 relative z-10">
                <div className="premium-card p-1 overflow-hidden">
                    <div className="p-10 lg:p-14 space-y-12 bg-white/0.5">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-glow group hover:scale-110 transition-transform duration-500">
                                <span className="text-white font-black text-4xl">B</span>
                            </div>
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Bem-vindo</h2>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] opacity-40">Acesse sua casa BissauFood</p>
                            </div>
                        </div>

                        <form className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="email-address" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                        Identificação de Acesso
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-sans"
                                        placeholder="seu@email.com"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="password" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                        Chave de Segurança
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                formAction={login}
                                className="w-full py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Iniciar Sessão
                            </button>
                        </form>

                        <div className="text-center pt-6 border-t border-border/5">
                            <a
                                href="/register"
                                className="text-[10px] font-black text-secondary hover:text-white uppercase tracking-[0.2em] transition-all"
                            >
                                Novo por aqui? <span className="text-primary italic">Cadastre seu restaurante</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
