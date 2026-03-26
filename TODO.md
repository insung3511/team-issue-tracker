# TODO

## ✅ Day 1 — 완료

- [x] TRACKER-001: 회원가입 API (`POST /api/auth/register`)
- [x] TRACKER-002: 로그인 API (`POST /api/auth/login`)
- [x] CI/CD: GitHub Actions 워크플로우 구성
- [x] Frontend: auth 페이지 (Login, Register) + RTK Query slice
- [x] TS 패턴: `Omit<T, K>` — `SafeUser = Omit<User, 'password'>`

## ✅ Day 2 — 완료

- [x] TRACKER-003: authenticate 미들웨어
  - JWT 검증 → `req.userId` 설정 후 `next()`
  - 토큰 없음/만료/위조 → 401
  - `GET /api/auth/me` → 인증된 유저 정보 반환
- [x] TS 패턴: `Omit` 심화 — SafeUser 재사용 + non-null assertion(`!`)
- [ ] Frontend: 로그인 상태 유지 로직 + auth guard (서준) — 진행 예정

## ✅ Day 3 — 완료

- [x] TRACKER-004: 이슈 생성 API
  - `POST /api/issues` (인증 필요) → 201 + issue
  - creatorId는 JWT에서 자동 설정 (`req.userId`)
  - Zod 검증: title 필수, priority enum
- [x] 레이어드 아키텍처 실전: issues 도메인 (routes→controller→service→repository)
- [ ] Frontend: 이슈 생성 페이지 + RTK Query issues slice (서준) — 진행 예정

## ✅ Day 4 — TRACKER-005, 006 구현 + 코드 리뷰 피드백 반영 완료

- [x] TRACKER-005: 이슈 목록 조회 API (`GET /api/issues`)
- [x] TRACKER-006: 이슈 상세 조회 API (`GET /api/issues/:id`)
- [x] TS 패턴: `Pick<T, K>` — creator에서 password 제외한 안전한 타입 (`Pick<User, "id" | "name" | "email">`)
- [x] 코드 리뷰 피드백 반영 (아래 상세)

## ✅ 코드 리뷰 피드백 — TRACKER-005/006 (리뷰어: 태훈, 하은)

### CRITICAL
- [x] `issues.repository.ts` — `orderBy: { createdAt: 'desc' }` 추가 (최신순 정렬)

### SHOULD FIX
- [x] `issues.controller.ts` — 에러 처리를 `AppError`로 통일
- [x] `issues.controller.ts` — 에러 응답 키 통일 (`AppError` 통일로 자동 해결)
- [x] `issues.controller.ts` — `parseInt(id, 10)` 중복 호출 제거
- [x] `issues.repository.ts` + `issues.service.ts` — 리턴 타입 수정 (`Issue & { creator: Pick<User, ...> }`)
- [x] `issues.controller.ts` — IIFE → `try/catch` + `next(error)` 패턴 통일

### NICE TO HAVE
- [x] `issues.repository.ts` — 목록 API에 creator `select` 추가 (password 제외)
- [x] 🔴 보안 수정: `include: { creator: true }` → `select`로 password 노출 방지
- [ ] `auth.middleware.ts:5` — `JWT_SECRET` 타입 가드 추가 (미반영, 추후 처리)

## ✅ Day 5 — TRACKER-007 완료

- [x] TRACKER-007: 이슈 수정/삭제 API
  - [x] `PATCH /api/issues/:id` → 200 (부분 수정: title, description, priority 등)
  - [x] `DELETE /api/issues/:id` → 204 (작성자만 삭제 가능)
  - [x] 타인 삭제/수정 시도 → 403 Forbidden
  - [x] Zod schema: 수정용 `.partial()` (`issueUpdateSchema`)
  - [x] 권한 체크: `req.userId === issue.creatorId`
  - [x] HTTP 상태코드 정리 (400/403/404)
- [x] TS 패턴: `.partial()` — Zod schema에서 모든 필드를 optional로 변환

## 📌 Day 6 — TRACKER-008 상태 전이 규칙

- [x] TRACKER-008: 상태 전이 규칙 구현
  - [x] `PATCH /api/issues/:id/status` → 200
  - [x] 허용되지 않은 전이 → 400 + allowed 목록 (`AppError.info`로 구조화)
  - [x] 전이 규칙: BACKLOG→TODO→IN_PROGRESS→IN_REVIEW→DONE (reopen: DONE→IN_PROGRESS)
  - [x] `Record<Issue["status"], Issue["status"][]>` 전이 맵 (service layer)
  - [x] `issueStatusUpdateSchema` Zod 검증 추가
  - [x] `AppError`에 `info?: Record<string, unknown>` 확장
- [x] TS 패턴: `Record<K, V>` — 상태→허용상태 매핑 객체 타입
- [x] Frontend: 상태 변경 UI + 전이 실패 에러 처리 (서준)
  - [x] `useUpdateIssueStatusMutation` 추가
  - [x] "Change Status" 버튼 + 폼 추가
  - [x] 에러 처리 `message` → `error` 수정

## 🔜 Upcoming
- [ ] TRACKER-009: 댓글 CRUD (Day 8)
- [ ] TRACKER-010: 필터링 + 페이지네이션 (Day 9)

## ⚠️ 잔여 이슈

- [ ] auth.service.test.ts: 실제 테스트 작성 필요 (현재 todo만 있음)
- [ ] issues.service.test.ts: 실제 테스트 작성 필요 (현재 todo만 있음)
- [ ] loginSchema: password `min(1)` 의도적 설정 — 기존 사용자 로그인 호환
