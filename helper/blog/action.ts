"use server";

import { revalidatePath } from "next/cache";
import {
  createBlogService,
  deleteBlogService,
  getBlogByIdService,
  getBlogsService,
  updateBlogService,
  getBlogCategories as getBlogCategoriesService,
} from "@/services/blog.service";
import { validateBlogPayload } from "@/validators/blog.validator";

export async function getBlogCategories() {
  return getBlogCategoriesService();
}

export async function getBlogs() {
  return getBlogsService();
}

export async function getBlogById(id: string) {
  return getBlogByIdService(id);
}

export async function createBlog(payload: unknown) {
  try {
    await createBlogService(validateBlogPayload(payload));

    revalidatePath("/admin/blog");
    return { success: true, message: "Blog created successfully" };
  } catch (error) {
    console.error("Create blog failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create blog",
    };
  }
}

export async function updateBlog(id: string, payload: unknown) {
  try {
    await updateBlogService(id, validateBlogPayload(payload));

    revalidatePath("/admin/blog");
    return { success: true, message: "Blog updated successfully" };
  } catch (error) {
    console.error("Update blog failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update blog",
    };
  }
}

export async function deleteBlog(id: string) {
  try {
    await deleteBlogService(id);
    revalidatePath("/admin/blog");

    return { success: true, message: "Blog deleted successfully" };
  } catch (error) {
    console.error("Delete blog failed:", error);
    return { success: false, message: "Failed to delete blog" };
  }
}
