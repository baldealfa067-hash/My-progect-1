import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()
    const isRegisterPage = url.pathname.startsWith('/register')
    const isAdminRoute = url.pathname.startsWith('/admin')
    const isDashboardRoute = url.pathname.startsWith('/dashboard')
    const ADMIN_EMAIL = 'baldealfa067@gmail.com'

    // 1. Redirect /register to /login (Account creation is Admin-only)
    if (isRegisterPage) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. Protect Admin Routes
    if (isAdminRoute) {
        if (!user || user.email !== ADMIN_EMAIL) {
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    // 3. Protect Dashboard Routes
    if (isDashboardRoute) {
        if (!user) {
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
