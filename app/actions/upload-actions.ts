"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

// Define a schema for validating upload data
const uploadSchema = z.object({
  videoUrl: z.string().url("Invalid video URL provided."),
  title: z.string().min(1, "Title is required.").max(255, "Title is too long."),
  description: z.string().min(1, "Description is required.").max(1000, "Description is too long."),
  tags: z.string().optional(), // Comma-separated tags
  platforms: z
    .array(z.enum(["tiktok", "instagram", "pinterest", "facebook", "youtube"]))
    .min(1, "At least one platform must be selected."),
})

export async function uploadVideoToSocialMedia(
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: any }> {
  const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY

  if (!AYRSHARE_API_KEY) {
    return { success: false, message: "Ayrshare API key is not configured." }
  }

  // Extract data from FormData
  const videoUrl = formData.get("videoUrl") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const tags = formData.get("tags") as string
  const selectedPlatforms = formData.getAll("platforms") as string[] // Get all selected platform values

  // Validate input using Zod schema
  const parsed = uploadSchema.safeParse({
    videoUrl,
    title,
    description,
    tags,
    platforms: selectedPlatforms,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const {
    videoUrl: validatedVideoUrl,
    title: validatedTitle,
    description: validatedDescription,
    tags: validatedTags,
    platforms: validatedPlatforms,
  } = parsed.data

  try {
    const response = await fetch("https://app.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AYRSHARE_API_KEY}`,
      },
      body: JSON.stringify({
        post: validatedDescription, // Ayrshare uses 'post' for description
        platforms: validatedPlatforms,
        mediaUrls: [validatedVideoUrl], // Array of media URLs
        title: validatedTitle, // Used for platforms like YouTube
        tags: validatedTags ? validatedTags.split(",").map((tag) => tag.trim()) : [], // Convert comma-separated string to array
        // You can add more Ayrshare specific options here, e.g., scheduleDate, shortUrls, etc.
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Ayrshare API Error:", data)
      return { success: false, message: data.message || "Failed to upload video to social media." }
    }

    // Revalidate the uploads page if you implement a list of past uploads
    revalidatePath("/admin/uploads")

    return { success: true, message: "Video upload request sent to Ayrshare successfully!", data }
  } catch (error: any) {
    console.error("Error uploading video:", error)
    return { success: false, message: `An unexpected error occurred: ${error.message}` }
  }
}
