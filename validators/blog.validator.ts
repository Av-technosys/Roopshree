export type BlogPayload = {
  title: string
  metaDescription?: string
  blogCategory?: string
  date?: string
  data?: string
  content?: string
  image?: string
  imageKey?: string
  userName?: string
  tags?: string[] | string
}

export function validateBlogPayload(payload: unknown): BlogPayload {
  const data = payload as Partial<BlogPayload>
  const title = data.title?.trim()

  if (!title) {
    throw new Error('Blog title is required')
  }

  return {
    title,
    metaDescription: data.metaDescription,
    blogCategory: data.blogCategory,
    date: data.date,
    data: data.data,
    content: data.content,
    image: data.image,
    imageKey: data.imageKey,
    userName: data.userName,
    tags: data.tags,
  }
}
