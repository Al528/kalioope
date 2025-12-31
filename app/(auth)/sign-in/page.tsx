"use client"

import { playfair } from "@/fonts"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
const Page = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signInWithPassword = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  
    if (error) {
      alert(error.message)
      return
    }
  
    router.push("/")
  }

const signInWithGithub = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    alert(error.message)
  }
}


  return (
    <div>
      <FieldSet className="w-80">
        <FieldLegend className={`${playfair.className}`}>Sign in to Kalioope</FieldLegend>
        <FieldDescription>Fill in the field below to sign in.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Button onClick={signInWithPassword}>Sign in</Button>
            <Button variant="outline" onClick={signInWithGithub}>
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48
                0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46
                -.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83
                .09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95
                0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65
                0 0 .84-.27 2.75 1.03.8-.22 1.65-.33 2.5-.34.85.01 1.7.12 2.5.34
                1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65
                .64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95
                .36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75
                0 .26.18.58.69.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </Button>
            <FieldLabel htmlFor="sign up">
              <Link href="/sign-up" className="text-purple-500 hover:underline">Sign up</Link>
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

export default Page