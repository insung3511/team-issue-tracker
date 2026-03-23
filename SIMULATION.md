# Simulation State

## Current Sprint
- **Day**: 2/14
- **Date**: 2026-03-23
- **Sprint Status**: on_track

---

## Daily Standups

> Format each day as:
> ### Day N — YYYY-MM-DD
> - **Yesterday**: [what was done]
> - **Today**: [planned work]
> - **Blockers**: [any issues]

### Day 2 — 2026-03-23
- **Yesterday**: TRACKER-001 회원가입 + TRACKER-002 로그인 완료, CI/CD 구성, Frontend auth 페이지
- **Today**: TRACKER-003 authenticate 미들웨어 + GET /api/auth/me + Frontend 로그인 상태 유지
- **Blockers**: None

### Day 1 — 2026-03-22
- **Yesterday**: Day 0 셋업 완료 (Prisma schema, Express skeleton, Frontend scaffold)
- **Today**: TRACKER-001 회원가입 API + TRACKER-002 로그인 API + CI/CD 워크플로우 + Frontend auth 페이지
- **Blockers**: None

---

## TS Patterns Learned

| Day | Pattern | File Applied | Notes |
|-----|---------|--------------|-------|
| 1 | `Omit<T, K>` | `auth.service.ts` | `Omit<User, 'password'>` + destructuring으로 password 제거 |
| 2 | `Omit` 심화 | `auth.service.ts` | `SafeUser` 타입을 getMe에서 재사용 + non-null assertion(`!`) 학습 |

---

## Frontend PRs Reviewed

| PR # | Title | Key Pattern | 3-Line Summary |
|------|-------|-------------|----------------|
| — | — | — | (fill after each review) |

---

## Completed Tickets

| Ticket | Title | Completed On |
|--------|-------|--------------|
| TRACKER-001 | [Auth] 회원가입 API 구현 | Day 1 |
| TRACKER-002 | [Auth] 로그인 API 구현 | Day 1 |
| TRACKER-003 | [Auth] authenticate 미들웨어 | Day 2 |

---

## Agent Notes

> Continuity notes for PM/Dev Lead/Frontend agents between sessions.

- **Last Dev Lead TS lesson**: Day 2 — `Omit` 심화 + non-null assertion(`!`)
- **Frontend Agent last PR**: Day 1 — auth pages (Login, Register) + RTK Query auth slice
- **PM last ticket issued**: TRACKER-001, TRACKER-002, TRACKER-003

---

## 14-Day Backlog (Pre-defined)

### TRACKER-001
- **Title**: [Auth] 회원가입 API 구현
- **Priority**: HIGH | **SP**: 2
- **Status**: ✅ Done
- **AC**:
  - `POST /api/auth/register` → 201 + `{ success, data: { user, token } }`
  - 이메일 중복 → 409
  - 필드 누락 → 400
  - 응답에 password 필드 없음

### TRACKER-002
- **Title**: [Auth] 로그인 API 구현
- **Priority**: HIGH | **SP**: 1
- **Status**: ✅ Done
- **AC**:
  - `POST /api/auth/login` → 200 + token
  - 존재하지 않는 이메일 → 401
  - 잘못된 비밀번호 → 401

### TRACKER-003
- **Title**: [Auth] authenticate 미들웨어
- **Priority**: HIGH | **SP**: 1
- **Status**: ✅ Done
- **AC**:
  - 유효 토큰 → `req.userId` 설정 후 next()
  - 토큰 없음/만료/위조 → 401
  - `GET /api/auth/me` → 인증된 유저 정보

### TRACKER-004
- **Title**: [Issues] 이슈 생성 API
- **Priority**: HIGH | **SP**: 2
- **Status**: 📋 Backlog
- **AC**:
  - `POST /api/issues` (인증필요) → 201 + issue
  - creatorId는 JWT에서 자동 설정
  - Zod 검증: title 필수, priority enum

### TRACKER-005
- **Title**: [Issues] 이슈 목록 조회 API
- **Priority**: HIGH | **SP**: 1
- **Status**: 📋 Backlog
- **AC**:
  - `GET /api/issues` (인증필요) → 200 + array (최신순)
  - 인증 없으면 401

### TRACKER-006
- **Title**: [Issues] 이슈 상세 조회 API
- **Priority**: HIGH | **SP**: 1
- **Status**: 📋 Backlog
- **AC**:
  - `GET /api/issues/:id` → 200 + issue + comments
  - 없는 이슈 → 404

