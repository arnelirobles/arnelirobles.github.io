---
layout: post
title: "Getting Started with rnxORM - A TypeScript ORM for React Native"
date: 2025-11-28
categories: [development, tutorial]
tags: [typescript, react-native, orm, postgresql]
author: Arnel I. Robles
excerpt: "Learn how to set up and use rnxORM, a lightweight TypeScript ORM designed for React Native applications with PostgreSQL support."
read_time: 5
---

# Introduction

`rnxORM` is a lightweight, type-safe ORM specifically designed for React Native applications connecting to PostgreSQL databases. In this tutorial, we'll explore how to get started with rnxORM in your React Native project.

## Why rnxORM?

Traditional ORMs like TypeORM or Sequelize can be heavy for mobile applications. rnxORM provides:

- **Lightweight**: Minimal bundle size impact
- **Type-safe**: Full TypeScript support
- **Schema evolution**: Automatic table updates
- **React Native optimized**: Built with mobile development in mind

## Installation

```bash
npm install rnxorm
```

## Basic Setup

First, define your entity:

```typescript
import { Entity, Column, PrimaryColumn } from 'rnxorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```

## Creating a Context

```typescript
import { createContext } from 'rnxorm';

const context = createContext({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password'
});
```

## Querying Data

```typescript
// Find all users
const users = await context.users.findAll();

// Find by ID
const user = await context.users.findById(1);

// Custom queries
const activeUsers = await context.users
  .where('isActive', true)
  .findAll();
```

## Conclusion

rnxORM simplifies database operations in React Native applications while maintaining type safety and performance. Check out the [GitHub repository](https://github.com/arnelirobles/rnxORM) for more examples and documentation.

Happy coding! 🚀
