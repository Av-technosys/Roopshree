export type productType = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  basePrice: number;
  strikethroughPrice?: number | null;
  strikeThroughPrice?: number | null;
  status?: string;
  isFeatured?: boolean;
  bannerImage?: string | null;
  isInStock?: boolean;
  hasVarientBox?: boolean;
  brand?: string | null;
  highlights?: string[];
};

export type productAttributeType = {
  id: string;
  productId?: string;
  attribute?: string;
  name?: string;
  value: string;
};

export type productMediaType = {
  id?: string;
  productId?: string;
  mediaURL: string;
  mediaType: string;
  sortOrder?: number;
  isPrimary?: boolean;
};

export type productVarientType = {
  id: string;
  name?: string;
  description?: string;
  image?: string;
};
