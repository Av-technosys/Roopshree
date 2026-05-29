const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 5 * 1024 * 1024;

type ValidateImageOptions = {
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  ratio?: number;
};

export function validateImage(
  file?: File | null,
  options: ValidateImageOptions = {},
) {
  if (!file) {
    return { success: false, message: "Please select an image" };
  }

  if (!validImageTypes.includes(file.type)) {
    return { success: false, message: "Only JPG, PNG and WEBP images are allowed" };
  }

  const maxSize = (options.maxSizeMB ?? 5) * 1024 * 1024;

  if (file.size > Math.min(maxImageSize, maxSize)) {
    return {
      success: false,
      message: `Image must be under ${options.maxSizeMB ?? 5}MB`,
    };
  }

  return { success: true, message: "Image is valid" };
}
