import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json([]);
  }

  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: { include: { images: { orderBy: { sortOrder: 'asc' } }, colors: true, sizes: true } } },
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantity, color, size } = await request.json();

    const existing = await db.cartItem.findFirst({
      where: { userId: user.id, productId, color, size },
    });

    if (existing) {
      const updated = await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 1) },
      });
      return NextResponse.json(updated);
    }

    const item = await db.cartItem.create({
      data: { userId: user.id, productId, quantity: quantity || 1, color, size },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await db.cartItem.delete({ where: { id, userId: user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart delete error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, quantity } = await request.json();
    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id, userId: user.id } });
      return NextResponse.json({ success: true });
    }
    const updated = await db.cartItem.update({
      where: { id, userId: user.id },
      data: { quantity },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
