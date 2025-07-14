"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

interface Phrase {
  id: string
  englishText: string
  turkishTranslation: string
  createdAt: string
  updatedAt: string
}

const phraseSchema = z.object({
  englishText: z.string().min(1, "English text is required.").max(500, "English text is too long."),
  turkishTranslation: z
    .string()
    .min(1, "Turkish translation is required.")
    .max(500, "Turkish translation is too long."),
})

export async function getPhrases(): Promise<Phrase[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("phrases").select("*").order("created_at", { ascending: false })

  if (error) {
    if (error.code === "42P01") {
      console.warn("Supabase table 'phrases' does not exist yet. Please run the SQL migration. Returning empty list.")
      return []
    }
    console.error("Error fetching phrases:", error.message)
    return []
  }

  return data.map((p: any) => ({
    id: p.id,
    englishText: p.english_text,
    turkishTranslation: p.turkish_translation,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }))
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
  const supabase = createClient()

  const { error } = await supabase.from("phrases").insert({
    english_text: englishText,
    turkish_translation: turkishTranslation,
  })

  if (error?.code === "42P01") {
    return {
      success: false,
      message: "Database table 'phrases' not found. Please run the SQL migration to create it.",
    }
  }

  if (error) {
    console.error("Error adding phrase:", error.message)
    return { success: false, message: `Failed to add phrase: ${error.message}` }
  }

  revalidatePath("/")
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
  const supabase = createClient()

  const { error } = await supabase
    .from("phrases")
    .update({
      english_text: englishText,
      turkish_translation: turkishTranslation,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error?.code === "42P01") {
    return {
      success: false,
      message: "Database table 'phrases' not found. Please run the SQL migration to create it.",
    }
  }

  if (error) {
    console.error("Error updating phrase:", error.message)
    return { success: false, message: `Failed to update phrase: ${error.message}` }
  }

  revalidatePath("/")
  return { success: true, message: "Phrase updated successfully!" }
}

export async function deletePhrase(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()
  const { error } = await supabase.from("phrases").delete().eq("id", id)

  if (error?.code === "42P01") {
    return {
      success: false,
      message: "Database table 'phrases' not found. Please run the SQL migration to create it.",
    }
  }

  if (error) {
    console.error("Error deleting phrase:", error.message)
    return { success: false, message: `Failed to delete phrase: ${error.message}` }
  }

  revalidatePath("/")
  return { success: true, message: "Phrase deleted successfully!" }
}
