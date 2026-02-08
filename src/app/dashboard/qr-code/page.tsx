import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function QRCodePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!restaurant) {
        return (
            <div className="premium-card p-10 glass border-orange-500/20 text-center">
                <p className="text-secondary mb-4">Configure seu restaurante primeiro.</p>
                <Link href="/dashboard/settings" className="px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Configurar</Link>
            </div>
        )
    }

    const menuUrl = `https://my-progect-1.vercel.app/menu/${restaurant.slug}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(menuUrl)}`

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">Seu QR Code</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Acesso Direto ao seu Cardápio Digital</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="premium-card p-1 overflow-hidden cultural-border">
                    <div className="p-10 lg:p-16 flex flex-col items-center justify-center text-center space-y-10 bg-white/0.5">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/20 rounded-[40px] blur-2xl group-hover:bg-primary/30 transition-all duration-700"></div>
                            <div className="relative glass p-10 rounded-[40px] border-white/10 shadow-2xl">
                                <img
                                    src={qrCodeUrl}
                                    alt="QR Code do Restaurante"
                                    className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-2xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-black tracking-tight">{restaurant.name}</h3>
                            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[11px] font-bold text-primary font-mono lowercase">
                                {menuUrl}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full pt-6">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-[1.02] transition-all"
                            >
                                Imprimir QR Code
                            </button>
                            <a
                                href={qrCodeUrl}
                                download="qrcode.png"
                                target="_blank"
                                className="flex-1 px-8 py-4 glass text-secondary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all text-center"
                            >
                                Download Imagem
                            </a>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="premium-card p-10 space-y-6">
                        <h4 className="text-xl font-black uppercase tracking-tight">Como usar?</h4>
                        <div className="space-y-6">
                            {[
                                { step: '1', text: 'Imprima o QR Code em alta qualidade.' },
                                { step: '2', text: 'Coloque o código nas mesas do seu restaurante ou balcão.' },
                                { step: '3', text: 'Os clientes apontam a câmera do celular para o código.' },
                                { step: '4', text: 'Eles acessam o cardápio e fazem o pedido na hora!' }
                            ].map((item) => (
                                <div key={item.step} className="flex gap-5">
                                    <div className="w-8 h-8 rounded-xl glass flex items-center justify-center text-primary text-xs font-black shrink-0">
                                        {item.step}
                                    </div>
                                    <p className="text-sm font-bold text-secondary/60 leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card p-10 bg-primary/5 border-primary/20">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Dica de Sucesso</p>
                        <p className="text-sm font-bold text-foreground leading-relaxed">
                            "Restaurantes que usam cardápio digital via QR Code reduzem o tempo de atendimento em até 20% e aumentam o ticket médio com sugestões automáticas."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
