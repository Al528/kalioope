import { supabase } from "./supabase"

/* ------------------ AUTH ------------------ */
const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("User not authenticated")
  }

  return user
}

export type LatestPost = {
  id: string
  title: string
  content: string | null
  created_at: string
  author: {
    name: string | null
  } | null
}



/* ------------------ READ ------------------ */
export const getLatestPost = async (): Promise<LatestPost | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      author:users (
        name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  // 🔧 normalize author (array OR object → object)
  const author =
    Array.isArray(data.author) ? data.author[0] ?? null : data.author ?? null

  return {
    ...data,
    author,
  }
}

export const getMyPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      author:users (
        name
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!data) return []

  return data.map((post) => ({
    ...post,
    author: Array.isArray(post.author)
      ? post.author[0] ?? null
      : post.author ?? null,
  }))
}


/* ------------------ FEED ------------------ */
export const getFeedPosts = async (): Promise<LatestPost[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      author:users (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!data) return []

  return data.map((post) => ({
    ...post,
    author: Array.isArray(post.author)
      ? post.author[0] ?? null
      : post.author ?? null,
  }))
}

/* ------------------ EXPLORE (SEARCH) ------------------ */
export const searchPosts = async (
  query: string
): Promise<LatestPost[]> => {
  if (!query) return []

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      author:users (
        name
      )
    `)
    .or(
      `title.ilike.%${query}%,content.ilike.%${query}%`
    )
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  if (!data) return []

  return data.map((post) => ({
    ...post,
    author: Array.isArray(post.author)
      ? post.author[0] ?? null
      : post.author ?? null,
  }))
}


/* ------------------ CREATE ------------------ */
export const createPost = async (title: string, content: string) => {
  const user = await getUser()

  const { error } = await supabase.from("posts").insert({
    title,
    content,
    user_id: user.id,
  })

  if (error) throw error
}

/* ------------------ UPDATE ------------------ */
export const updatePost = async (
  postId: string,
  title: string,
  content: string
) => {
  await getUser() // ensures auth exists

  const { error } = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", postId)

  if (error) throw error
}

/* ------------------ DELETE ------------------ */
export const deletePost = async (postId: string) => {
  await getUser()

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)

  if (error) throw error
}
