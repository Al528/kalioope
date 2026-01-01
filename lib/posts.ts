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

/* ------------------ TYPES ------------------ */
export type BasePost = {
  id: string
  title: string
  content: string | null
  created_at: string
  author: {
    name: string | null
  } | null
}

export type LatestPost = BasePost & {
  likes: { count: number }[]
  user_like: { user_id: string }[]
}

/* ------------------ HELPERS ------------------ */
const normalizeAuthor = (author: any) =>
  Array.isArray(author) ? author[0] ?? null : author ?? null

/* ------------------ READ (LATEST POST) ------------------ */
export const getLatestPost = async (): Promise<LatestPost | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      author:users (
        name
      ),
      likes:likes(count),
      user_like:likes!left(user_id)
    `)
    .eq("user_like.user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    ...data,
    author: normalizeAuthor(data.author),
    likes: data.likes ?? [],
    user_like: data.user_like ?? [],
  }
}

/* ------------------ FEED ------------------ */
export const getFeedPosts = async (): Promise<LatestPost[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      author:users (
        name
      ),
      likes:likes(count),
      user_like:likes!left(user_id)
    `)
    .eq("user_like.user_id", user?.id ?? "")
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!data) return []

  return data.map((post) => ({
    ...post,
    author: normalizeAuthor(post.author),
    likes: post.likes ?? [],
    user_like: post.user_like ?? [],
  }))
}

/* ------------------ MY POSTS (NO LIKES) ------------------ */
export const getMyPosts = async (userId: string): Promise<BasePost[]> => {
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
    author: normalizeAuthor(post.author),
  }))
}
/* ------------------ EXPLORE (SEARCH WITH LIKES) ------------------ */
export const searchPosts = async (
  query: string
): Promise<LatestPost[]> => {
  if (!query) return []

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      created_at,
      author:users (
        name
      ),
      likes:likes(count),
      user_like:likes!left(user_id)
    `)
    .eq("user_like.user_id", user?.id ?? "")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  if (!data) return []

  return data.map((post) => ({
    ...post,
    author: Array.isArray(post.author)
      ? post.author[0] ?? null
      : post.author ?? null,
    likes: post.likes ?? [],
    user_like: post.user_like ?? [],
  }))
}

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
  await getUser()

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
