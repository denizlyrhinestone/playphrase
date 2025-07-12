"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
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
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  SearchIcon,
  UploadCloudIcon,
  FileVideoIcon,
  Scissors,
  Text,
  Youtube,
  Instagram,
  Facebook,
  PinIcon as Pinterest,
  InstagramIcon as Tiktok,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { toast } from "@/hooks/use-toast"
import { useDropzone } from "react-dropzone"

// Server Actions (will be defined in separate files below)
import { getPhrases, addPhrase, updatePhrase, deletePhrase } from "@/app/actions/phrase-actions"
import { uploadVideoToSocialMedia } from "@/app/actions/upload-actions"

interface Phrase {
  id: string
  englishText: string
  turkishTranslation: string
  createdAt: string
  updatedAt: string
}

// Helper component for submit button with pending state
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Processing..." : children}
    </Button>
  )
}

export default function PlayphraseApp() {
  const [currentPhrase, setCurrentPhrase] = useState("hey there")
  const [videoSource, setVideoSource] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  )
  const [isPlaying, setIsPlaying] = useState(false)

  // Phrase Management State
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loadingPhrases, setLoadingPhrases] = useState(true)
  const [editingPhrase, setEditingPhrase] = useState<Phrase | null>(null)
  const [isAddPhraseDialogOpen, setIsAddPhraseDialogOpen] = useState(false)
  const [isEditPhraseDialogOpen, setIsEditPhraseDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const [addPhraseState, addPhraseAction] = useActionState(addPhrase, { success: false, message: "" })
  const [editPhraseState, editPhraseAction] = useActionState(updatePhrase, { success: false, message: "" })

  // Clip Upload State
  const [selectedPhraseIdForClip, setSelectedPhraseIdForClip] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadingClips, setUploadingClips] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  // Video Editing State
  const [englishOverlay, setEnglishOverlay] = useState("")
  const [turkishOverlay, setTurkishOverlay] = useState("")
  const [clipsForEditing, setClipsForEditing] = useState([
    { id: "clip1", name: "Clip 1 (Intro)", src: "/placeholder.mp4" },
    { id: "clip2", name: "Clip 2 (Phrase)", src: "/placeholder.mp4" },
    { id: "clip3", name: "Clip 3 (Outro)", src: "/placeholder.mp4" },
  ])

  // Social Media Upload State
  const [videoUrlForUpload, setVideoUrlForUpload] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  ) // Placeholder video URL
  const [titleForUpload, setTitleForUpload] = useState("")
  const [descriptionForUpload, setDescriptionForUpload] = useState("")
  const [tagsForUpload, setTagsForUpload] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const [socialMediaUploadState, socialMediaUploadAction] = useActionState(uploadVideoToSocialMedia, {
    success: false,
    message: "",
  })

  // --- Effects for Server Action Feedback ---
  useEffect(() => {
    const fetchPhrasesData = async () => {
      setLoadingPhrases(true)
      const data = await getPhrases()
      setPhrases(data)
      setLoadingPhrases(false)
    }
    fetchPhrasesData()
  }, [])

  useEffect(() => {
    if (addPhraseState.message) {
      toast({
        title: addPhraseState.success ? "Success" : "Error",
        description: addPhraseState.message,
        variant: addPhraseState.success ? "default" : "destructive",
      })
      if (addPhraseState.success) {
        setIsAddPhraseDialogOpen(false)
        getPhrases().then(setPhrases) // Re-fetch phrases
      }
    }
  }, [addPhraseState])

  useEffect(() => {
    if (editPhraseState.message) {
      toast({
        title: editPhraseState.success ? "Success" : "Error",
        description: editPhraseState.message,
        variant: editPhraseState.success ? "default" : "destructive",
      })
      if (editPhraseState.success) {
        setIsEditPhraseDialogOpen(false)
        setEditingPhrase(null)
        getPhrases().then(setPhrases) // Re-fetch phrases
      }
    }
  }, [editPhraseState])

  useEffect(() => {
    if (socialMediaUploadState.message) {
      toast({
        title: socialMediaUploadState.success ? "Upload Initiated" : "Upload Failed",
        description: socialMediaUploadState.message,
        variant: socialMediaUploadState.success ? "default" : "destructive",
      })
      if (socialMediaUploadState.success) {
        setTitleForUpload("")
        setDescriptionForUpload("")
        setTagsForUpload("")
        setSelectedPlatforms([])
      }
    }
  }, [socialMediaUploadState])

  // --- Handlers ---
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

  const handleDeletePhrase = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this phrase?")) {
      const result = await deletePhrase(id)
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
      if (result.success) {
        setPhrases(phrases.filter((p) => p.id !== id))
      }
    }
  }

  const handleEditPhraseClick = (phrase: Phrase) => {
    setEditingPhrase(phrase)
    setIsEditPhraseDialogOpen(true)
  }

  const filteredAndSearchedPhrases = useMemo(() => {
    let currentPhrases = phrases

    if (filterCategory !== "all") {
      // Placeholder for actual category filtering
      if (filterCategory === "short") {
        currentPhrases = currentPhrases.filter((p) => p.englishText.length < 10)
      } else if (filterCategory === "long") {
        currentPhrases = currentPhrases.filter((p) => p.englishText.length >= 10)
      }
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      currentPhrases = currentPhrases.filter(
        (phrase) =>
          phrase.englishText.toLowerCase().includes(lowerCaseQuery) ||
          phrase.turkishTranslation.toLowerCase().includes(lowerCaseQuery),
      )
    }
    return currentPhrases
  }, [phrases, searchQuery, filterCategory])

  // Clip Upload Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter((file) => file.type.startsWith("video/"))
    if (newFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid File Type",
        description: "Only video files are allowed.",
        variant: "destructive",
      })
    }
    setUploadedFiles((prev) => [...prev, ...newFiles])
    newFiles.forEach((file) => {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
      setUploadErrors((prev) => ({ ...prev, [file.name]: "" }))
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
    setUploadErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fileName]
      return newErrors
    })
  }

  const handleUploadAllClips = async () => {
    if (!selectedPhraseIdForClip) {
      toast({
        title: "No Phrase Selected",
        description: "Please select a phrase before uploading clips.",
        variant: "destructive",
      })
      return
    }
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please drag and drop video clips to upload.",
        variant: "destructive",
      })
      return
    }

    setUploadingClips(true)
    const uploadPromises = uploadedFiles.map(async (file) => {
      try {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 50))
          setUploadProgress((prev) => ({ ...prev, [file.name]: i }))
        }
        // In a real app, this would send files to your backend for processing and storage.
        // For now, it's a placeholder.
        console.log(`Simulating upload of ${file.name} for phrase ID: ${selectedPhraseIdForClip}`)
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
        toast({
          title: "Upload Success",
          description: `${file.name} uploaded successfully!`,
          variant: "default",
        })
        setUploadErrors((prev) => ({ ...prev, [file.name]: "" }))
      } catch (error: any) {
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        })
        setUploadErrors((prev) => ({ ...prev, [file.name]: error.message }))
      }
    })

    await Promise.all(uploadPromises)
    setUploadingClips(false)
    setUploadedFiles([]) // Clear files after attempt
    setUploadProgress({})
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setSelectedPlatforms((prev) => (checked ? [...prev, platform] : prev.filter((p) => p !== platform)))
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-red-500">Playphrase</span>.org {/* Updated brand */}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-sm">
                Select Actor
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
              <DropdownMenuItem>Actor 1</DropdownMenuItem>
              <DropdownMenuItem>Actor 2</DropdownMenuItem>
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
          <Button className="w-full max-w-4xl mt-4 bg-red-600 hover:bg-red-700">
            Preview Final Video (Backend Render Required)
          </Button>
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
              <Card className="bg-gray-900 text-white border-gray-800 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold">Phrase Management</CardTitle>
                  <Dialog open={isAddPhraseDialogOpen} onOpenChange={setIsAddPhraseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <PlusIcon className="mr-1 h-4 w-4" /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
                      <DialogHeader>
                        <DialogTitle>Add New Phrase</DialogTitle>
                      </DialogHeader>
                      <form action={addPhraseAction} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="englishText" className="text-right">
                            English
                          </label>
                          <Input
                            id="englishText"
                            name="englishText"
                            className="col-span-3 bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="turkishTranslation" className="text-right">
                            Turkish
                          </label>
                          <Input
                            id="turkishTranslation"
                            name="turkishTranslation"
                            className="col-span-3 bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <DialogFooter>
                          <SubmitButton>Add Phrase</SubmitButton>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search phrases..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {loadingPhrases ? (
                    <div className="text-center py-4 text-gray-400">Loading phrases...</div>
                  ) : filteredAndSearchedPhrases.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">No phrases found.</div>
                  ) : (
                    <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-800">
                            <TableHead>English</TableHead>
                            <TableHead>Turkish</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSearchedPhrases.map((phrase) => (
                            <TableRow key={phrase.id} className="hover:bg-gray-800">
                              <TableCell className="font-medium">{phrase.englishText}</TableCell>
                              <TableCell>{phrase.turkishTranslation}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditPhraseClick(phrase)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeletePhrase(phrase.id)}
                                  className="text-red-500 hover:text-red-400"
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Edit Phrase Dialog */}
              {editingPhrase && (
                <Dialog open={isEditPhraseDialogOpen} onOpenChange={setIsEditPhraseDialogOpen}>
                  <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
                    <DialogHeader>
                      <DialogTitle>Edit Phrase</DialogTitle>
                    </DialogHeader>
                    <form action={editPhraseAction} className="grid gap-4 py-4">
                      <input type="hidden" name="id" value={editingPhrase.id} />
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="editEnglishText" className="text-right">
                          English
                        </label>
                        <Input
                          id="editEnglishText"
                          name="englishText"
                          defaultValue={editingPhrase.englishText}
                          className="col-span-3 bg-gray-800 border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="editTurkishTranslation" className="text-right">
                          Turkish
                        </label>
                        <Input
                          id="editTurkishTranslation"
                          name="turkishTranslation"
                          defaultValue={editingPhrase.turkishTranslation}
                          className="col-span-3 bg-gray-800 border-gray-700 text-white"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditPhraseDialogOpen(false)}>
                          Cancel
                        </Button>
                        <SubmitButton>Save Changes</SubmitButton>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            <TabsContent value="edit" className="flex-1 overflow-auto mt-4">
              <Card className="bg-gray-900 text-white border-gray-800 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Video Editing Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-400 text-sm">
                    Note: Actual video processing (merging, overlays, resizing, thumbnail generation) requires a
                    dedicated backend service (e.g., FFmpeg, cloud APIs). This UI provides controls to trigger those
                    backend operations.
                  </p>

                  <div>
                    <h3 className="text-md font-semibold mb-3">Clip Management</h3>
                    <p className="text-sm text-gray-400 mb-2">Drag and drop clips below to reorder them for merging.</p>
                    <div className="space-y-2 bg-gray-800 p-3 rounded-md border border-gray-700 min-h-[100px]">
                      {clipsForEditing.length === 0 ? (
                        <p className="text-center text-gray-500 py-2">No clips added yet. Upload them first!</p>
                      ) : (
                        clipsForEditing.map((clip) => (
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
                  </div>

                  <div>
                    <h3 className="text-md font-semibold mb-3">Text Overlays</h3>
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
                          className="col-span-3 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <Button className="w-full bg-gray-700 hover:bg-gray-600">
                        <Text className="w-4 h-4 mr-2" /> Apply Overlays (Backend Required)
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold mb-3">Video Resizing & Thumbnail</h3>
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
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Generate Thumbnail (Backend Required)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="flex-1 overflow-auto mt-4">
              <Card className="bg-gray-900 text-white border-gray-800 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Clip Upload & Social Media Posting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-md font-semibold mb-3">Upload New Clips</h3>
                    <label htmlFor="phrase-select-clip" className="block text-sm font-medium mb-2">
                      Select Phrase for Clips
                    </label>
                    <Select value={selectedPhraseIdForClip || ""} onValueChange={setSelectedPhraseIdForClip}>
                      <SelectTrigger id="phrase-select-clip" className="w-full bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Choose a phrase" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {phrases.map((phrase) => (
                          <SelectItem key={phrase.id} value={phrase.id}>
                            {phrase.englishText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mt-4 ${
                        isDragActive
                          ? "border-red-500 bg-gray-800"
                          : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <UploadCloudIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                      {isDragActive ? (
                        <p className="text-gray-300">Drop the video files here ...</p>
                      ) : (
                        <p className="text-gray-300">Drag 'n' drop video clips here, or click to select files</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Supported formats: MP4, WebM, MOV (Max 100MB per file)
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-md font-semibold mb-2">Selected Files:</h4>
                        <ul className="space-y-2">
                          {uploadedFiles.map((file) => (
                            <li
                              key={file.name}
                              className="flex items-center justify-between bg-gray-800 p-3 rounded-md border border-gray-700"
                            >
                              <div className="flex items-center gap-3">
                                <FileVideoIcon className="h-5 w-5 text-gray-400" />
                                <span>{file.name}</span>
                                {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                                  <span className="text-sm text-gray-400">({uploadProgress[file.name]}%)</span>
                                )}
                                {uploadProgress[file.name] === 100 && !uploadErrors[file.name] && (
                                  <span className="text-sm text-green-400">Uploaded!</span>
                                )}
                                {uploadErrors[file.name] && (
                                  <span className="text-sm text-red-400">Error: {uploadErrors[file.name]}</span>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFile(file.name)}
                                className="text-gray-400 hover:text-white"
                                disabled={uploadingClips}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        <Button
                          onClick={handleUploadAllClips}
                          className="w-full mt-4 bg-red-600 hover:bg-red-700"
                          disabled={!selectedPhraseIdForClip || uploadedFiles.length === 0 || uploadingClips}
                        >
                          {uploadingClips ? "Uploading..." : "Upload All Clips"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-800" />

                  <div>
                    <h3 className="text-md font-semibold mb-3">Automated Social Media Posting</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Upload processed videos to various social media platforms with SEO-optimized metadata.
                    </p>

                    <form action={socialMediaUploadAction} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="videoUrlForUpload">Video URL (Processed Video)</Label>
                        <Input
                          id="videoUrlForUpload"
                          name="videoUrl"
                          type="url"
                          placeholder="e.g., https://playphrase.org/processed-video.mp4"
                          value={videoUrlForUpload}
                          onChange={(e) => setVideoUrlForUpload(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                        <p className="text-sm text-gray-500">This URL should point to your final, processed video.</p>
                      </div>

                      <h4 className="text-base font-semibold mb-2">SEO Metadata</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="titleForUpload">Video Title</Label>
                          <Input
                            id="titleForUpload"
                            name="title"
                            placeholder="Catchy title for your video (e.g., Learn 'Hello World' in Turkish)"
                            value={titleForUpload}
                            onChange={(e) => setTitleForUpload(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="descriptionForUpload">Video Description</Label>
                          <Textarea
                            id="descriptionForUpload"
                            name="description"
                            placeholder="Detailed description with keywords (e.g., Educational video for Turkish learners, featuring the phrase 'Hello World' and its Turkish translation.)"
                            value={descriptionForUpload}
                            onChange={(e) => setDescriptionForUpload(e.target.value)}
                            className="w-full h-20 bg-gray-800 border-gray-700 text-white resize-none"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="tagsForUpload">Tags (comma-separated)</Label>
                          <Input
                            id="tagsForUpload"
                            name="tags"
                            placeholder="english, turkish, phrases, movie clips, hello world"
                            value={tagsForUpload}
                            onChange={(e) => setTagsForUpload(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>

                      <h4 className="text-base font-semibold mb-2">Select Platforms for Upload</h4>
                      <div className="grid grid-cols-2 gap-3">
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
                  </div>
                </CardContent>
              </Card>
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
  )
}
