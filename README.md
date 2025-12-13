## 🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built as part of the AI Kata assessment, providing inventory management, purchasing, authentication, and search capabilities using modern web technologies.

## 📌 Project Overview

The Sweet Shop Management System enables:

Admin users to add, delete, restock sweets

Customers to view, search, and purchase sweets

Automatic stock validation and purchase disabling

Secure authentication using JWT

Persistent storage using Prisma ORM with relational database

Clean separation of frontend and backend

The application follows RESTful API principles and is fully tested using Jest + Supertest.

## 🧱 Tech Stack
Backend

Node.js

Express.js

TypeScript

Prisma ORM

PostgreSQL / SQLite (configurable)

JWT Authentication

CORS Middleware

Jest & Supertest (Testing)

Frontend

React (Vite)

TypeScript

Axios

Component-based UI

Role-based views (Admin / Dashboard)

## ✨ Core Features
Admin Panel

Add new sweets with name, category, price, quantity

Delete sweets

Restock existing sweets

View real-time inventory updates

Dashboard (User View)

View all available sweets

Search sweets by:

Name

Category

Price range

Purchase sweets

Purchase button automatically disables when stock is 0

Authentication

Secure login & signup

JWT-based authorization

Protected admin routes

## 🔐 Implicit Constraints & Assumptions (Implicit Rules)

The system follows these implicit rules as per documentation and design intent:

Purchase is blocked automatically when stock is insufficient

Admin-only access is enforced for:

Adding sweets

Deleting sweets

Restocking inventory

API requests require valid JWT tokens where applicable

Search parameters are optional and composable

Database integrity is enforced via Prisma schema

CORS is enabled to allow frontend-backend communication in development

## 🧪 Testing

Unit and integration tests implemented using Jest

API testing performed with Supertest

All tests are passing ✅

Test coverage includes:

Authentication

Sweet creation

Listing sweets

Purchasing logic

Run tests using:

npm test

## 🗄️ Database & ORM

Prisma ORM is used for:

Schema definition

Database migrations

Type-safe queries

Supports scalable relational database design

Centralized Prisma client for consistency

Clean separation of controller and data layers

## 🌐 CORS Handling

Configured using cors middleware

Enables secure frontend-backend interaction

Supports token-based authorization headers

Prevents cross-origin request issues during development

## 👥 Authors & Contributions
👨‍💻 Primary Contributor

M. Gunvanth

Key Contributions:

✅ Prisma ORM setup and schema design

✅ Complete database integration

✅ API implementation for sweets & purchases

✅ CORS configuration and handling

✅ Authentication flow (JWT-based)

✅ Backend architecture & middleware integration

✅ Test configuration and resolution of TypeScript/Jest issues

## 📂 Project Structure (Backend)
src/
├── controllers/
├── routes/
├── middlewares/
├── tests/
├── app.ts
├── server.ts

## 🚀 How to Run
Backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

## Concurrently

npm start - runs backend and frontend simultaneously

📌 Status

✔ Backend Complete
✔ Frontend Complete
✔ Search Implemented
✔ Authentication Working
✔ Tests Passing