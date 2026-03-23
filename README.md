# Team Issue Tracker

미니 Jira 스타일의 팀 이슈 트래커. 14일 스프린트 시뮬레이션을 통해 TypeScript 백엔드 개발을 학습하는 프로젝트입니다.

## 프로젝트 개요

이 프로젝트는 **시뮬레이션 인턴십** 형태로 진행됩니다.

- 사용자(인턴)가 **백엔드 API를 직접 구현**
- 4명의 AI Agent가 팀원으로 참여하여 실제 업무 환경을 시뮬레이션
- 매일 1개의 TypeScript 패턴을 학습하며 적용

### 팀 구성

| 이름 | 역할 | 담당 |
|------|------|------|
| 사용자 | Backend Developer (인턴) | 백엔드 API 직접 구현 |
| 다은 | PM | 스프린트 관리, 티켓 할당, 일정 조율 |
| 태훈 | Dev Lead | 코드 리뷰, TS 패턴 가이드, 아키텍처 멘토링 |
| 하은 | CI/CD & Review | GitHub Actions, 코드 품질 체크, 머지 기준 관리 |
| 서준 | Frontend Developer | React + RTK Query 프론트엔드 구현 |

### 학습 방식

```
1. "day N 시작하자" → PM(다은)이 오늘의 티켓 브리핑
2. 사용자가 백엔드 코드 직접 구현
3. 막히면 Dev Lead(태훈)에게 질문
4. 완성 후 CI/CD(하은)에게 품질 체크 요청
5. Frontend(서준)가 동시에 프론트 작업, API 인터페이스 조율
```

## Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | Express.js + TypeScript + Prisma + PostgreSQL + JWT + Zod |
| Frontend | React 19 + Redux Toolkit + RTK Query + Vite |
| Test | Jest + Supertest |
| Infra | Docker (PostgreSQL), GitHub Actions CI |

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)

### Backend

```bash
cd backend
npm install
docker compose up -d   # PostgreSQL 시작
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Useful Commands

```bash
# Backend
cd backend
npx tsc --noEmit          # 타입 체크
npx jest                  # 테스트 실행
npx jest --coverage       # 커버리지 확인

# Frontend
cd frontend
npm run build             # 빌드 (타입 체크 포함)
npm run lint              # ESLint
```

## Project Structure

```
team-issue-tracker/
├── backend/
│   ├── prisma/              # Prisma schema + migrations
│   └── src/
│       ├── auth/            # 인증 (register, login)
│       ├── issues/          # 이슈 CRUD
│       ├── comments/        # 댓글 CRUD
│       ├── stats/           # 대시보드 통계
│       ├── middleware/      # auth, validate, errorHandler
│       ├── errors/          # AppError
│       ├── lib/             # prisma client, pagination
│       └── types/           # 공통 타입
├── frontend/
│   └── src/
│       ├── pages/           # 페이지 컴포넌트
│       ├── store/           # Redux store + RTK Query
│       └── types/           # 프론트 타입
├── .github/workflows/      # CI/CD
├── SIMULATION.md            # 스프린트 상태 + 백로그
└── TODO.md                  # 현재 할 일 목록
```

## 14-Day Sprint Overview

| Day | Ticket | TS Pattern |
|-----|--------|------------|
| 1 | Auth 회원가입 + 로그인 | `Omit<T, K>` |
| 2 | Auth 미들웨어 | `Omit` 심화 |
| 3 | 이슈 생성 | `ApiResponse<T>` Generics |
| 4 | 이슈 목록/상세 | Type Guard |
| 5 | 이슈 수정/삭제 | Discriminated Union |
| 6 | 상태 전이 | `Record<K, V>` |
| 7 | 복습 | Week 1 점검 |
| 8 | 댓글 CRUD | `Pick` + `Partial` |
| 9 | 필터링 + 페이지네이션 | `Readonly` / `as const` |
| 10 | Swagger 문서화 | Enum vs Union |
| 11 | 대시보드 통계 | Index Signatures |
| 12-13 | 통합 테스트 보강 | 전체 복습 |
| 14 | 최종 리팩토링 + 회고 | 총정리 |

## Key Files

- `SIMULATION.md` — 스프린트 상태, 데일리 스탠드업, 학습 기록
- `TODO.md` — 현재 진행 중인 할 일 목록
- `CLAUDE.md` — Agent 시뮬레이션 프로토콜

## API Documentation

Available at `http://localhost:3000/api-docs` when backend is running.
