"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useFormStatus, useFormState } from "react-dom"
import { getPhrases, addPhrase, updatePhrase, deletePhrase } from "@/app/actions/phrase-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PencilIcon, Trash2Icon, PlusIcon, SearchIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import AdminLayout from "@/app/admin/layout"

interface Phrase {
  id: string
  englishText: string
  turkishTranslation: string
  createdAt: string
  updatedAt: string
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Processing..." : children}
    </Button>
  )
}

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPhrase, setEditingPhrase] = useState<Phrase | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const [addState, addAction] = useFormState(addPhrase, { success: false, message: "" })
  const [editState, editAction] = useFormState(updatePhrase, { success: false, message: "" })

  useEffect(() => {
    const fetchPhrases = async () => {
      setLoading(true)
      const data = await getPhrases()
      setPhrases(data)
      setLoading(false)
    }
    fetchPhrases()
  }, [])

  useEffect(() => {
    if (addState.message) {
      toast({
        title: addState.success ? "Success" : "Error",
        description: addState.message,
        variant: addState.success ? "default" : "destructive",
      })
      if (addState.success) {
        setIsAddDialogOpen(false)
        // Re-fetch phrases to update the list
        getPhrases().then(setPhrases)
      }
    }
  }, [addState])

  useEffect(() => {
    if (editState.message) {
      toast({
        title: editState.success ? "Success" : "Error",
        description: editState.message,
        variant: editState.success ? "default" : "destructive",
      })
      if (editState.success) {
        setIsEditDialogOpen(false)
        setEditingPhrase(null)
        // Re-fetch phrases to update the list
        getPhrases().then(setPhrases)
      }
    }
  }, [editState])

  const handleDelete = async (id: string) => {
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

  const handleEditClick = (phrase: Phrase) => {
    setEditingPhrase(phrase)
    setIsEditDialogOpen(true)
  }

  const filteredAndSearchedPhrases = useMemo(() => {
    let currentPhrases = phrases

    // Apply category filter (placeholder for now)
    if (filterCategory !== "all") {
      // In a real app, you'd filter by a 'category' field on Phrase
      // For now, let's simulate a filter, e.g., by phrase length
      if (filterCategory === "short") {
        currentPhrases = currentPhrases.filter((p) => p.englishText.length < 10)
      } else if (filterCategory === "long") {
        currentPhrases = currentPhrases.filter((p) => p.englishText.length >= 10)
      }
    }

    // Apply search query
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

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-gray-900 text-white border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Phrase Management</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <PlusIcon className="mr-2 h-4 w-4" /> Add New Phrase
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Add New Phrase</DialogTitle>
                </DialogHeader>
                <form action={addAction} className="grid gap-4 py-4">
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
            {/* Add Search and Filter Inputs */}
            <div className="flex items-center gap-4 mb-4">
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
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="short">Short Phrases</SelectItem> {/* Placeholder filter */}
                  <SelectItem value="long">Long Phrases</SelectItem> {/* Placeholder filter */}
                  {/* In a real app, these would come from your phrase categories */}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading phrases...</div>
            ) : filteredAndSearchedPhrases.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No phrases found matching your criteria.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-800">
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>English Text</TableHead>
                    <TableHead>Turkish Translation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSearchedPhrases.map((phrase) => (
                    <TableRow key={phrase.id} className="hover:bg-gray-800">
                      <TableCell className="font-medium">{phrase.id}</TableCell>
                      <TableCell>{phrase.englishText}</TableCell>
                      <TableCell>{phrase.turkishTranslation}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(phrase)}
                          className="text-gray-400 hover:text-white"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(phrase.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Phrase Dialog */}
        {editingPhrase && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Edit Phrase</DialogTitle>
              </DialogHeader>
              <form action={editAction} className="grid gap-4 py-4">
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
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <SubmitButton>Save Changes</SubmitButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
}
