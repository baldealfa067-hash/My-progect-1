import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function SettingsPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get existing restaurant data
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .single()

    async function updateRestaurant(formData: FormData) {
        'use server'

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) redirect('/login')

        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const slug = formData.get('slug') as string

        const restaurantData = {
            user_id: user.id,
            name,
            description,
            slug,
        }

        if (restaurant) {
            await supabase
                .from('restaurants')
                .update(restaurantData)
                .eq('id', restaurant.id)
        } else {
            await supabase
                .from('restaurants')
                .insert(restaurantData)
        }

        revalidatePath('/dashboard/settings')
    }

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Restaurante</h2>

            <div className="bg-white shadow rounded-lg p-6">
                <form action={updateRestaurant} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nome do Restaurante
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={restaurant?.name || ''}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                            Slug (URL amigável)
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                bissaufood.com/
                            </span>
                            <input
                                type="text"
                                name="slug"
                                id="slug"
                                defaultValue={restaurant?.slug || ''}
                                required
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Descrição
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            defaultValue={restaurant?.description || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
