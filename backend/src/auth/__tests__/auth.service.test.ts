import { registerUser, loginUser, getMe, updateProfile } from '../auth.service';
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

    describe('updateProfile', () => {
      it('should update name', async () => {
        const user = await prisma.user.create({
          data: {
            name: 'Old Name',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
          }
        });

        const result = await updateProfile(user.id, { name: 'New Name' });
        expect(result.name).toBe('New Name');
      });

      it('should update avatar', async () => {
        const user = await prisma.user.create({
          data: {
            name: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
          }
        });

        const result = await updateProfile(user.id, { avatar: 'https://example.com/avatar.jpg' });
        expect(result.avatar).toBe('https://example.com/avatar.jpg');
      });

      it('should update password and hash it', async () => {
        const user = await prisma.user.create({
          data: {
            name: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('oldpassword', 10)
          }
        });

        await updateProfile(user.id, { password: 'newpassword123' });

        const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
        const isMatch = await bcrypt.compare('newpassword123', updatedUser!.password);
        expect(isMatch).toBe(true);
      });

      it('should throw on duplicate email', async () => {
        const user1 = await prisma.user.create({
          data: {
            name: 'User One',
            email: 'user1@example.com',
            password: await bcrypt.hash('password123', 10)
          }
        });
        await prisma.user.create({
          data: {
            name: 'User Two',
            email: 'user2@example.com',
            password: await bcrypt.hash('password123', 10)
          }
        });

        await expect(updateProfile(user1.id, { email: 'user2@example.com' })).rejects.toThrow();
      });

      it('should allow updating to same email', async () => {
        const user = await prisma.user.create({
          data: {
            name: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
          }
        });

        const result = await updateProfile(user.id, { email: 'test@example.com' });
        expect(result.email).toBe('test@example.com');
      });

      it('should update multiple fields at once', async () => {
        const user = await prisma.user.create({
          data: {
            name: 'Old Name',
            email: 'old@example.com',
            password: await bcrypt.hash('oldpassword', 10),
            avatar: null
          }
        });

        const result = await updateProfile(user.id, {
          name: 'New Name',
          email: 'new@example.com',
          avatar: 'https://example.com/avatar.png'
        });

        expect(result.name).toBe('New Name');
        expect(result.email).toBe('new@example.com');
        expect(result.avatar).toBe('https://example.com/avatar.png');
      });
    });
  
    afterAll(async () => {
        await prisma.$disconnect();
    });
});
