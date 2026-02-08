import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { MenuClient } from '@/components/MenuClient'

export default async function RestaurantMenuPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch restaurant details
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!restaurant) {
        notFound()
    }

    // Fetch menu items
    const { data: menuItems } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('is_available', true)
        .order('name')

    return <MenuClient restaurant={restaurant} menuItems={menuItems || []} />
}
