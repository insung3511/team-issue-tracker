# Simulation State

## Current Sprint
- **Day**: 13/14
- **Date**: 2026-04-05
- **Sprint Status**: on_track

---

## Daily Standups

> Format each day as:
> ### Day N — YYYY-MM-DD
> - **Yesterday**: [what was done]
> - **Today**: [planned work]
> - **Blockers**: [any issues]

### Day 13 — 2026-04-05
- **Yesterday**: TRACKER-013 테스트 실패 수정 (22/22 통과), TS 전체 복습
- **Today**: TRACKER-013 커버리지 확인 + TRACKER-014 최종 리팩토링 시작
- **Blockers**: open handles 경고 잔존 (afterAll 누락 파일) — 기능 영향 없음

### Day 12 — 2026-04-04
- **Yesterday**: TRACKER-013 테스트 코드 작성 (4개 파일), 테스트 실행 결과 10/23 통과, 13 실패
- **Today**: TRACKER-013 테스트 실패 원인 분석 + 수정 + TS 전체 복습
- **Blockers**: Docker가 동작하지 않아 PostgreSQL 연결 불가 → Homebrew PostgreSQL로 해결

### Day 11 — 2026-04-03
- **Yesterday**: TRACKER-012 대시보드 통계 API 완료
- **Today**: TRACKER-013 통합 테스트 보강 + TS Index Signatures 패턴
- **Blockers**: Docker가 동작하지 않아 PostgreSQL 연결 불가 → 테스트 실행受阻

### Day 10 — 2026-04-02
- **Yesterday**: TRACKER-011 Swagger 문서화 완료
- **Today**: TRACKER-012 대시보드 통계 API + TS Enum vs Union Types 패턴
- **Blockers**: None

### Day 9 — 2026-03-30
- **Yesterday**: TRACKER-010 필터링 + 페이지네이션 완료
- **Today**: TRACKER-011 Swagger 문서화 (JSDoc 주석) + `Readonly` / `as const` TS 패턴
- **Blockers**: None

### Day 8 — 2026-03-29
- **Yesterday**: TRACKER-009 댓글 CRUD API 완료 (comments 모듈 전체 구현)
- **Today**: TRACKER-010 필터링 + 페이지네이션 + `Pick` + `Partial` TS 패턴 + Frontend 필터/페이지네이션 UI
- **Blockers**: None

### Day 7 — 2026-03-27
- **Yesterday**: TRACKER-008 상태 전이 규칙 완료 + `Record<K, V>` TS 패턴 + Frontend 상태 변경 UI
- **Today**: TRACKER-009 댓글 CRUD API + Week 1 패턴 복습
- **Blockers**: None

### Day 6 — 2026-03-25
- **Yesterday**: TRACKER-007 이슈 수정/삭제 API 완료 + Zod `.partial()` + Frontend issues 페이지 전체 구현
- **Today**: TRACKER-008 상태 전이 규칙 구현 + `Record<K, V>` TS 패턴 + Frontend 상태 변경 UI
- **Blockers**: None

### Day 5 — 2026-03-24
- **Yesterday**: TRACKER-005/006 코드 리뷰 피드백 반영 (보안: password 노출 수정, AppError 통일, 리턴 타입 정리)
- **Today**: TRACKER-007 이슈 수정/삭제 API + Zod `.partial()` + Frontend issues 페이지 전체 구현
- **Blockers**: None

### Day 4 — 2026-03-24
- **Yesterday**: TRACKER-004 이슈 생성 API 완료
- **Today**: TRACKER-005 이슈 목록 + TRACKER-006 이슈 상세 + 코드 리뷰 피드백 반영 (Pick, select, try/catch 통일)
- **Blockers**: None

### Day 3 — 2026-03-23
- **Yesterday**: TRACKER-003 authenticate 미들웨어 + GET /api/auth/me 완료
- **Today**: TRACKER-004 이슈 생성 API + TS Generics(ApiResponse<T>) + Frontend 이슈 생성 페이지
- **Blockers**: None

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
| 3 | Generics (`ApiResponse<T>`) | `issues/` | 레이어드 아키텍처 실전 적용 (routes→controller→service→repository) |
| 4 | `Pick<T, K>` | `issues.repository.ts` | `Pick<User, "id" \| "name" \| "email">` — Prisma `select`와 조합하여 password 제외 |
| 5 | `.partial()` (Zod) | `issue.schema.ts` | `issueSchema.partial()`로 수정용 schema 생성, 모든 필드 optional 변환 |
| 6 | `Record<K, V>` | `issues.service.ts` | `Record<Issue["status"], Issue["status"][]>` — 상태 전이 맵 + 스프레드 연산자(`...`), `AppError` 확장 |
| 7 | 복습 | — | Week 1 패턴 전체 점검 |
| 8 | `Pick` + `Partial` | `issue.schema.ts`, `issues.repository.ts` | 필터 쿼리 파라미터 타입 설계 + `Prisma.IssueWhereInput` 동적 where 구성 |
| 9 | `Readonly` / `as const` | `stats.service.ts` | TS union type으로 Prisma enum 대신 타입 정의 |
| 10 | Enum vs Union Types | `stats.service.ts` | Prisma 생성 enum vs TS union type 차이 실습 |
| 11 | Index Signatures | 테스트 코드 작성 | `{ [key: string]: number }` 타입 정의 (Record와 비교) |
| 12 | 전체 복습 | 테스트 코드 수정 | 테스트 환경 디버깅 (JWT_SECRET, FK 순서, 상태전이), 22/22 통과 |
| 13 | 전체 복습 II | — | Day 13 진행 중 |

---

## Frontend PRs Reviewed

