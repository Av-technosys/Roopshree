import { BlogListingPage } from "@/components/blog/BlogListingPage";
import { getBlogCategories, getBlogs } from "@/services/blog.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roopshree Blog - Bandhej Stories, Styling & Maintenance Tips",
  description:
    "Explore Roopshree's blog for Bandhej craftsmanship stories, saree & dupatta styling tips, fabric care guides, and cultural insights from the heart of Rajasthan.",
  alternates: {
    canonical: "https://roopshreebandhej.com/blogs",
  },
};

async function Blogs({
  searchParams,
}: {
  searchParams?: Promise<{
    category?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const [posts, categories] = await Promise.all([
    getBlogs({
      categorySlug: params?.category,
      search: params?.search,
    }),
    getBlogCategories(),
  ]);

  return (
    <BlogListingPage
      posts={posts}
      categories={categories}
      activeCategory={params?.category}
      search={params?.search}
    />
  );
}

export default Blogs;
