"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

type LikeButtonProps = {
  postId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(Number(initialCount) || 0)
  const [loading, setLoading] = useState(false)

  const toggleLike = async () => {
    if (loading) return
    setLoading(true)
  
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
  
      if (!user) return
  
      if (liked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id)
  
        setLiked(false)
        setCount((c) => c - 1)
      } else {
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        })
  
        setLiked(true)
        setCount((c) => c + 1)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      disabled={loading}
      className="flex items-center gap-1"
    >
      <Heart
        className={`h-4 w-4 transition-transform ${
          liked ? "fill-red-500 text-red-500 scale-110" : ""
        }`}
      />
      <span>{Number.isFinite(count) ? count : 0}</span>
    </Button>
  )
}
