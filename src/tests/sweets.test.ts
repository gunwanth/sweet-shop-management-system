import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

let token: string;

beforeAll(async () => {
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();
  const hash = await bcrypt.hash('adminpass', 10);
  const admin = await prisma.user.create({ data: { email: 'admin@test.com', password: hash, role: 'admin' }});
  token = jwt.sign({ sub: admin.id, role: admin.role, email: admin.email }, JWT_SECRET);
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Sweets', () => {
  it('creates and lists sweets', async () => {
    const create = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Gulab Jamun', category: 'Indian', price: 1.5, quantity: 10 });
    expect(create.status).toBe(201);
    const res = await request(app).get('/api/sweets').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('purchases a sweet', async () => {
    const list = await request(app).get('/api/sweets').set('Authorization', `Bearer ${token}`);
    const id = list.body[0].id;
    const buy = await request(app).post(`/api/sweets/${id}/purchase`).set('Authorization', `Bearer ${token}`).send({ quantity: 2 });
    expect(buy.status).toBe(200);
    expect(buy.body.quantity).toBe(8);
  });
});
