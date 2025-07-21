"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { SAMPLE_MEMORIES } from "../data/sampleData"
import type { Memory } from "../types"

interface MemoryContextType {
  memories: Memory[]
  addMemory: (memory: Omit<Memory, "id">) => void
  updateMemory: (updatedMemory: Memory) => void
  deleteMemory: (id: string) => void
  getMemoryById: (id: string) => Memory | undefined
  getMemoriesByDate: (date: string) => Memory[]
  getUniqueRegions: () => string[]
  getUniquePlaces: () => string[]
  getUniqueCategories: () => string[]
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined)

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
  const [memories, setMemories] = useState<Memory[]>(SAMPLE_MEMORIES)

  const addMemory = (memory: Omit<Memory, "id">) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
    }
    setMemories((prev) => [newMemory, ...prev])
  }

  const updateMemory = (updatedMemory: Memory) => {
    setMemories((prev) => prev.map((mem) => (mem.id === updatedMemory.id ? updatedMemory : mem)))
  }

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((mem) => mem.id !== id))
  }

  const getMemoryById = (id: string) => {
    return memories.find((m) => m.id === id)
  }

  const getMemoriesByDate = (date: string) => {
    return memories.filter((m) => m.date === date)
  }

  const getUniqueRegions = () => {
    return Array.from(new Set(memories.map((m) => m.region)))
  }

  const getUniquePlaces = () => {
    return Array.from(new Set(memories.map((m) => m.placeName)))
  }

  const getUniqueCategories = () => {
    return Array.from(new Set(memories.map((m) => m.category)))
  }

  return (
    <MemoryContext.Provider
      value={{
        memories,
        addMemory,
        updateMemory,
        deleteMemory,
        getMemoryById,
        getMemoriesByDate,
        getUniqueRegions,
        getUniquePlaces,
        getUniqueCategories,
      }}
    >
      {children}
    </MemoryContext.Provider>
  )
}

export const useMemories = () => {
  const context = useContext(MemoryContext)
  if (!context) {
    throw new Error("useMemories must be used within a MemoryProvider")
  }
  return context
}
