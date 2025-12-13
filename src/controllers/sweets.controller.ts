import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ----------------------------
// LIST ALL SWEETS
// ----------------------------
export async function listSweets(req: Request, res: Response) {
  const sweets = await prisma.sweet.findMany();
  res.json(sweets);
}

// ----------------------------
// SEARCH SWEETS
// ----------------------------
export async function searchSweets(req: Request, res: Response) {
  const { name, category, minPrice, maxPrice } = req.query as any;

  const where: any = {};

  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (category) where.category = { contains: category, mode: 'insensitive' };

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  const sweets = await prisma.sweet.findMany({ where });
  res.json(sweets);
}

// ----------------------------
// CREATE SWEET
// ----------------------------
export async function createSweet(req: Request, res: Response) {
  const { name, category, price, quantity } = req.body;

  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ error: "Missing fields. Name, category, price, quantity are required." });
  }

  const sweet = await prisma.sweet.create({
    data: {
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10)
    }
  });

  return res.status(201).json(sweet);
}

// ----------------------------
// UPDATE SWEET (Optional)
// ----------------------------
export async function updateSweet(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;

  const updated = await prisma.sweet.update({
    where: { id },
    data
  });

  res.json(updated);
}

// ----------------------------
// DELETE SWEET
// ----------------------------
export async function deleteSweet(req: Request, res: Response) {
  const { id } = req.params;

  await prisma.sweet.delete({ where: { id } });
  res.json({ ok: true });
}

// ----------------------------
// PURCHASE SWEET
// ----------------------------
export async function purchaseSweet(req: Request, res: Response) {
  const { id } = req.params;
  const { quantity = 1 } = req.body;

  const sweet = await prisma.sweet.findUnique({ where: { id } });

  if (!sweet) return res.status(404).json({ error: "Sweet not found" });

  if (sweet.quantity < quantity) {
    return res.status(400).json({ error: "Insufficient stock" });
  }

  const updated = await prisma.sweet.update({
    where: { id },
    data: { quantity: sweet.quantity - quantity }
  });

  return res.json(updated);
}

// ----------------------------
// RESTOCK SWEET
// ----------------------------
export async function restockSweet(req: Request, res: Response) {
  const { id } = req.params;
  const { quantity = 1 } = req.body;

  const sweet = await prisma.sweet.findUnique({ where: { id } });

  if (!sweet) return res.status(404).json({ error: "Sweet not found" });

  const updated = await prisma.sweet.update({
    where: { id },
    data: { quantity: sweet.quantity + quantity }
  });

  return res.json(updated);
}
