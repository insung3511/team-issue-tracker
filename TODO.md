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

## ✅ Day 3 — TRACKER-005, 006 구현 완료 (리뷰 피드백 반영 필요)

- [x] TRACKER-005: 이슈 목록 조회 API (`GET /api/issues`)
- [x] TRACKER-006: 이슈 상세 조회 API (`GET /api/issues/:id`)
- [ ] ⬇️ 아래 코드 리뷰 피드백 반영 필요

## 🔜 Upcoming
- [ ] TRACKER-007: 이슈 수정/삭제 API (Day 5)
- [ ] TRACKER-008: 상태 전이 규칙 (Day 6)
- [ ] TRACKER-009: 댓글 CRUD (Day 8)
- [ ] TRACKER-010: 필터링 + 페이지네이션 (Day 9)

## 🔴 코드 리뷰 피드백 — TRACKER-005/006 (리뷰어: 태훈, 하은)

### CRITICAL (AC 미충족 — 반드시 수정)

- [ ] `issues.repository.ts` — `getIssueByUserId()`: `orderBy: { createdAt: 'desc' }` 추가
  - TRACKER-005 AC: "최신순" 정렬인데, 현재 정렬 없음 (DB 기본 순서로 나감)

### SHOULD FIX (일관성/타입 안전성)

- [ ] `issues.controller.ts` — 에러 처리를 `AppError`로 통일
  - 현재: 400/404를 `res.status().json()` 수동 응답
  - 개선: `throw new AppError(400, "Invalid issue ID")` 사용 → `errorHandler`에서 처리
  - 이유: auth 쪽은 `AppError` 쓰는데 issues만 수동. 통일 필요

- [ ] `issues.controller.ts` — 에러 응답 키 통일 (`error` vs `message`)
  - `errorHandler.ts` → `{ success: false, error: "..." }`
  - 컨트롤러 수동 → `{ success: false, message: "..." }`
  - 프론트에서 파싱할 때 혼란 생김. `AppError` 통일하면 자동 해결

- [ ] `issues.controller.ts` — `parseInt(id, 10)` 중복 호출 (line 25, 28)
  - 한 번만 파싱해서 변수에 저장

- [ ] `issues.repository.ts` + `issues.service.ts` — `getIssueById` 리턴 타입 수정
  - 현재: `Promise<Issue | null>` (relations 미포함)
  - 실제: `include: { creator, comments }` → `Issue & { creator: User, comments: Comment[] }`
  - Prisma 타입 유틸 쓰거나 별도 타입 정의 필요

- [ ] `issues.controller.ts` — 에러 핸들링 패턴 통일
  - auth: `try/catch` + `next(error)`
  - issues: IIFE `(async () => {...})().catch(next)`
  - 한 가지로 통일할 것

### NICE TO HAVE (개선사항)

- [ ] `issues.repository.ts` — 목록 API에 `include: { creator: true }` 추가
  - 프론트에서 목록 화면에 작성자 이름 표시하려면 필요 (현재 creatorId만 내려감)

- [ ] `auth.middleware.ts:5` — `JWT_SECRET` 타입 가드 추가
  - 현재: `const JWT_SECRET: string = process.env.JWT_SECRET` (string | undefined → string 직접 할당)
  - 개선: 환경변수 존재 검증 후 할당, 또는 startup 시 검증

## ⚠️ 잔여 이슈

- [ ] auth.service.test.ts: 실제 테스트 작성 필요 (현재 todo만 있음)
- [ ] issues.service.test.ts: 실제 테스트 작성 필요 (현재 todo만 있음)
- [ ] loginSchema: password `min(1)` 의도적 설정 — 기존 사용자 로그인 호환
