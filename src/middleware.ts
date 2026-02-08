import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
    // Standard session update for Supabase
    const response = await updateSession(request)

    // Protection logic
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    const isAdmin = request.nextUrl.pathname.startsWith('/admin')

    // If accessing protected routes without being logged in
    if ((isDashboard || isAdmin) && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based protection for Admin
    if (isAdmin && user?.email !== 'baldealfa067@gmail.com') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
