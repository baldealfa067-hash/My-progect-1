'use client'

import React from 'react'

interface QRActionsProps {
    qrCodeUrl: string
}

export function QRActions({ qrCodeUrl }: QRActionsProps) {
    return (
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
    )
}
