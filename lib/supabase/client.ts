import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  if (typeof window === "undefined") {
    throw new Error("createClient can only be called on the client side.")
  }

  if (!(window as any).supabase) {
    ;(window as any).supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return (window as any).supabase
}