| PR # | Title | Key Pattern | 3-Line Summary |
|------|-------|-------------|----------------|
| — | Day 5: Frontend issues 전체 구현 | RTK Query `injectEndpoints`, `ProtectedRoute` | auth guard + Layout 네비게이션 + 이슈 CRUD 5페이지. 태훈 리뷰: 에러 key 불일치, Badge 중복, status PATCH 미지원, null/undefined 이슈 4건 |

---

## Completed Tickets

| Ticket | Title | Completed On |
|--------|-------|--------------|
| TRACKER-001 | [Auth] 회원가입 API 구현 | Day 1 |
| TRACKER-002 | [Auth] 로그인 API 구현 | Day 1 |
| TRACKER-003 | [Auth] authenticate 미들웨어 | Day 2 |
| TRACKER-004 | [Issues] 이슈 생성 API | Day 3 |
| TRACKER-005 | [Issues] 이슈 목록 조회 API | Day 4 |
| TRACKER-006 | [Issues] 이슈 상세 조회 API | Day 4 |
| TRACKER-007 | [Issues] 이슈 수정/삭제 API | Day 5 |
| TRACKER-008 | [Issues] 상태 전이 규칙 구현 | Day 6 |
| TRACKER-009 | [Comments] 댓글 CRUD API | Day 7 |
| TRACKER-010 | [Issues] 필터링 + 페이지네이션 | Day 8 |
| TRACKER-011 | [Docs] Swagger 문서화 | Day 9 |

---

## Agent Notes

> Continuity notes for PM/Dev Lead/Frontend agents between sessions.

- **Last Dev Lead TS lesson (현우)**: Day 10 — TS union type vs Prisma enum 차이
- **Frontend Agent last work**: Day 8 — 댓글 CRUD UI + 필터/페이지네이션 UI
- **PM last ticket issued**: TRACKER-001 ~ TRACKER-012
- **Dev Lead**: 현우 (Day 6~, 태훈 → 현우 교체)
- **Docker Issue**: ✅ Homebrew PostgreSQL(`postgresql@18`)로 해결. `brew services start postgresql@18` + `prisma migrate deploy` 완료. 테스트 정상 실행 중.
- **Frontend review feedback pending**: 에러 key 불일치(`message`→`error`), status 수정 미작동, Badge 중복, null vs undefined

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
- **Status**: ✅ Done
- **AC**:
  - `POST /api/issues` (인증필요) → 201 + issue
  - creatorId는 JWT에서 자동 설정
  - Zod 검증: title 필수, priority enum

### TRACKER-005
- **Title**: [Issues] 이슈 목록 조회 API
- **Priority**: HIGH | **SP**: 1
- **Status**: ✅ Done
- **AC**:
  - `GET /api/issues` (인증필요) → 200 + array (최신순)
  - 인증 없으면 401

### TRACKER-006
- **Title**: [Issues] 이슈 상세 조회 API
- **Priority**: HIGH | **SP**: 1
- **Status**: ✅ Done
- **AC**:
  - `GET /api/issues/:id` → 200 + issue + comments
  - 없는 이슈 → 404

### TRACKER-007
- **Title**: [Issues] 이슈 수정/삭제 API
- **Priority**: HIGH | **SP**: 2
- **Status**: ✅ Done
- **AC**:
  - `PATCH /api/issues/:id` → 200 (부분 수정)
  - `DELETE /api/issues/:id` → 204 (작성자만)
  - 타인 삭제 시도 → 403

### TRACKER-008
- **Title**: [Issues] 상태 전이 규칙 구현
- **Priority**: HIGH | **SP**: 3
- **Status**: ✅ Done
- **AC**:
  - `PATCH /api/issues/:id/status` → 200
  - 허용되지 않은 전이 → 400 + allowed 목록
  - BACKLOG→TODO→IN_PROGRESS→IN_REVIEW→DONE (reopen 허용)

### TRACKER-009
- **Title**: [Comments] 댓글 CRUD API
- **Priority**: MEDIUM | **SP**: 2
- **Status**: ✅ Done
- **AC**:
  - `POST /api/issues/:issueId/comments` → 201
  - `GET /api/issues/:issueId/comments` → 200 + array
  - `PATCH /api/comments/:commentId` → 200 (작성자만)
  - `DELETE /api/comments/:commentId` → 204 (작성자만)

### TRACKER-010
- **Title**: [Issues] 필터링 + 페이지네이션
- **Priority**: MEDIUM | **SP**: 3
- **Status**: ✅ Done
- **AC**:
  - `GET /api/issues?status=TODO&priority=HIGH&page=1&limit=10`
  - 응답: `{ data, pagination: { page, limit, total, totalPages } }`

### TRACKER-011
- **Title**: [Docs] Swagger 문서화 (주요 3개)
- **Priority**: LOW | **SP**: 2
- **Status**: ✅ Done
- **AC**:
  - `GET /api-docs` → Swagger UI
  - register, issues CRUD, status transition 문서화

### TRACKER-012
- **Title**: [Stats] 대시보드 통계 API
- **Priority**: LOW | **SP**: 2
- **Status**: ✅ Done
- **AC**:
  - `GET /api/stats/overview` → 상태별 count
  - `GET /api/stats/by-priority` → 우선순위별 count
  - `GET /api/stats/by-assignee` → 담당자별 count + 이름

### TRACKER-013
- **Title**: [Quality] 통합 테스트 보강
- **Priority**: MEDIUM | **SP**: 2
- **Status**: 🔄 In Progress
- **AC**:
  - 전체 플로우 통합 테스트 (가입→로그인→이슈→댓글)
  - 서비스 레이어 커버리지 >80%
- **Note**: 22/22 통과 (`--runInBand`). open handles 경고 잔존.

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
