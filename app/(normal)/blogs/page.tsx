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
  openGraph: {
    title: "Roopshree Blog - Bandhej Stories, Styling & Maintenance Tips",
    description: "Explore Roopshree's blog for Bandhej craftsmanship stories, saree & dupatta styling tips, fabric care guides, and cultural insights from the heart of Rajasthan.",
    url: "https://roopshree-one.vercel.app/blogs",
    type: "website",
    images: [{ url: "https://roopshree-one.vercel.app/blog/blog-bg.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roopshree Blog - Bandhej Stories, Styling & Maintenance Tips",
    description: "Explore Roopshree's blog for Bandhej craftsmanship stories, saree & dupatta styling tips, fabric care guides, and cultural insights from the heart of Rajasthan.",
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
