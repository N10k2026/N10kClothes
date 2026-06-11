import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ==================== PRODUCTS - LÍNEA CABALLERO ====================
  const productsData = [
    {
      name: 'Hoodie BOLD',
      slug: 'hoodie-bold',
      category: 'Hoodies',
      price: 50,
      image: '/products/hoddie-vinotinto.webp',
      description: 'Hoodie oversize para caballero que no pide permiso. Algodón premium 80/20 con forro polar, logo N10K bordado y actitud que se siente. 4 colores, cero miedo.',
      isNew: true,
      isBestSeller: true,
      sortOrder: 2,
      images: {
        create: [
          { url: '/products/hoddie-vinotinto.webp', colorName: 'Vinotinto', sortOrder: 1 },
          { url: '/products/hoddie-vinotinto-2.webp', colorName: 'Vinotinto', sortOrder: 2 },
          { url: '/products/modelo-vinotinto-2.webp', colorName: 'Vinotinto', sortOrder: 3 },
          { url: '/products/modelo-vinotinto-3.webp', colorName: 'Vinotinto', sortOrder: 4 },
          { url: '/products/modelo-vinotinto-4.webp', colorName: 'Vinotinto', sortOrder: 5 },
          { url: '/products/hoddie-negro.webp', colorName: 'Negro', sortOrder: 1 },
          { url: '/products/hoddie-negro-2.webp', colorName: 'Negro', sortOrder: 2 },
          { url: '/products/modelo-negro-2.webp', colorName: 'Negro', sortOrder: 3 },
          { url: '/products/hoddie-marron.webp', colorName: 'Marrón', sortOrder: 1 },
          { url: '/products/hoddie-marron-2.webp', colorName: 'Marrón', sortOrder: 2 },
          { url: '/products/hoddie-blanco.webp', colorName: 'Blanco', sortOrder: 1 },
          { url: '/products/hoddie-blanco-2.webp', colorName: 'Blanco', sortOrder: 2 },
        ]
      },
      colors: {
        create: [
          { name: 'Vinotinto', hex: '#722F37' },
          { name: 'Negro', hex: '#0A0A0A' },
          { name: 'Marrón', hex: '#5C3A21' },
          { name: 'Blanco', hex: '#FFFFFF' },
        ]
      },
      sizes: {
        create: [
          { label: 'S' }, { label: 'M' }, { label: 'L' }, { label: 'XL' },
        ]
      },
    },
    {
      name: 'Sweater AFTER DARK',
      slug: 'sweater-after-dark',
      category: 'Suéters',
      price: 40,
      image: '/products/sueter-negro.webp',
      description: 'Suéter cuello redondo para caballero, corte relajado y presencia que no pasa desapercibida. Algodón suave con logo N10K bordado. Hecho para los que brillan de noche.',
      isNew: true,
      isBestSeller: true,
      sortOrder: 3,
      images: {
        create: [
          { url: '/products/sueter-negro.webp', colorName: 'Negro', sortOrder: 1 },
          { url: '/products/sueter-negro-2.webp', colorName: 'Negro', sortOrder: 2 },
          { url: '/products/sueter-rosa.webp', colorName: 'Rosa', sortOrder: 1 },
          { url: '/products/sueter-rosa-03.webp', colorName: 'Rosa', sortOrder: 2 },
          { url: '/products/sueter-blanco.webp', colorName: 'Blanco', sortOrder: 1 },
          { url: '/products/sueter-blanco-2.webp', colorName: 'Blanco', sortOrder: 2 },
        ]
      },
      colors: {
        create: [
          { name: 'Negro', hex: '#0A0A0A' },
          { name: 'Rosa', hex: '#E8A0B4' },
          { name: 'Blanco', hex: '#FFFFFF' },
        ]
      },
      sizes: {
        create: [
          { label: 'S' }, { label: 'M' }, { label: 'L' }, { label: 'XL' },
        ]
      },
    },
    {
      name: 'Sweater PEARL | Exclusive Drop',
      slug: 'sweater-pearl-exclusive-drop',
      category: 'Suéters',
      price: 40,
      image: '/products/sueter-perla.webp',
      description: 'Edición limitada para caballero. Un tono perla que rompe el molde, algodón premium y logo N10K bordado. Para los que saben que lo exclusivo no se repite.',
      isNew: true,
      isBestSeller: false,
      sortOrder: 4,
      images: {
        create: [
          { url: '/products/sueter-perla.webp', colorName: 'Perla', sortOrder: 1 },
          { url: '/products/sueter-perla-2.webp', colorName: 'Perla', sortOrder: 2 },
        ]
      },
      colors: {
        create: [
          { name: 'Perla', hex: '#D4C5A9' },
        ]
      },
      sizes: {
        create: [
          { label: 'S' }, { label: 'M' }, { label: 'L' }, { label: 'XL' },
        ]
      },
    },
    {
      name: 'Tee LIMITLESS',
      slug: 'tee-limitless',
      category: 'Franelas',
      price: 35,
      image: '/products/tee-negro.webp',
      description: 'Franela oversize para caballero con estampado N10K. Algodón peinado 100% para los que usan las calles como pasarela. Sin límites, sin reglas.',
      isNew: false,
      isBestSeller: true,
      sortOrder: 5,
      images: {
        create: [
          { url: '/products/tee-negro.webp', colorName: 'Negro', sortOrder: 1 },
          { url: '/products/tee-blanco.webp', colorName: 'Blanco', sortOrder: 1 },
        ]
      },
      colors: {
        create: [
          { name: 'Negro', hex: '#0A0A0A' },
          { name: 'Blanco', hex: '#FFFFFF' },
        ]
      },
      sizes: {
        create: [
          { label: 'S' }, { label: 'M' }, { label: 'L' }, { label: 'XL' },
        ]
      },
    },
    {
      name: 'Tank FEARLESS',
      slug: 'tank-fearless',
      category: 'Franelas',
      price: 25,
      image: '/products/tank-negro.webp',
      description: 'Franelilla para caballero con actitud. Tela suave y stretch, sin disculpas. Muestra lo que quieres, esconde lo que te da la gana.',
      isNew: false,
      isBestSeller: false,
      sortOrder: 6,
      images: {
        create: [
          { url: '/products/tank-negro.webp', colorName: 'Negro', sortOrder: 1 },
          { url: '/products/tank-rojo.webp', colorName: 'Rojo', sortOrder: 1 },
        ]
      },
      colors: {
        create: [
          { name: 'Negro', hex: '#0A0A0A' },
          { name: 'Rojo', hex: '#E31E24' },
        ]
      },
      sizes: {
        create: [
          { label: 'S' }, { label: 'M' }, { label: 'L' }, { label: 'XL' },
        ]
      },
    },

    {
      name: 'Shorts BREEZE',
      slug: 'shorts-breeze',
      category: 'Shorts',
      price: 40,
      image: '/products/shorts-breeze/aguamarina-1.webp',
      description: 'Shorts deportivos para caballero con logo N10K "LIVE LIMITLESS". Tela suave y ligera con cintura elástica y cordón ajustable. Disponible en 7 colores — frescura y actitud sin límites.',
      isNew: true,
      isBestSeller: true,
      sortOrder: 1,
      images: {
        create: [
          { url: '/products/shorts-breeze/aguamarina-1.webp', colorName: 'Aguamarina', sortOrder: 1 },
          { url: '/products/shorts-breeze/aguamarina-2.webp', colorName: 'Aguamarina', sortOrder: 2 },
          { url: '/products/shorts-breeze/aguamarina-3.webp', colorName: 'Aguamarina', sortOrder: 3 },
          { url: '/products/shorts-breeze/aguamarina-detalle-1.webp', colorName: 'Aguamarina', sortOrder: 4 },
          { url: '/products/shorts-breeze/blanco-1.webp', colorName: 'Blanco', sortOrder: 1 },
          { url: '/products/shorts-breeze/blanco-2.webp', colorName: 'Blanco', sortOrder: 2 },
          { url: '/products/shorts-breeze/blanco-3.webp', colorName: 'Blanco', sortOrder: 3 },
          { url: '/products/shorts-breeze/verde-1.webp', colorName: 'Verde', sortOrder: 1 },
          { url: '/products/shorts-breeze/verde-2.webp', colorName: 'Verde', sortOrder: 2 },
          { url: '/products/shorts-breeze/verde-3.webp', colorName: 'Verde', sortOrder: 3 },
          { url: '/products/shorts-breeze/negro-1.webp', colorName: 'Negro', sortOrder: 1 },
          { url: '/products/shorts-breeze/negro-2.webp', colorName: 'Negro', sortOrder: 2 },
          { url: '/products/shorts-breeze/negro-3.webp', colorName: 'Negro', sortOrder: 3 },
          { url: '/products/shorts-breeze/amarillo-1.webp', colorName: 'Amarillo', sortOrder: 1 },
          { url: '/products/shorts-breeze/amarillo-2.webp', colorName: 'Amarillo', sortOrder: 2 },
          { url: '/products/shorts-breeze/amarillo-3.webp', colorName: 'Amarillo', sortOrder: 3 },
          { url: '/products/shorts-breeze/amarillo-detalle.webp', colorName: 'Amarillo', sortOrder: 4 },
          { url: '/products/shorts-breeze/azul-oscuro-1.webp', colorName: 'Azul Oscuro', sortOrder: 1 },
          { url: '/products/shorts-breeze/azul-oscuro-2.webp', colorName: 'Azul Oscuro', sortOrder: 2 },
          { url: '/products/shorts-breeze/azul-oscuro-3.webp', colorName: 'Azul Oscuro', sortOrder: 3 },
          { url: '/products/shorts-breeze/azul-oscuro-detalle.webp', colorName: 'Azul Oscuro', sortOrder: 4 },
          { url: '/products/shorts-breeze/azul-claro-1.webp', colorName: 'Azul Claro', sortOrder: 1 },
          { url: '/products/shorts-breeze/azul-claro-2.webp', colorName: 'Azul Claro', sortOrder: 2 },
          // Collage / general product images (no specific color)
          { url: '/products/shorts-breeze/collage-1.webp', colorName: null, sortOrder: 1 },
          { url: '/products/shorts-breeze/collage-2.webp', colorName: null, sortOrder: 2 },
        ]
      },
      colors: {
        create: [
          { name: 'Aguamarina', hex: '#84C5C1' },
          { name: 'Blanco', hex: '#FFFFFF' },
          { name: 'Verde', hex: '#2D5A27' },
          { name: 'Negro', hex: '#0A0A0A' },
          { name: 'Amarillo', hex: '#E8C840' },
          { name: 'Azul Oscuro', hex: '#1A2744' },
          { name: 'Azul Claro', hex: '#5B9BD5' },
        ]
      },
      sizes: {
        create: [
          { label: 'S' }, { label: 'M' }, { label: 'L' }, { label: 'XL' },
        ]
      },
    },
  ];

  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: productData,
    });
    console.log(`Created product: ${product.name}`);
  }

  // ==================== ADMIN USER ====================
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin N10K',
      email: 'admin@n10k.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  console.log('\nSeeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
