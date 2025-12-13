// scripts/seedSweets.js
const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  const items = [
    { name: 'Gulab Jamun', category: 'Indian', price: 1.5, quantity: 20 },
    { name: 'Rasgulla', category: 'Indian', price: 1.2, quantity: 15 },
    { name: 'Chocolate Cake', category: 'Dessert', price: 4.0, quantity: 5 },
    { name: 'Donut', category: 'Bakery', price: 0.9, quantity: 50 },
  ];

  for (const it of items) {
    // find by name (works even if name is not declared unique)
    const existing = await prisma.sweet.findFirst({ where: { name: it.name } });
    if (existing) {
      await prisma.sweet.update({
        where: { id: existing.id },
        data: { category: it.category, price: it.price, quantity: it.quantity },
      });
      console.log('Updated:', it.name);
    } else {
      await prisma.sweet.create({ data: it });
      console.log('Created:', it.name);
    }
  }

  console.log('Seeding complete.');
  await prisma.$disconnect();
})();
