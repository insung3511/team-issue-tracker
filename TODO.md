# TODO

## ✅ Day 1 — 완료

- [x] TRACKER-001: 회원가입 API (`POST /api/auth/register`)
- [x] TRACKER-002: 로그인 API (`POST /api/auth/login`)
- [x] CI/CD: GitHub Actions 워크플로우 구성
- [x] Frontend: auth 페이지 (Login, Register) + RTK Query slice
- [x] TS 패턴: `Omit<T, K>` — `SafeUser = Omit<User, 'password'>`

## 📌 Day 2 — 진행 중

- [ ] TRACKER-003: authenticate 미들웨어
  - JWT 검증 → `req.userId` 설정 후 `next()`
  - 토큰 없음/만료/위조 → 401
  - `GET /api/auth/me` → 인증된 유저 정보 반환
- [ ] TS 패턴: `Omit` 심화 — 여러 필드 제거 + 재사용 가능한 AuthResponse 타입
- [ ] Frontend: 로그인 상태 유지 로직 + auth guard (서준)

## 🔜 Upcoming

- [ ] TRACKER-004: 이슈 생성 API (Day 3)
- [ ] TRACKER-005: 이슈 목록 조회 API (Day 4)
- [ ] TRACKER-006: 이슈 상세 조회 API (Day 4)
- [ ] TRACKER-007: 이슈 수정/삭제 API (Day 5)
- [ ] TRACKER-008: 상태 전이 규칙 (Day 6)
- [ ] TRACKER-009: 댓글 CRUD (Day 8)
- [ ] TRACKER-010: 필터링 + 페이지네이션 (Day 9)

## ⚠️ 잔여 이슈

- [ ] auth.service.test.ts: 실제 테스트 작성 필요 (현재 todo만 있음)
- [ ] loginSchema: password `min(1)` 의도적 설정 — 기존 사용자 로그인 호환
