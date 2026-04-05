import prisma from "../lib/prisma";

export type IssueStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export async function getIssueStatsOverview() {
  type statsTypes = Record<IssueStatus, number>
  const initialStats: statsTypes = {
    BACKLOG: 0,
    TODO: 0,
    IN_PROGRESS: 0,
    IN_REVIEW: 0,
    DONE: 0,
  }

  const result = await prisma.issue.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  result.forEach((item) => {
    initialStats[item.status] = item._count.status;
  });

  return initialStats;
}

export async function getIssueStatsByPriority() {
  type priorityTypes = Record<IssuePriority, number>
  const priotiryCounts: priorityTypes = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    URGENT: 0,
  };

  const resultPriority = await prisma.issue.groupBy({
    by: ["priority"],
    _count: {
      priority: true,
    },
  });

  resultPriority.forEach((item) => {
    priotiryCounts[item.priority] = item._count.priority;
  });

  return priotiryCounts;
}

export async function getIssueStatsByAssignee() {
  // 1. assigneeId별 개수
  const assignedStats = await prisma.issue.groupBy({
    by: ["assigneeId"],
    _count: { assigneeId: true },
    where: { assigneeId: { not: null } },
  });

  // 2. assigneeId 목록으로 유저 이름 조회
  const assigneeIds = assignedStats.map(s => s.assigneeId!).filter(Boolean);
  const users = await prisma.user.findMany({
    where: { id: { in: assigneeIds } },
    select: { id: true, name: true }
  });
  const userMap = new Map(users.map(u => [u.id, u.name]));

  // 3. 결과 조합
  const result = assignedStats.reduce((acc, curr) => {
    const name = userMap.get(curr.assigneeId!) || "알 수 없음";
    acc[name] = curr._count.assigneeId;
    return acc;
  }, {} as Record<string, number>);

  // 4. 미할당 (assigneeId가 null)
  const unassignedCount = await prisma.issue.count({
    where: { assigneeId: null }
  });
  result["없음"] = unassignedCount;

  return result;
}
