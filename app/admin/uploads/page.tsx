"use client"

import type React from "react"

import AdminLayout from "@/app/admin/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Youtube,
  Instagram,
  Facebook,
  PinIcon as Pinterest,
  InstagramIcon as Tiktok,
  UploadCloudIcon,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { uploadVideoToSocialMedia } from "@/app/actions/upload-actions"
import { toast } from "@/hooks/use-toast"

// Helper component for submit button with pending state
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Uploading..." : children}
    </Button>
  )
}

export default function UploadsPage() {
  const [videoUrl, setVideoUrl] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  ) // Placeholder video URL
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const [uploadState, uploadAction] = useFormState(uploadVideoToSocialMedia, { success: false, message: "" })

  useEffect(() => {
    if (uploadState.message) {
      toast({
        title: uploadState.success ? "Upload Initiated" : "Upload Failed",
        description: uploadState.message,
        variant: uploadState.success ? "default" : "destructive",
      })
      if (uploadState.success) {
        // Optionally clear form fields after successful initiation
        setTitle("")
        setDescription("")
        setTags("")
        setSelectedPlatforms([])
        // setVideoUrl(""); // Only clear if you want to force new video selection
      }
    }
  }, [uploadState])

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setSelectedPlatforms((prev) => (checked ? [...prev, platform] : prev.filter((p) => p !== platform)))
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-gray-900 text-white border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Video Uploads & SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-6">
              Manage processed videos and upload them to social media platforms with SEO-optimized metadata.
            </p>

            <form action={uploadAction} className="space-y-6">
              {/* Video Selection (Placeholder) */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL (Placeholder)</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  placeholder="e.g., https://yourdomain.com/processed-video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
                <p className="text-sm text-gray-500">
                  In a real app, this would be selected from your processed videos.
                </p>
              </div>

              <h3 className="text-lg font-semibold mb-4">SEO Metadata</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Catchy title for your video (e.g., Learn 'Hello World' in Turkish)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Video Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed description with keywords (e.g., Educational video for Turkish learners, featuring the phrase 'Hello World' and its Turkish translation.)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-24 bg-gray-800 border-gray-700 text-white resize-none"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="english, turkish, phrases, movie clips, hello world"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Select Platforms for Upload</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: "youtube", name: "YouTube", icon: Youtube },
                  { id: "tiktok", name: "TikTok", icon: Tiktok },
                  { id: "instagram", name: "Instagram", icon: Instagram },
                  { id: "facebook", name: "Facebook", icon: Facebook },
                  { id: "pinterest", name: "Pinterest", icon: Pinterest },
                ].map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      name="platforms"
                      value={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) => handlePlatformChange(platform.id, !!checked)}
                      className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
                    />
                    <Label htmlFor={platform.id} className="flex items-center gap-2 text-white cursor-pointer">
                      <platform.icon className="w-4 h-4" /> {platform.name}
                    </Label>
                  </div>
                ))}
              </div>

              <SubmitButton>
                <UploadCloudIcon className="w-4 h-4 mr-2" /> Initiate Upload to Selected Platforms
              </SubmitButton>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Past Uploads Status</h3>
              <p className="text-gray-400">
                A table or list showing past videos, their thumbnails, and upload statuses will appear here.
              </p>
              {/* Placeholder for uploads table/list */}
              <div className="bg-gray-800 p-4 rounded-md border border-gray-700 min-h-[100px] text-gray-500 flex items-center justify-center">
                No past uploads to display yet.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
