'use client'

import { useState } from 'react'
import Image from 'next/image'
import { QRActions } from './QRActions'

interface QRManagerProps {
    restaurantName: string;
    baseMenuUrl: string;
}

export function QRManager({ restaurantName, baseMenuUrl }: QRManagerProps) {
    const [tableNumber, setTableNumber] = useState<string>('')

    const menuUrl = tableNumber
        ? `${baseMenuUrl}?table=${tableNumber}`
        : baseMenuUrl

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(menuUrl)}`

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="premium-card p-1 overflow-hidden cultural-border">
                <div className="p-10 lg:p-16 flex flex-col items-center justify-center text-center space-y-10 bg-white/0.5">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/20 rounded-[40px] blur-2xl group-hover:bg-primary/30 transition-all duration-700"></div>
                        <div className="relative glass p-10 rounded-[40px] border-white/10 shadow-2xl">
                            <Image
                                src={qrCodeUrl}
                                alt="QR Code do Restaurante"
                                width={320}
                                height={320}
                                className="object-contain rounded-2xl"
                                unoptimized
                            />
                            {tableNumber && (
                                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 border-4 border-white">
                                    <span className="text-xl font-black">#{tableNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-2xl font-black tracking-tight">{restaurantName}</h3>
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[11px] font-bold text-primary font-mono lowercase break-all max-w-full overflow-hidden">
                            {menuUrl}
                        </div>
                    </div>

                    <QRActions qrCodeUrl={qrCodeUrl} />
                </div>
            </div>

            <div className="space-y-8">
                <div className="premium-card p-10 space-y-8">
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-4">Configurar Mesa</h4>
                        <p className="text-sm font-bold text-secondary/60 mb-6 leading-relaxed">
                            Insira o número da mesa para gerar um QR Code que identifique automaticamente de onde vem o pedido.
                        </p>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-orange-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                            <input
                                type="number"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder="Número da mesa (ex: 5)"
                                className="relative w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h4 className="text-lg font-black uppercase tracking-tight mb-4">Como usar?</h4>
                        <div className="space-y-6">
                            {[
                                { step: '1', text: 'Informe o número da mesa no campo acima.' },
                                { step: '2', text: 'Imprima o QR Code gerado para essa mesa específica.' },
                                { step: '3', text: 'Cole na mesa correspondente.' },
                                { step: '4', text: 'Receba os pedidos com a identificação da mesa automática!' }
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
                </div>

                <div className="premium-card p-10 bg-primary/5 border-primary/20">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Dica de Sucesso</p>
                    <p className="text-sm font-bold text-foreground leading-relaxed">
                        &quot;Identificar a mesa agiliza o serviço em até 15 minutos por pedido, pois elimina a necessidade do garçom perguntar de onde é o pedido.&quot;
                    </p>
                </div>
            </div>
        </div>
    )
}
