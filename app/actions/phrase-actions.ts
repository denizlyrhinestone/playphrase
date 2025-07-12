"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

// In-memory array to simulate database for phrases
interface Phrase {
  id: string
  englishText: string
  turkishTranslation: string
  createdAt: string
  updatedAt: string
}

let phrases: Phrase[] = [
  {
    id: "1",
    englishText: "Hello world",
    turkishTranslation: "Merhaba dünya",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    englishText: "How are you?",
    turkishTranslation: "Nasılsın?",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    englishText: "I'm just trying to make",
    turkishTranslation: "Sadece yapmaya çalışıyorum",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Define a schema for validating phrase data
const phraseSchema = z.object({
  englishText: z.string().min(1, "English text is required.").max(500, "English text is too long."),
  turkishTranslation: z
    .string()
    .min(1, "Turkish translation is required.")
    .max(500, "Turkish translation is too long."),
})

export async function getPhrases(): Promise<Phrase[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return phrases
}

export async function addPhrase(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  const parsed = phraseSchema.safeParse({
    englishText: formData.get("englishText"),
    turkishTranslation: formData.get("turkishTranslation"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const { englishText, turkishTranslation } = parsed.data
  const newPhrase: Phrase = {
    id: (phrases.length + 1).toString(), // Simple ID generation
    englishText,
    turkishTranslation,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  phrases.push(newPhrase)
  revalidatePath("/") // Revalidate the main page to update phrase list
  return { success: true, message: "Phrase added successfully!" }
}

export async function updatePhrase(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  const id = formData.get("id") as string
  const parsed = phraseSchema.safeParse({
    englishText: formData.get("englishText"),
    turkishTranslation: formData.get("turkishTranslation"),
  })

  if (!id || !parsed.success) {
    return { success: false, message: parsed.error.errors[0].message || "ID and all fields are required for update." }
  }

  const { englishText, turkishTranslation } = parsed.data
  const index = phrases.findIndex((p) => p.id === id)

  if (index !== -1) {
    phrases[index] = {
      ...phrases[index],
      englishText,
      turkishTranslation,
      updatedAt: new Date().toISOString(),
    }
    revalidatePath("/") // Revalidate the main page
    return { success: true, message: "Phrase updated successfully!" }
  }
  return { success: false, message: "Phrase not found." }
}

export async function deletePhrase(id: string): Promise<{ success: boolean; message: string }> {
  const initialLength = phrases.length
  phrases = phrases.filter((p) => p.id !== id)
  if (phrases.length < initialLength) {
    revalidatePath("/") // Revalidate the main page
    return { success: true, message: "Phrase deleted successfully!" }
  }
  return { success: false, message: "Phrase not found." }
}