### TRACKER-007
- **Title**: [Issues] 이슈 수정/삭제 API
- **Priority**: HIGH | **SP**: 2
- **Status**: 📋 Backlog
- **AC**:
  - `PATCH /api/issues/:id` → 200 (부분 수정)
  - `DELETE /api/issues/:id` → 204 (작성자만)
  - 타인 삭제 시도 → 403

### TRACKER-008
- **Title**: [Issues] 상태 전이 규칙 구현
- **Priority**: HIGH | **SP**: 3
- **Status**: 📋 Backlog
- **AC**:
  - `PATCH /api/issues/:id/status` → 200
  - 허용되지 않은 전이 → 400 + allowed 목록
  - BACKLOG→TODO→IN_PROGRESS→IN_REVIEW→DONE (reopen 허용)

### TRACKER-009
- **Title**: [Comments] 댓글 CRUD API
- **Priority**: MEDIUM | **SP**: 2
- **Status**: 📋 Backlog
- **AC**:
  - `POST /api/issues/:id/comments` → 201
  - `GET /api/issues/:id/comments` → 200 + array
  - `PATCH /api/comments/:id` → 200 (작성자만)
  - `DELETE /api/comments/:id` → 204 (작성자만)

### TRACKER-010
- **Title**: [Issues] 필터링 + 페이지네이션
- **Priority**: MEDIUM | **SP**: 3
- **Status**: 📋 Backlog
- **AC**:
  - `GET /api/issues?status=TODO&priority=HIGH&page=1&limit=10`
  - 응답: `{ data, pagination: { page, limit, total, totalPages } }`

### TRACKER-011
- **Title**: [Docs] Swagger 문서화 (주요 3개)
- **Priority**: LOW | **SP**: 2
- **Status**: 📋 Backlog
- **AC**:
  - `GET /api-docs` → Swagger UI
  - register, issues CRUD, status transition 문서화

### TRACKER-012
- **Title**: [Stats] 대시보드 통계 API
- **Priority**: LOW | **SP**: 2
- **Status**: 📋 Backlog
- **AC**:
  - `GET /api/stats/overview` → 상태별 count
  - `GET /api/stats/by-priority` → 우선순위별 count
  - `GET /api/stats/by-assignee` → 담당자별 count + 이름

### TRACKER-013
- **Title**: [Quality] 통합 테스트 보강
- **Priority**: MEDIUM | **SP**: 2
- **Status**: 📋 Backlog
- **AC**:
  - 전체 플로우 통합 테스트 (가입→로그인→이슈→댓글)
  - 서비스 레이어 커버리지 >80%

### TRACKER-014
- **Title**: [Review] 최종 리팩토링 + 회고
- **Priority**: LOW | **SP**: 2
- **Status**: 📋 Backlog
- **AC**:
  - `as any` 0건
  - 미사용 import 없음
  - README.md 완성
  - SIMULATION.md 회고 작성

---

## TS Learning Map

| Day | Pattern | Description |
|-----|---------|-------------|
| 1 | `Omit<T, K>` | 민감 필드(password) 제거한 응답 DTO |
| 2 | `Omit` 심화 | 여러 필드 제거 + 재사용 가능한 AuthResponse 타입 |
| 3 | Generics (`ApiResponse<T>`) | 모든 응답을 타입 안전하게 감싸는 제네릭 래퍼 |
| 4 | Type Guard | `value is Priority` — 런타임 타입 좁히기 |
| 5 | Discriminated Union | 성공/실패를 ok 필드로 구분하는 유니온 타입 |
| 6 | `Record<K, V>` | 매핑 객체 타입 (상태→허용상태, 숫자→메시지) |
| 7 | 복습 | Week 1 패턴 전체 점검 |
| 8 | `Pick` + `Partial` | 필터 쿼리 파라미터 타입 설계 |
| 9 | `Readonly` / `as const` | 상수 객체/배열 수정 방지 |
| 10 | Enum vs Union Types | Prisma enum vs TS union의 런타임/컴파일타임 차이 |
| 11 | Index Signatures | `{ [key: string]: number }` vs `Record<K, V>` |
| 12-13 | 전체 복습 | 모든 패턴 활용 확인 |
| 14 | 총정리 | 인턴십 준비 |
