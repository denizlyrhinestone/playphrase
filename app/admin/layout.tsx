import type React from "react"
import Link from "next/link"
import { HomeIcon, BookIcon, UploadCloudIcon, FilmIcon, Share2Icon, LogInIcon, LogOutIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { signOut } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
        <div className="mb-6">
          <img src="/images/playphrase-logo-no-bg.png" alt="Playphrase.org Logo" className="h-10 w-auto" />
        </div>
        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <HomeIcon className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            href="/admin/phrases"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <BookIcon className="w-5 h-5" /> Phrases
          </Link>
          <Link
            href="/admin/clips"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <UploadCloudIcon className="w-5 h-5" /> Clip Upload
          </Link>
          <Link
            href="/admin/edit"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <FilmIcon className="w-5 h-5" /> Video Editing
          </Link>
          <Link
            href="/admin/uploads"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Share2Icon className="w-5 h-5" /> Uploads
          </Link>
          {user ? (
            <form action={signOut} className="w-full">
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <LogOutIcon className="w-5 h-5" /> Logout
              </Button>
            </form>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <LogInIcon className="w-5 h-5" /> Login
            </Link>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
