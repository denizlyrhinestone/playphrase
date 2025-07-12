"use client"

import AdminLayout from "@/app/admin/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloudIcon, FileVideoIcon, XIcon } from "lucide-react"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "@/hooks/use-toast"

// This is a placeholder for a real file upload action.
// In a real app, this would send files to your backend for processing and storage.
async function uploadClip(file: File, phraseId: string) {
  console.log(`Simulating upload of ${file.name} for phrase ID: ${phraseId}`)
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate success or failure
  if (Math.random() > 0.1) {
    // 90% success rate
    return { success: true, message: `${file.name} uploaded successfully!` }
  } else {
    throw new Error(`Failed to upload ${file.name}. Please try again.`)
  }
}

export default function ClipUploadPage() {
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

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

  const handleUploadAll = async () => {
    if (!selectedPhraseId) {
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

    setUploading(true)
    const uploadPromises = uploadedFiles.map(async (file) => {
      try {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 50))
          setUploadProgress((prev) => ({ ...prev, [file.name]: i }))
        }
        const result = await uploadClip(file, selectedPhraseId)
        toast({
          title: "Upload Success",
          description: result.message,
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
    setUploading(false)
    setUploadedFiles([]) // Clear files after attempt
    setUploadProgress({})
  }

  // Placeholder for fetching phrases (in a real app, you'd fetch from your DB)
  const phrases = [
    { id: "1", englishText: "Hello world" },
    { id: "2", englishText: "How are you?" },
    { id: "3", englishText: "It's raining cats and dogs" },
  ]

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-gray-900 text-white border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Clip Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label htmlFor="phrase-select" className="block text-sm font-medium mb-2">
                Select Phrase for Clips
              </label>
              <Select value={selectedPhraseId || ""} onValueChange={setSelectedPhraseId}>
                <SelectTrigger id="phrase-select" className="w-full bg-gray-800 border-gray-700 text-white">
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
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-red-500 bg-gray-800" : "border-gray-700 bg-gray-800 hover:border-gray-600"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-gray-300">Drop the video files here ...</p>
              ) : (
                <p className="text-gray-300">Drag 'n' drop video clips here, or click to select files</p>
              )}
              <p className="text-sm text-gray-500 mt-2">Supported formats: MP4, WebM, MOV (Max 100MB per file)</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Selected Files:</h3>
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
                        disabled={uploading}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleUploadAll}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700"
                  disabled={!selectedPhraseId || uploadedFiles.length === 0 || uploading}
                >
                  {uploading ? "Uploading..." : "Upload All Clips"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
