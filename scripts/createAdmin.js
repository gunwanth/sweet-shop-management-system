// scripts/createAdmin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
(async () => {
  const prisma = new PrismaClient();
  const hash = await bcrypt.hash('adminpass', 10); // change password if you want
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { role: 'admin', password: hash, name: 'Admin' },
    create: { email: 'admin@example.com', password: hash, name: 'Admin', role: 'admin' },
  });
  console.log('Admin created or updated:', user.id, user.email);
  await prisma.$disconnect();
})();
