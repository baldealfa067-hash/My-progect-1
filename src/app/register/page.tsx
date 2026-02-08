import { signup } from '../auth/actions'

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-700 relative z-10">
                <div className="premium-card p-1 overflow-hidden">
                    <div className="p-10 lg:p-14 space-y-12 bg-white/0.5">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-glow group hover:scale-110 transition-transform duration-500">
                                <span className="text-white font-black text-4xl">B</span>
                            </div>
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Criar Conta</h2>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] opacity-40">Comece sua jornada BissauFood</p>
                            </div>
                        </div>

                        <form className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="email-address" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                        Endereço de Email
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="seu@restaurante.com"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="password" className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-50 ml-1">
                                        Senha de Acesso
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="w-full px-6 py-4 glass rounded-2xl text-sm font-bold placeholder:text-secondary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                formAction={signup}
                                className="w-full py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Registrar Restaurante
                            </button>
                        </form>

                        <div className="text-center pt-6 border-t border-border/5">
                            <a
                                href="/login"
                                className="text-[10px] font-black text-secondary hover:text-white uppercase tracking-[0.2em] transition-all"
                            >
                                Já possui uma conta? <span className="text-primary italic">Entrar agora</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
