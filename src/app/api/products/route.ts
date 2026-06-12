import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { transformProduct } from '@/lib/product-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isNew = searchParams.get('new');

    const where: Prisma.ProductWhereInput = {};
    if (category && category !== 'Todos') where.category = category;
    if (isNew === 'true') where.isNew = true;

    const products = await db.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: 'asc' } }, colors: true, sizes: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(products.map(transformProduct));
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
