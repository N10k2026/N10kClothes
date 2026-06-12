type DbProductWithRelations = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  image: string;
  description: string;
  video: string | null;
  isNew: boolean;
  isBestSeller: boolean;
  images: { url: string; colorName: string | null; sortOrder: number }[];
  colors: { name: string; hex: string }[];
  sizes: { label: string }[];
};

export function transformProduct(dbProduct: DbProductWithRelations) {
  const images = dbProduct.images || [];
  const colors = dbProduct.colors || [];
  const sizes = dbProduct.sizes || [];

  // Group images by color
  const colorImages: Record<string, string[]> = {};
  for (const img of images) {
    if (img.colorName) {
      if (!colorImages[img.colorName]) colorImages[img.colorName] = [];
      colorImages[img.colorName].push(img.url);
    }
  }

  // All images (non-color-specific first, then color-specific)
  const allImages = [
    ...images.filter((i) => !i.colorName).map((i) => i.url),
    ...images.filter((i) => i.colorName).map((i) => i.url),
  ];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    price: dbProduct.price,
    originalPrice: dbProduct.originalPrice ?? undefined,
    image: dbProduct.image,
    images: allImages.length > 0 ? allImages : [dbProduct.image],
    colorImages: Object.keys(colorImages).length > 0 ? colorImages : undefined,
    sizes: sizes.map((s) => s.label),
    colors: colors.map((c) => ({ name: c.name, hex: c.hex })),
    description: dbProduct.description,
    isNew: dbProduct.isNew,
    isBestSeller: dbProduct.isBestSeller,
    video: dbProduct.video ?? undefined,
  };
}
