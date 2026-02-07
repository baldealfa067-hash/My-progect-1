import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-6">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">BISSAUFOOD</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Admin</Link>
          <Link href="/login" className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-200">
            Entrar
          </Link>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-foreground">
              Transforme seu <span className="text-primary">Restaurante</span> em Digital
            </h1>
            <p className="text-lg text-secondary leading-relaxed">
              Simplifique a gestão do seu negócio com nosso cardápio digital QR Code, sistema de pedidos em tempo real e controle total das suas vendas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary-hover hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                Começar Agora →
              </Link>
              <button className="px-8 py-4 bg-white text-secondary border border-border rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors">
                Ver Demo
              </button>
            </div>
            {/* Social proof or badge */}
            <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-2xl w-fit shadow-sm">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground">Novo Pedido</p>
                <p className="text-secondary tracking-tight">Mesa 5 • 3.500 CFA</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image
                src="/restaurant_hero_image_1770484153908.png"
                alt="Restaurante Moderno"
                width={800}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Vantagens</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground">Tudo que você precisa para modernizar seu restaurante</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Cardápio Digital com QR Code', desc: 'Clientes escaneiam e veem o menu completo no celular, sem necessidade de aplicativos.', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'orange' },
                { title: 'Sistema de Pedidos', desc: 'Receba pedidos em tempo real direto no painel da cozinha, eliminando erros de comunicação.', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'green' },
                { title: 'Painel de Controle', desc: 'Gerencie menu, pedidos, mesas e relatórios em um só lugar de forma intuitiva.', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: 'blue' },
                { title: 'Relatórios Simples', desc: 'Acompanhe vendas e pedidos do dia para tomar melhores decisões para seu negócio.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'purple' },
                { title: '100% Mobile', desc: 'Funciona perfeitamente em qualquer dispositivo: tablets, celulares e computadores.', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'teal' },
                { title: 'Tempo Real', desc: 'Atualizações instantâneas de novos pedidos e mudanças de status na cozinha.', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'pink' }
              ].map((feature) => (
                <div key={feature.title} className="p-8 rounded-3xl bg-background border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform duration-300`}>
                    <svg className={`w-6 h-6`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: feature.color }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-secondary text-sm">© 2026 BissauFood. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
