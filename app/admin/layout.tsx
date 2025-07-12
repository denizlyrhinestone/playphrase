import type React from "react"
import Link from "next/link"
import { HomeIcon, BookIcon, UploadCloudIcon, FilmIcon, Share2Icon } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
        <h2 className="text-xl font-bold mb-6 text-red-500">Admin Panel</h2>
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
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
