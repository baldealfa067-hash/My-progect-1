import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-24 flex items-center px-6 lg:px-12 glass border-b-0">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-2xl">B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap hidden sm:block">BissauFood</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-black uppercase tracking-widest text-secondary hover:text-white transition-all">Entrar</Link>
            <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all">Criar Conta</Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-32">
          {/* Background Decorative Elements */}
          <div className="absolute top-1/4 -right-1/4 w-[60rem] h-[60rem] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 -left-1/4 w-[60rem] h-[60rem] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
              <div className="flex-1 space-y-12 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 glass rounded-2xl animate-in slide-in-from-top-4 duration-1000">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-glow"></span>
                  <span className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase">O Futuro dos Pedidos chegou</span>
                </div>

                <div className="space-y-6">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] animate-in slide-in-from-left-8 duration-700">
                    Sua Comida <br />
                    <span className="text-primary">Favorita.</span>
                  </h1>
                  <p className="text-xl text-secondary/60 max-w-xl font-medium leading-relaxed animate-in slide-in-from-left-8 delay-100 duration-700 mx-auto lg:mx-0">
                    Experimente a nova forma de descobrir e pedir sabores únicos em Bissau. Rápido, seguro e absolutamente premium.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 pt-8 animate-in slide-in-from-bottom-8 delay-200 duration-700">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-glow hover:scale-105 transition-all text-center"
                  >
                    Começar Agora
                  </Link>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-12 py-6 glass text-secondary hover:text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-center"
                  >
                    Ver Demo
                  </Link>
                </div>
              </div>

              <div className="flex-1 relative animate-in zoom-in-95 delay-300 duration-1000">
                <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white/5 group">
                  <Image
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"
                    alt="Delicious Food"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60"></div>
                  <div className="absolute bottom-16 left-16 right-16">
                    <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-4">Top Rated</p>
                    <h3 className="text-4xl font-black tracking-tighter text-white">Sabores de Quintal</h3>
                  </div>
                </div>

                {/* Floating Stat Card */}
                <div className="absolute -bottom-10 -left-10 lg:-left-20 glass p-8 rounded-[2.5rem] shadow-2xl border border-white/10 hidden sm:block animate-float">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-glow">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-secondary tracking-widest uppercase opacity-40">Velocidade</p>
                      <p className="text-2xl font-black tracking-tighter">Under 25m</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Subtle Footer */}
      <footer className="py-12 border-t border-border/10 text-center">
        <p className="text-[10px] font-black tracking-[0.3em] text-secondary opacity-30 uppercase">© 2026 BissauFood Premium Experience</p>
      </footer>
    </div>
  )
}
