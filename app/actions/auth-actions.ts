"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
})

const signupSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
})

export async function signIn(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const { email, password } = parsed.data
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign-in error:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/admin/phrases")
}

export async function signUp(prevState: any, formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const { email, password } = parsed.data
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error("Sign-up error:", error.message)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Check your email for a confirmation link to activate your account." }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign-out error:", error.message)
  }

  redirect("/login")
}
