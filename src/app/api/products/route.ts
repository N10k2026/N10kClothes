import { NextRequest, NextResponse } from 'next/server';
import { staticProducts } from '@/lib/static-products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isNew = searchParams.get('new');

    let filtered = staticProducts;

    if (category && category !== 'Todos') {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (isNew === 'true') {
      filtered = filtered.filter((p) => p.isNew);
    }

    // Sort by implicit order (as defined in the array)
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
