"use client"

import { useEffect, useState } from "react"
import { getLatestPost, LatestPost } from "@/lib/posts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import { getInitial, getAvatarColor } from "@/lib/utils"


const HomeClient = () => {
  const [post, setPost] = useState<LatestPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getLatestPost()
        console.log("LATEST POST:", data)
        console.log("AUTHOR FIELD:", data?.author)

        setPost(data)
      } catch (err) {
        console.error("FETCH FAILED:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!post) return <div>No posts yet</div>

  return (
    <Card className="h-1/2 m-3 w-60 max-w-2xl mx-w-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
        <CardDescription>
          {post.author?.name && (
            <p>
              by {post.author.name}
            </p>
          )}
        </CardDescription>
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
      <CardContent>
        <p className="break-words whitespace-pre-wrap">“{post.content}”</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </CardFooter>
    </Card>
  )
}

export default HomeClient
