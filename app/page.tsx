"use client"

import { useState } from "react"
import Link from "next/link"
import AdminLayout from "@/app/admin/layout"
import {
  ChevronDown,
  Lock,
  Film,
  Copyright,
  Mail,
  X,
  Star,
  Crop,
  Upload,
  MoreHorizontal,
  Download,
  LogInIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlayphraseApp() {
  const [currentPhrase, setCurrentPhrase] = useState("hey there")
  const [videoSource, setVideoSource] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  )

  return (
    <AdminLayout>
      <div className="flex flex-col min-h-screen bg-black text-white">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-red-500">Playphrase</span>.me
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-sm">
                  English (39,590,534 phrases)
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
                <DropdownMenuItem>Turkish</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="#" className="flex items-center gap-1 hover:text-gray-400">
              <LogInIcon className="w-4 h-4" />
              Login/Register
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-gray-400">
              <Lock className="w-4 h-4" />
              Unlock Premium Features
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-gray-400">
              <Film className="w-4 h-4" />
              Video Mixer
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-gray-400">
              <Copyright className="w-4 h-4" />
              For Copyright Owners
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-gray-400">
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 overflow-hidden">
          {/* Video Player Section */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black relative">
            <div className="relative w-full max-w-4xl aspect-video bg-gray-900 flex items-center justify-center">
              <video key={videoSource} className="w-full h-full object-contain" controls>
                <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 bg-gray-900 border-l border-gray-800 p-4 flex flex-col">
            <Tabs defaultValue="phrases" className="flex flex-col flex-1">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="phrases">Phrases</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="phrases" className="flex-1 overflow-auto mt-4">
                <h3 className="text-lg font-semibold mb-4">Most Common 88 Phrases</h3>
                <div className="space-y-2">
                  {/* Placeholder for phrase list */}
                  <div className="bg-gray-800 p-3 rounded-md border border-gray-700">Phrase 1</div>
                  <div className="bg-gray-800 p-3 rounded-md border border-gray-700">Phrase 2</div>
                  <div className="bg-gray-800 p-3 rounded-md border border-gray-700">Phrase 3</div>
                </div>
              </TabsContent>
              <TabsContent value="edit" className="flex-1 overflow-auto mt-4">
                <h3 className="text-lg font-semibold mb-4">Video Editing Controls</h3>
                <p className="text-gray-400">Merge clips, add text overlays, resize video.</p>
                {/* Placeholder for editing controls */}
              </TabsContent>
              <TabsContent value="upload" className="flex-1 overflow-auto mt-4">
                <h3 className="text-lg font-semibold mb-4">Upload Options</h3>
                <p className="text-gray-400">Generate thumbnails, upload to social media.</p>
                {/* Placeholder for upload options */}
              </TabsContent>
            </Tabs>
          </aside>
        </main>

        {/* Bottom Bar */}
        <footer className="flex items-center justify-between h-16 px-4 md:px-6 border-t border-gray-800 bg-gray-900">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Download className="w-4 h-4" />
            Download video
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 mx-4">
            <div className="relative flex items-center w-full max-w-md">
              <span className="absolute left-3 text-gray-500 text-xs font-bold">GR</span>
              <Input
                type="text"
                placeholder="Search for a phrase..."
                value={currentPhrase}
                onChange={(e) => setCurrentPhrase(e.target.value)}
                className="pl-10 pr-2 py-2 rounded-md bg-gray-800 border-gray-700 text-white focus:ring-red-500 focus:border-red-500 w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-gray-800">
              <X className="w-5 h-5 text-gray-400" />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-gray-800">
              <Star className="w-5 h-5 text-gray-400" />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-gray-800">
              <Crop className="w-5 h-5 text-gray-400" />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-gray-800">
              <Upload className="w-5 h-5 text-gray-400" />
            </Button>
            <span className="text-sm text-gray-400">1/0</span>
            <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-gray-800">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </Button>
          </div>
        </footer>
      </div>
    </AdminLayout>
  )
}
