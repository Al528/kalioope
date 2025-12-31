"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { useState } from "react"

import { createPost } from "@/lib/posts"
import { toast } from "sonner"

const Page = () => {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)



  const createPosts = async () => {
    try {
      setLoading(true)
      await createPost(title, content)
      if (!title.trim()) return
      router.push("/")
    } catch (err: any) {
      toast.error(err);
    } finally {
      setLoading(false)
    }
  }



  const cancelPostCreation = () => {
    router.back()
  }

  return (
    <div>
      <FieldSet className="w-72">
        <FieldLegend>Create post</FieldLegend>
        <FieldDescription>Fill in the field below to create a post.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <Input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
          </Field>
          <Field orientation="horizontal">
            <Button onClick={createPosts}>Post</Button>
            <Button variant="outline" onClick={cancelPostCreation}>Cancel</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

export default Page