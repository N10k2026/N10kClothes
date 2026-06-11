import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { transformProduct } from '@/lib/product-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } }, colors: true, sizes: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(transformProduct(product));
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
