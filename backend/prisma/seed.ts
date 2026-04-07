import { PrismaClient, Role, IssueStatus, Priority } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.comment.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@tracker.dev',
      password: hashedPassword,
      role: Role.ADMIN,
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff&size=128',
    },
  });

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Dev',
      email: 'alice@tracker.dev',
      password: hashedPassword,
      role: Role.MEMBER,
      avatar: 'https://ui-avatars.com/api/?name=Alice+Dev&background=10b981&color=fff&size=128',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Dev',
      email: 'bob@tracker.dev',
      password: hashedPassword,
      role: Role.MEMBER,
      avatar: 'https://ui-avatars.com/api/?name=Bob+Dev&background=f59e0b&color=fff&size=128',
    },
  });

  const issue1 = await prisma.issue.create({
    data: {
      title: 'Fix login page crash on mobile',
      description: 'The login page crashes when accessed from iOS Safari.',
      status: IssueStatus.IN_PROGRESS,
      priority: Priority.URGENT,
      labels: ['bug', 'mobile', 'auth'],
      creatorId: admin.id,
      assigneeId: alice.id,
    },
  });

  const issue2 = await prisma.issue.create({
    data: {
      title: 'Add dark mode support',
      description: 'Implement dark mode toggle in the settings page.',
      status: IssueStatus.TODO,
      priority: Priority.MEDIUM,
      labels: ['feature', 'ui'],
      creatorId: alice.id,
      assigneeId: bob.id,
    },
  });

  const issue3 = await prisma.issue.create({
    data: {
      title: 'Write API documentation',
      description: null,
      status: IssueStatus.BACKLOG,
      priority: Priority.LOW,
      labels: ['docs'],
      creatorId: bob.id,
      assigneeId: null,
    },
  });

  const issue4 = await prisma.issue.create({
    data: {
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment.',
      status: IssueStatus.IN_REVIEW,
      priority: Priority.HIGH,
      labels: ['devops', 'infrastructure'],
      creatorId: admin.id,
      assigneeId: admin.id,
    },
  });

  const issue5 = await prisma.issue.create({
    data: {
      title: 'Refactor database connection pool',
      description: 'Current pool settings cause timeout issues under heavy load.',
      status: IssueStatus.DONE,
      priority: Priority.HIGH,
      labels: ['backend', 'performance'],
      creatorId: alice.id,
      assigneeId: alice.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'I can reproduce this on iPhone 14. Investigating the cause.',
      authorId: alice.id,
      issueId: issue1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Looks like it's a CSS viewport unit issue. Will fix in next commit.",
      authorId: alice.id,
      issueId: issue1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Should we use prefers-color-scheme media query as the default?',
      authorId: admin.id,
      issueId: issue2.id,
    },
  });

  console.log('Seed completed:');
  console.log(`  Users: admin, alice, bob`);
  console.log(`  Issues: ${issue1.title}, ${issue2.title}, ${issue3.title}, ${issue4.title}, ${issue5.title}`);
  console.log(`  Comments: 3`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
