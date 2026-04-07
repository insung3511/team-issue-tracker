import {
  getIssueStatsOverview,
  getIssueStatsByAssignee,
  getIssueStatsByPriority
} from "../stats.service";
import { createIssue } from "../../issues/issues.repository";
import prisma from "../../lib/prisma";
import { describe, it, expect, beforeEach, afterAll } from "@jest/globals";
import { Issue, User } from "../../generated/prisma";

describe("Stats Service", () => {
  let testUser: User;
  let testIssue: Issue;

  beforeEach(async () => {
    // 테스트용 데이터 초기화
    await prisma.comment.deleteMany();
    await prisma.issue.deleteMany();
    await prisma.user.deleteMany();

    // 테스트용 사용자 생성
    testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        avatar: null,
      },
    });

    // 테스트용 이슈 생성
    testIssue = await createIssue({
      title: "Test Issue",
      description: "This is a test issue",
      creatorId: testUser.id,
      priority: "MEDIUM",
    });
  });

  // return type이 Record<string, number>이므로 Array.isArray(stats)로 검사할 수 없음. 수정 필요
  describe("get issue stats overview", () => {
    it("should return issue stats overview", async () => {
      const stats = await getIssueStatsOverview();
      // TODO: Testing failed
      // Expected: ArrayContaining ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]
      // Received: ["BACKLOG"]
      expect(Object.keys(stats)).toEqual(expect.arrayContaining([
        "BACKLOG",
        "TODO",
        "IN_PROGRESS",
        "IN_REVIEW",
        "DONE",
      ]));

      expect(typeof stats.BACKLOG).toBe("number");
      expect(typeof stats.TODO).toBe("number");
      expect(typeof stats.IN_PROGRESS).toBe("number");
      expect(typeof stats.IN_REVIEW).toBe("number");
      expect(typeof stats.DONE).toBe("number");
    });
  });

  describe("get issue stats by assignee", () => {
    it("should return issue stats grouped by assignee", async () => {
      const stats = await getIssueStatsByAssignee();
      expect(typeof stats).toBe("object");
      expect(stats).toHaveProperty("없음")
    });
  });

  describe("get issue stats by priority", () => {
    it("should return issue stats grouped by priority", async () => {
      const stats = await getIssueStatsByPriority();
      expect(typeof stats).toBe("object");
      expect(Object.keys(stats)).toEqual(expect.arrayContaining([
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ]));
    });
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
});