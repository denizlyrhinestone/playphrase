"use server"

import { revalidatePath } from "next/cache"

// This array simulates a database table for phrases.
// In a real application, this would be replaced by a database connection (e.g., PostgreSQL, SQLite).
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
]

// Simulate a unique ID generator
let nextId = phrases.length > 0 ? Math.max(...phrases.map((p) => Number.parseInt(p.id))) + 1 : 1

export async function getPhrases(): Promise<Phrase[]> {
  // In a real app, this would fetch from your database
  return phrases
}

export async function addPhrase(formData: FormData): Promise<{ success: boolean; message: string }> {
  const englishText = formData.get("englishText") as string
  const turkishTranslation = formData.get("turkishTranslation") as string

  if (!englishText || !turkishTranslation) {
    return { success: false, message: "English text and Turkish translation are required." }
  }

  const newPhrase: Phrase = {
    id: (nextId++).toString(),
    englishText,
    turkishTranslation,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  phrases.push(newPhrase)
  revalidatePath("/phrases") // Revalidate the phrases page to show new data
  return { success: true, message: "Phrase added successfully!" }
}

export async function updatePhrase(formData: FormData): Promise<{ success: boolean; message: string }> {
  const id = formData.get("id") as string
  const englishText = formData.get("englishText") as string
  const turkishTranslation = formData.get("turkishTranslation") as string

  if (!id || !englishText || !turkishTranslation) {
    return { success: false, message: "All fields are required for update." }
  }

  const phraseIndex = phrases.findIndex((p) => p.id === id)
  if (phraseIndex === -1) {
    return { success: false, message: "Phrase not found." }
  }

  phrases[phraseIndex] = {
    ...phrases[phraseIndex],
    englishText,
    turkishTranslation,
    updatedAt: new Date().toISOString(),
  }
  revalidatePath("/phrases")
  return { success: true, message: "Phrase updated successfully!" }
}

export async function deletePhrase(id: string): Promise<{ success: boolean; message: string }> {
  const initialLength = phrases.length
  phrases = phrases.filter((p) => p.id !== id)

  if (phrases.length === initialLength) {
    return { success: false, message: "Phrase not found." }
  }
  revalidatePath("/phrases")
  return { success: true, message: "Phrase deleted successfully!" }
}
