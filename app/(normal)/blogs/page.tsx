import { BlogListingPage } from "@/components/blog/BlogListingPage"
import { getBlogCategories, getBlogs } from "@/services/blog.service"

async function Blogs({
  searchParams,
}: {
  searchParams?: Promise<{
    category?: string
    search?: string
  }>
}) {
  const params = await searchParams
  const [posts, categories] = await Promise.all([
    getBlogs({
      categorySlug: params?.category,
      search: params?.search,
    }),
    getBlogCategories(),
  ])

  return (
    <BlogListingPage
      posts={posts}
      categories={categories}
      activeCategory={params?.category}
      search={params?.search}
    />
  )
}

export default Blogs
