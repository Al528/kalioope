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
import { getFeedPosts, LatestPost } from "@/lib/posts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarColor, getInitial } from "@/lib/utils"
import { LikeButton } from "@/components/like-button"
import { playfair } from "@/fonts"

const Page = () => {
  const [posts, setPosts] = useState<LatestPost[]>([])
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
    <>
      <h1 className={`${playfair.className} text-5xl mb-3`}>Feed</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ml-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className={`${playfair.className} text-2xl`}>{post.title}</CardTitle>
              <CardDescription>
                by {post.author?.name ?? "Unknown"}
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

            <CardContent className="break-words whitespace-pre-wrap lg:max-h-40 lg:overflow-y-auto">
              {post.content}
            </CardContent>
  
            <CardFooter className="flex items-center justify-between">
              <p className="text-base text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
  
              <LikeButton
                postId={post.id}
                initialLiked={(post.user_like?.length ?? 0) > 0}
                initialCount={post.likes?.[0]?.count ?? 0}
              />
            </CardFooter>
        </Card>
      ))}
    </div>
    </>
  )
}

export default Page
