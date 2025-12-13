import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth', () => {
  it('registers a user and logs in', async () => {
    const email = 'test@example.com';
    const res = await request(app).post('/api/auth/register').send({ name: 'Tester', email, password: 'pass123' });
    expect(res.status).toBe(201);
    const login = await request(app).post('/api/auth/login').send({ email, password: 'pass123' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});
