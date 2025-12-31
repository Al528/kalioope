"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from "@/components/ui/card"
import { playfair } from "@/fonts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarColor, getInitial } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { PencilLine } from "lucide-react"
import { useAuth } from "@/app/context/context"
import { getMyPosts } from "@/lib/posts"


type Profile = {
  name: string
  email: string
  bio: string
}

const Page = () => {
  const { user } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [postsLoading, setPostsLoading] = useState(true)


  const [editName, setEditName] = useState("")
  const [editBio, setEditBio] = useState("")
  const [saving, setSaving] = useState(false)

  /* ---------------- FETCH PROFILE ---------------- */

  const fetchMyPosts = async () => {
    if (!user) return
  
    const data = await getMyPosts(user.id)
    setPosts(data)
    setPostsLoading(false)
  }


  const fetchProfile = async () => {
    if (!user) {
      setError("Not authenticated")
      return
    }

    const { data, error } = await supabase
      .from("users")
      .select("name, email, bio")
      .eq("id", user.id)
      .single()

    if (error) {
      setError(error.message)
      return
    }

    setProfile({
      name: data.name ?? "",
      email: data.email ?? user.email ?? "",
      bio: data.bio ?? "",
    })

    // preload edit fields
    setEditName(data.name ?? "")
    setEditBio(data.bio ?? "")
  }

  /* ---------------- LOAD ON AUTH ---------------- */

  useEffect(() => {
    if (!user) return
    fetchProfile()
    fetchMyPosts()
  }, [user])

  /* ---------------- UPDATE PROFILE ---------------- */

  const updateProfile = async () => {
    if (!user) return

    setSaving(true)

    const { error } = await supabase
      .from("users")
      .update({
        name: editName,
        bio: editBio,
      })
      .eq("id", user.id)

    if (!error) {
      await fetchProfile()
    }

    setSaving(false)
  }

  /* ---------------- SIGN OUT ---------------- */

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/sign-in")
  }

  /* ---------------- UI STATES ---------------- */

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>
  }

  if (!profile) {
    return <p className="p-6">Loading…</p>
  }

return (
  <div className="max-w-screen-xl mx-auto p-4 space-y-10">
    {/* ---------- PROFILE HEADER ---------- */}
    <h1 className={`${playfair.className} text-5xl`}>Profile</h1>

    {/* ---------- PROFILE CARD ---------- */}
    <div className="w-[320px] max-w-full">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {profile.name || "Unnamed user"}
          </CardTitle>
          <CardDescription>{profile.email}</CardDescription>
  
          <CardAction>
            <Avatar>
              <AvatarFallback
                className={`${getAvatarColor(profile.name)} text-white font-bold`}
              >
                {getInitial(profile.name)}
              </AvatarFallback>
            </Avatar>
          </CardAction>
        </CardHeader>
  
        <CardContent className="text-sm text-muted-foreground break-lines whitespace-pre-line">
          {profile.bio || "No bio yet."}
        </CardContent>
  
        <CardFooter>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* EDIT PROFILE */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <PencilLine />
                </Button>
              </SheetTrigger>
  
              <SheetContent className="p-3">
                <SheetHeader>
                  <SheetTitle>Edit Profile</SheetTitle>
                </SheetHeader>
  
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
  
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell something about yourself"
                    />
                  </div>
  
                  <Button onClick={updateProfile} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
  
            <Button variant="destructive" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>

    {/* ---------- MY POSTS ---------- */}
    <section className="space-y-4">
      <h2 className={`${playfair.className} text-3xl font-semibold`}>My Posts</h2>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">
          You haven’t posted anything yet.
        </p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <Card key={post.id} className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {post.title}
                </CardTitle>
                <CardDescription>
                  {new Date(post.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <CardContent className="break-words whitespace-pre-wrap">
                {post.content}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  </div>
)
}

export default Page
