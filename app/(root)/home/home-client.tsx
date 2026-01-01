"use client"

import { useEffect, useState } from "react"
import { getLatestPost, LatestPost } from "@/lib/posts"
import { LikeButton } from "@/components/like-button"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitial, getAvatarColor } from "@/lib/utils"

const HomeClient = () => {
  const [post, setPost] = useState<LatestPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getLatestPost()
      setPost(data)
      setLoading(false)
    }

    fetchPost()
  }, [])

  if (loading) return <p>Loading...</p>
  if (!post) return <p>No posts yet</p>

  return (
    <Card className="m-3 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
        <CardDescription>by {post.author?.name}</CardDescription>

        <CardAction>
          <Avatar>
            <AvatarFallback
              className={`${getAvatarColor(post.author?.name)} text-white font-bold`}
            >
              {getInitial(post.author?.name)}
            </AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>

      <CardContent className="break-words whitespace-pre-wrap">
        “{post.content}”
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        <LikeButton
          postId={post.id}
          initialLiked={post.user_like.length > 0}
          initialCount={post.likes[0]?.count ?? 0}
        />
      </CardFooter>
    </Card>
  )
}

export default HomeClient

