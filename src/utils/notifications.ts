export function getWhatsAppLink(phone: string, customerName: string, status: string, orderId: string) {
    const cleanPhone = phone.replace(/\D/g, '')
    const baseUrl = 'https://wa.me/'
    const shortId = orderId.slice(0, 8)

    let message = ''
    switch (status) {
        case 'accepted':
            message = `Olá ${customerName}! Boas notícias: o seu pedido #${shortId} no BissauFood foi ACEITO e já está sendo preparado. ✨`
            break
        case 'ready':
            message = `Olá ${customerName}! O seu pedido #${shortId} no BissauFood está PRONTO! 🛵💨 Estamos aguardando você ou o entregador.`
            break
        case 'completed':
            message = `Olá ${customerName}! O seu pedido #${shortId} foi CONCLUÍDO. Esperamos que goste da refeição! Bom apetite. 🍽️`
            break
        case 'rejected':
            message = `Olá ${customerName}. Infelizmente o restaurante não pôde aceitar o seu pedido #${shortId} no momento. Pedimos desculpas pelo transtorno.`
            break
        default:
            message = `Olá ${customerName}! Estamos processando o seu pedido #${shortId} no BissauFood.`
    }

    return `${baseUrl}${cleanPhone}?text=${encodeURIComponent(message)}`
}
