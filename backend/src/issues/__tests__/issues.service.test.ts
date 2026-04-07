import { 
  createIssue, 
  getIssueById, 
  getIssueByUserId, 
  deleteIssue, 
  updateIssue, 
  updateIssueStatus, 
  queryIssuesList 
} from '../issues.service';
import prisma from '../../lib/prisma';
import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import bcrypt from 'bcryptjs';
import { IssueStatus, Priority } from '../../generated/prisma';

describe('Issues Service', () => {
  beforeEach(async () => {
    // 테스트용 데이터 초기화
    await prisma.comment.deleteMany();
    await prisma.issue.deleteMany();
    await prisma.user.deleteMany();

    // 테스트용 사용자 생성
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        avatar: null,
      },
    });
  });

  // createIssue 테스트 추가
  describe('create issue', () => {
    it('should create an issue and return it', async () => {
      const user = await prisma.user.findUnique({ 
        where: { email: 'test@example.com' } 
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      const issue = await createIssue(issueData);
      expect(issue).toHaveProperty('id');
      expect(issue.title).toBe(issueData.title);
      expect(issue.description).toBe(issueData.description);
      expect(issue.creatorId).toBe(issueData.creatorId);
      expect(issue.priority).toBe(issueData.priority);
    });
  });

  describe('create issue unvalid user', () => {
    it('should throw an error when given an invalid user id', async () => {
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: 9999, // 존재하지 않는 사용자 ID
        priority: Priority.MEDIUM
      };

      await expect(createIssue(issueData)).rejects.toThrow();
    });
  });

  // getIssueById, getIssueByUserId 테스트 추가
  describe('get issue by id', () => {
    it('should return an issue when given a valid id', async () => {
      const user = await prisma.user.findUnique({ 
        where: { email: 'test@example.com' } 
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      const createdIssue = await createIssue(issueData);
      const issue = await getIssueById(createdIssue.id);
      expect(issue).not.toBeNull();
      expect(issue).toHaveProperty('id');
      expect(issue!.title).toBe(issueData.title);
    });
  });

  describe('get issue by invalid id', () => {
    it('should return null when given an invalid id', async () => {
      const issue = await getIssueById(9999); // 존재하지 않는 이슈 ID
      expect(issue).toBeNull();
    });
  });

  describe('get issues by user id', () => {
    it('should return a list of issues created or assigned to the user', async () => {
      const user = await prisma.user.findUnique({ 
        where: { email: 'test@example.com' } 
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      await createIssue(issueData);
      const issues = await getIssueByUserId(user!.id);
      expect(issues).toHaveLength(1);
    });
  });

  // deleteIssue 테스트 추가
  describe('delete issue', () => {
    it('should delete an issue when given a valid id', async () => {
      const user = await prisma.user.findUnique({ 
        where: { email: 'test@example.com' } 
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      const createdIssue = await createIssue(issueData);

      await deleteIssue(createdIssue.id);
      const deletedIssue = await getIssueById(createdIssue.id);
      expect(deletedIssue).toBeNull();
    });
  });

  describe('delete issue with invalid id', () => {
    it('should throw an error when given an invalid id', async () => {
      await expect(deleteIssue(9999)).rejects.toThrow(); // 존재하지 않는 이슈 ID
    });
  });

  // updateIssue, updateIssueStatus 테스트 추가
  describe('update issue', () => {
    it('should update an issue when given a valid id and data', async () => {
      const user = await prisma.user.findUnique({ 
        where: { email: 'test@example.com' } 
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      const createdIssue = await createIssue(issueData);
      const updatedData = {
        title: 'Updated Test Issue',
        description: 'This is an updated test issue',
        priority: Priority.HIGH
      };

      const updatedIssue = await updateIssue(createdIssue.id, updatedData);
      expect(updatedIssue.title).toBe(updatedData.title);
      expect(updatedIssue.description).toBe(updatedData.description);
      expect(updatedIssue.priority).toBe(updatedData.priority);
    });
  });

  describe('update issue with invalid id', () => {
    it('should throw an error when given an invalid id', async () => {
      const updatedData = {
        title: 'Updated Test Issue',
        description: 'This is an updated test issue',
        priority: Priority.HIGH
      };

      await expect(updateIssue(9999, updatedData)).rejects.toThrow(); // 존재하지 않는 이슈 ID
    });
  });

  describe('update issue status', () => {
    it('should update the status of an issue when given a valid id and status', async () => {
      const user = await prisma.user.findUnique({ 
        where: { email: 'test@example.com' } 
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      // BACKLOG -> TODO -> IN_PROGRESS -> IN_REVIEW -> DONE -> BACKLOG (순환)
      const createdIssue = await createIssue(issueData);
      const updatedIssue = await updateIssueStatus(createdIssue, 'TODO');
      expect(updatedIssue.status).toBe('TODO');
    });
  });

  describe('update issue status with invalid status', () => {
    it('should throw an error when given an invalid status', async () => {
      const user = await prisma.user.findUnique({ 
        where: { email: 'test@example.com' }
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      const createdIssue = await createIssue(issueData);
      // @ts-expect-error - 존재하지 않는 상태 전달
      await expect(updateIssueStatus(createdIssue.id, 'INVALID_STATUS')).rejects.toThrow();   // 유효하지 않은 상태
      // TODO: Testing Failed
      await expect(updateIssueStatus(createdIssue, 'DONE')).rejects.toThrow();             // 상태 전환 규칙 위반 (예: BACKLOG -> DONE)
    });
  });

  // queryIssuesList 테스트 추가
  describe('query issues list', () => {
    it('should return a paginated list of issues based on filters', async () => {
      const user = await prisma.user.findUnique({ 
        where: { email: 'test@example.com' } 
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      await createIssue(issueData);
      const filters = { status: IssueStatus.BACKLOG, priority: Priority.MEDIUM, page: 1, limit: 10 };
      const result = await queryIssuesList(user!.id, filters);
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('pagination');
      expect(result.issues).toHaveLength(1);
    });

    it('should throw when page exceeds total pages', async () => {
      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });
      const issueData = {
        title: 'Test Issue',
        description: 'This is a test issue',
        creatorId: user!.id,
        priority: Priority.MEDIUM
      };

      await createIssue(issueData);
      // 페이지 번호가 총 페이지 수를 초과하는 경우 예외 발생

      await expect(queryIssuesList(user!.id, { page: 9999, limit: 10 })).rejects.toThrow();
      await expect(queryIssuesList(user!.id, { page: 0, limit: 10 })).rejects.toThrow();     
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});