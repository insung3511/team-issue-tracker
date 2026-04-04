import { createComment, deleteComment, getCommentsByIssueId, updateComment } from '../comments.service';
import { createIssue } from '../../issues/issues.repository';
import prisma from '../../lib/prisma';
import { describe, it, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcryptjs';
import { Issue, User } from '../../generated/prisma';

describe('Comments Service', () => {
    let testUser: User;
    let testIssue: Issue;
    beforeEach(async () => {
        // 테스트용 데이터 초기화
        await prisma.comment.deleteMany();
        await prisma.issue.deleteMany();
        await prisma.user.deleteMany();


        // 테스트용 사용자 생성
        const hashedPassword = await bcrypt.hash('password123', 10);
        testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
            },
        });

        testIssue = await createIssue({
            title: 'Test Issue',
            description: 'This is a test issue',
            creatorId: testUser!.id,
            priority: 'MEDIUM'
        });
    });

    describe('create comment', () => {
        it('should create a comment and return it', async () => {
            const comment = await createComment(
              testIssue.id,
              testUser.id,
              'This is a test comment'
            );
            expect(comment).toHaveProperty('id');
            expect(comment).toHaveProperty('content', 'This is a test comment');
        });
    });

    describe('get comments by issue id', () => {
        it('should return comments for a given issue id', async () => {
            await createComment(testIssue.id, testUser.id, 'First comment');
            await createComment(testIssue.id, testUser.id, 'Second comment');

            const comments = await getCommentsByIssueId(testIssue.id);
            expect(comments.length).toBe(2);
            expect(comments[0]).toHaveProperty('content', 'First comment');
            expect(comments[1]).toHaveProperty('content', 'Second comment');
        });
    });
    
    describe('update comment', () => {
        it('should update the content of a comment', async () => {
            const comment = await createComment(testIssue.id, testUser.id, 'Original content');
            const updatedComment = await updateComment(comment.id, 'Updated content');
            expect(updatedComment).toHaveProperty('id', comment.id);
            expect(updatedComment).toHaveProperty('content', 'Updated content');
        });
    });

    describe('delete comment', () => {
        it('should delete a comment', async () => {
            const comment = await createComment(testIssue.id, testUser.id, 'Comment to be deleted');
            await deleteComment(comment.id);
            const deletedComment = await prisma.comment.findUnique({ where: { id: comment.id } });
            expect(deletedComment).toBeNull();
        });
    });
});