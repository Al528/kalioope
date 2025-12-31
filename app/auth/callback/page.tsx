// app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const syncProfile = async () => {
      // ensure session exists
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.replace("/sign-in")
        return
      }

      const user = session.user
      const meta = user.user_metadata

      const displayName =
        meta.name ??
        meta.user_name ??
        meta.preferred_username ??
        user.email?.split("@")[0] ??
        "Anonymous"

      const { error } = await supabase.from("users").upsert({
        id: user.id,
        name: displayName,
        email: user.email,
        bio: null,
      })

      if (error) {
        console.error("PROFILE UPSERT ERROR:", error)
      }

      router.replace("/")
    }

    syncProfile()
  }, [router])

  return <p>Signing you in…</p>
}

