"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { signUp } from "@/app/actions/auth-actions"

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing Up..." : children}
    </Button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signUp, { success: false, message: "" })

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <Card className="w-full max-w-md bg-gray-900 text-white border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign Up for Playphrase.org</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create an account to manage your video content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <SubmitButton>Sign Up</SubmitButton>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="underline text-red-500 hover:text-red-400">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
