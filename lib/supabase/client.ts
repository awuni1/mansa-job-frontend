import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Use dummy values during build time if environment variables are missing
    // to prevent initialization errors during Next.js prerendering.
    if (!supabaseUrl || !supabaseKey) {
        return createBrowserClient(
            'https://placeholder.supabase.co',
            'pk_placeholder'
        )
    }

    return createBrowserClient(supabaseUrl, supabaseKey)
}
