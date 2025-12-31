import { avatarColors } from "@/palettes"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitial = (name?: string | null) => {
  return name?.charAt(0).toUpperCase() ?? "?"
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const getAvatarColor = (name?: string | null) => {
  if (!name) return "bg-gray-500"

  const charCode = name.charCodeAt(0)
  return avatarColors[charCode % avatarColors.length]
}
