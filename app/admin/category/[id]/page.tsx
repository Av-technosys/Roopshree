import EditCategory from "./editClient";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/db/schema/products";
import { getS3ObjectPreviewUrl } from "@/lib/s3";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const categoryInfo = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));

  const category = categoryInfo[0]
    ? {
        ...categoryInfo[0],
        bannerPreview: categoryInfo[0].bannerImage
          ? getS3ObjectPreviewUrl(categoryInfo[0].bannerImage)
          : null,
      }
    : null;

  if (!category) notFound();

  return (
    <>
      <EditCategory categoryInfo={category} />
    </>
  );
};

export default Page;
