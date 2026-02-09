import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden font-sans">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center glass border-b border-border/10">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase font-display">BissauFood</span>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-primary transition-all">Entrar</Link>
            <Link href="https://wa.me/245900000000" className="hidden sm:block px-6 py-3 bg-[#0F172A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Tornar-se Parceiro</Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 glass rounded-full animate-in slide-in-from-top-4 duration-1000">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-secondary tracking-[0.3em] uppercase">SaaS de Gestão Gastronômica</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] font-display animate-in slide-in-from-bottom-8 duration-700">
                Digitalize seu <br />
                <span className="text-primary italic">Restaurante.</span>
              </h1>

              <p className="text-xl text-secondary/70 max-w-2xl mx-auto font-medium leading-relaxed animate-in slide-in-from-bottom-8 delay-100 duration-700">
                A plataforma completa para transformar seu cardápio em uma experiência digital premium e gerir seus pedidos em tempo real.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in slide-in-from-bottom-8 delay-200 duration-700">
                <Link
                  href="https://wa.me/245900000000"
                  className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-glow hover:scale-105 transition-all"
                >
                  Solicitar Demonstração
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-10 py-5 glass text-secondary hover:text-foreground rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  Login Gestor
                </Link>
              </div>
            </div>

            {/* Interactive UI Mockup Showcase */}
            <div className="mt-24 lg:mt-32 relative animate-in zoom-in-95 delay-300 duration-1000">
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-50 opacity-20 transition-all group-hover:opacity-40"></div>
              <div className="premium-card p-2 max-w-6xl mx-auto relative z-10 border-white/5 bg-slate-900 group">
                <div className="rounded-[1.8rem] overflow-hidden bg-white aspect-[16/9] relative">
                  <Image
                    src="https://images.unsplash.com/photo-1551218808-94e220e031b2?auto=format&fit=crop&q=80&w=1200"
                    alt="Platform Dashboard Preview"
                    fill
                    className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/20 to-transparent flex items-end p-12">
                    <div className="space-y-4">
                      <div className="w-16 h-1 w-primary rounded-full"></div>
                      <h3 className="text-4xl font-black text-white tracking-tighter">Painel de Controle Real-time</h3>
                      <p className="text-white/60 text-sm font-medium max-w-sm">Acompanhe vendas, pedidos e o desempenho do seu cardápio em segundos.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: 'Cardápio Digital QR', desc: 'Seus clientes acessam o cardápio e pedem direto da mesa, sem baixar nada.', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' },
                { title: 'Gestão Inteligente', desc: 'Controle total sobre pratos, preços e categorias através de uma interface intuitiva.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { title: 'Analytics Premium', desc: 'Relatórios detalhados de faturamento e pratos mais vendidos para decisões rápidas.', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' }
              ].map((feature) => (
                <div key={feature.title} className="premium-card p-10 space-y-8 bg-white hover:bg-slate-900 group transition-all duration-500">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-glow">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={feature.icon} />
                    </svg>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black tracking-tight group-hover:text-white transition-colors">{feature.title}</h4>
                    <p className="text-secondary/70 text-sm leading-relaxed group-hover:text-white/60 transition-colors">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-border/10">
        <div className="container mx-auto px-6 lg:px-12 text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="text-sm font-black tracking-[0.3em] uppercase opacity-30">BissauFood Experience</span>
          </div>
          <p className="text-[10px] font-bold text-secondary tracking-widest uppercase opacity-40">© 2026 Bsoftcode. Todos os Direitos Reservados.</p>
        </div>
      </footer>
    </div>
  )
}
