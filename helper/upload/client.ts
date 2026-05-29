"use client";

import { useState } from "react";
import { createImageUploadAction } from "@/actions/upload.action";

type UploadResponse = {
  uploadUrl: string;
  key: string;
  previewUrl: string;
  error?: never;
};

type UploadErrorResponse = {
  error: string;
};

type UploadFolder = "products" | "categories" | "banners" | "users" | "reviews";

const folderAliases: Record<string, UploadFolder> = {
  product: "products",
  products: "products",
  category: "categories",
  categories: "categories",
  blog: "banners",
  blogs: "banners",
  banner: "banners",
  banners: "banners",
  user: "users",
  users: "users",
  review: "reviews",
  reviews: "reviews",
};

function normalizeFolder(folder: string): UploadFolder {
  return folderAliases[folder] ?? "products";
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File, folder = "products") {
    setUploading(true);

    try {
      const data = (await createImageUploadAction({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        folder: normalizeFolder(folder),
      })) as UploadResponse | UploadErrorResponse;

      if ("error" in data) {
        throw new Error(data.error);
      }

      if (!data.uploadUrl || !data.key || !data.previewUrl) {
        throw new Error("Failed to create upload URL");
      }

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      return {
        fileKey: data.key,
        fileUrl: data.previewUrl,
      };
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading };
}
