import { registerUser, loginUser, getMe } from '../auth.service';
import prisma from '../../lib/prisma';
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import bcrypt from 'bcryptjs';

describe ('Auth Service', () => {
    beforeEach(async () => {
        await prisma.comment.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.user.deleteMany();
    });

    describe('register user', () => {
        it('should create user and return token', async () => {
            const result = await registerUser(
              'Test User',        // name
              'test@example.com', // email
              'password123'       // password
            );

            expect(result.user.name).toBe('Test User');
            expect(result.user).not.toHaveProperty('password');
            expect(result.token).toBeDefined();
        });

        it('should throw on duplicate email', async () => {
            await registerUser(
              'Test User',        // name
              'test@example.com', // email
              'password123'       // password
            );

            await expect(registerUser(
              'Another User',     // name
              'test@example.com', // email
              'password456'       // password
            )).rejects.toThrow();
        });
    });

    describe('login user', () => {
      it('should login user and return token', async () => {
        await prisma.user.create({
          data: {
            name: 'Existing User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
          }
        });

        const result = await loginUser('test@example.com', 'password123');
        expect(result.token).toBeDefined();
      });
    });

    describe('getMe', () => {
      it('should return user info without password', async () => {
        const user = await prisma.user.create({
          data: {
            name: 'Existing User',
            email: 'test.example.com',
            password: await bcrypt.hash('password123', 10)
          }
        });
        
        const result = await getMe(user.id);
        expect(result.name).toBe('Existing User');
        expect(result).not.toHaveProperty('password');
      });
    });
  
    afterAll(async () => {
        await prisma.$disconnect();
    });
});
