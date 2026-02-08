'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteMenuItem(itemId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/menu')
}

export async function toggleMenuItemAvailability(itemId: string, isAvailable: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('menu_items')
        .update({ is_available: isAvailable })
        .eq('id', itemId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/menu')
}
