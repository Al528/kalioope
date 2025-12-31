"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useEffect, useState } from "react"
import { getFeedPosts } from "@/lib/posts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarColor, getInitial } from "@/lib/utils"

const Page = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await getFeedPosts()
      setPosts(data)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
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
          <CardContent className="break-words whitespace-pre-wrap lg:max-h-40 lg:overflow-y-auto">{post.content}</CardContent>
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
      ))}
    </div>
  )
}

export default Page