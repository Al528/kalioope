"use client"

import { useEffect, useState } from "react"
import { searchPosts, LatestPost } from "@/lib/posts"
import { Input } from "@/components/ui/input"
import { LikeButton } from "@/components/like-button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Page = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<LatestPost[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const data = await searchPosts(query)
        setResults(data)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [query])

  return (
    <div>
      <Input
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="m-3 w-full max-w-sm"
      />

      {loading && <p className="m-3">Searching...</p>}

      {!loading && query.length >= 2 && results.length === 0 && (
        <p className="m-3 text-muted-foreground">No posts found.</p>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-3">
        {results.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                by {post.author?.name ?? "Unknown"}
              </CardDescription>
            </CardHeader>

            <CardContent className="break-words whitespace-pre-wrap">
              {post.content}
            </CardContent>

            <CardFooter className="flex justify-end">
              <LikeButton
                postId={post.id}
                initialLiked={(post.user_like?.length ?? 0) > 0}
                initialCount={post.likes?.[0]?.count ?? 0}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
