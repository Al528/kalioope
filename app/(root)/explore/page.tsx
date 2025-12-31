"use client"

import { searchPosts } from "@/lib/posts"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Page = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
  
    const search = async () => {
      setLoading(true)
      const data = await searchPosts(query)
      setResults(data)
      setLoading(false)
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

      {loading && <p>Searching...</p>}
      
      {!loading && query && results.length === 0 && (
        <p className="text-muted-foreground">No posts found.</p>
      )}
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 m-3">
        {results.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>by {post.author?.name}</CardDescription>
            </CardHeader>
            <CardContent className="break-words whitespace-pre-wrap">
              {post.content}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}

export default Page