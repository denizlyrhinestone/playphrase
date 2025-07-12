"use client"

import AdminLayout from "@/app/admin/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Scissors,
  Text,
  Crop,
  Youtube,
  Instagram,
  Facebook,
  PinIcon as Pinterest,
  InstagramIcon as Tiktok,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
} from "lucide-react"
import { useState } from "react"

export default function VideoEditingPage() {
  const [englishOverlay, setEnglishOverlay] = useState("")
  const [turkishOverlay, setTurkishOverlay] = useState("")
  const [videoSource, setVideoSource] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // Placeholder video
  )
  const [isPlaying, setIsPlaying] = useState(false)

  // Placeholder for selected clips (in a real app, these would be from uploaded clips)
  const [clips, setClips] = useState([
    { id: "clip1", name: "Clip 1 (Intro)", src: "/placeholder.mp4" },
    { id: "clip2", name: "Clip 2 (Phrase)", src: "/placeholder.mp4" },
    { id: "clip3", name: "Clip 3 (Outro)", src: "/placeholder.mp4" },
  ])

  const handlePlayPause = () => {
    const videoElement = document.getElementById("preview-video") as HTMLVideoElement
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause()
      } else {
        videoElement.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleResetVideo = () => {
    const videoElement = document.getElementById("preview-video") as HTMLVideoElement
    if (videoElement) {
      videoElement.currentTime = 0
      videoElement.pause()
      setIsPlaying(false)
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4 flex flex-col lg:flex-row gap-6">
        {/* Left: Video Preview */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden relative min-h-[400px] lg:min-h-[auto]">
          <div className="relative w-full max-w-4xl aspect-video bg-gray-900 flex items-center justify-center">
            <video id="preview-video" key={videoSource} className="w-full h-full object-contain" controls={false}>
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Button
                size="icon"
                variant="ghost"
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <PauseIcon className="w-10 h-10 fill-white text-white" />
                ) : (
                  <PlayIcon className="w-10 h-10 fill-white text-white" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30"
                onClick={handleResetVideo}
              >
                <RotateCcwIcon className="w-6 h-6 text-white" />
              </Button>
            </div>
          </div>
          <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">Preview Final Video (Backend Render)</Button>
        </div>

        {/* Right: Editing Controls */}
        <aside className="w-full lg:w-96 bg-gray-900 border border-gray-800 p-4 rounded-lg flex flex-col">
          <Tabs defaultValue="clips" className="flex flex-col flex-1">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="clips">Clips</TabsTrigger>
              <TabsTrigger value="overlays">Overlays</TabsTrigger>
              <TabsTrigger value="resize">Resize</TabsTrigger>
            </TabsList>
            <TabsContent value="clips" className="flex-1 overflow-auto mt-4">
              <h3 className="text-lg font-semibold mb-4">Clip Management</h3>
              <p className="text-sm text-gray-400 mb-4">Drag and drop clips below to reorder them for merging.</p>
              <div className="space-y-2 bg-gray-800 p-3 rounded-md border border-gray-700 min-h-[150px]">
                {clips.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No clips added yet. Upload them first!</p>
                ) : (
                  clips.map((clip) => (
                    <div key={clip.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                      <span>{clip.name}</span>
                      {/* Add drag handles or reorder buttons here */}
                    </div>
                  ))
                )}
              </div>
              <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600">
                <Scissors className="w-4 h-4 mr-2" /> Merge Clips (Backend Required)
              </Button>
            </TabsContent>
            <TabsContent value="overlays" className="flex-1 overflow-auto mt-4">
              <h3 className="text-lg font-semibold mb-4">Text Overlays</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="english-overlay" className="block text-sm font-medium mb-1">
                    English Text Overlay
                  </label>
                  <Input
                    id="english-overlay"
                    placeholder="Enter English phrase"
                    value={englishOverlay}
                    onChange={(e) => setEnglishOverlay(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="turkish-overlay" className="block text-sm font-medium mb-1">
                    Turkish Translation Overlay
                  </label>
                  <Input
                    id="turkish-overlay"
                    placeholder="Enter Turkish translation"
                    value={turkishOverlay}
                    onChange={(e) => setTurkishOverlay(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button className="w-full bg-gray-700 hover:bg-gray-600">
                  <Text className="w-4 h-4 mr-2" /> Apply Overlays (Backend Required)
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="resize" className="flex-1 overflow-auto mt-4">
              <h3 className="text-lg font-semibold mb-4">Video Resizing</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="resize-preset" className="block text-sm font-medium mb-1">
                    Select Platform Preset
                  </label>
                  <Select>
                    <SelectTrigger id="resize-preset" className="w-full bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      <SelectItem value="tiktok">
                        <div className="flex items-center gap-2">
                          <Tiktok className="w-4 h-4" /> TikTok (9:16)
                        </div>
                      </SelectItem>
                      <SelectItem value="instagram-story">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" /> Instagram Story (9:16)
                        </div>
                      </SelectItem>
                      <SelectItem value="instagram-post">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" /> Instagram Post (1:1)
                        </div>
                      </SelectItem>
                      <SelectItem value="pinterest">
                        <div className="flex items-center gap-2">
                          <Pinterest className="w-4 h-4" /> Pinterest (2:3)
                        </div>
                      </SelectItem>
                      <SelectItem value="facebook">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-4 h-4" /> Facebook (16:9)
                        </div>
                      </SelectItem>
                      <SelectItem value="youtube">
                        <div className="flex items-center gap-2">
                          <Youtube className="w-4 h-4" /> YouTube (16:9)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-gray-700 hover:bg-gray-600">
                  <Crop className="w-4 h-4 mr-2" /> Resize Video (Backend Required)
                </Button>
                <Button className="w-full bg-red-600 hover:bg-red-700">Generate Thumbnail (Backend Required)</Button>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </AdminLayout>
  )
}
