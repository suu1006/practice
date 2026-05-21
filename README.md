# 개인 신용평가 리포트 조회 서비스

한국평가정보 Product Engineer 사전 과제를 위한 풀스택 웹 애플리케이션입니다. Frontend는 Next.js 14 App Router, Backend는 가산점 대상인 Spring Boot Option A로 진행합니다.

## 기술 스택

| 영역 | 선택 |
| --- | --- |
| Frontend | Next.js 14, TypeScript, Tailwind CSS, TanStack Query, Zustand |
| Backend | Java 17, Spring Boot 3.5, Spring Security, JPA, H2 |
| 인증 | Access Token + Refresh Token, Refresh Token HttpOnly Cookie 예정 |
| DB | H2 인메모리 DB |

## 프로젝트 구조

```text
.
├── frontend/        # Next.js 14 App Router 프로젝트
├── backend/         # Spring Boot 3.x 프로젝트
└── README.md
```

## 실행 방법

### 한 번에 실행

Java 17 이상과 Node.js/npm 설치 후 프로젝트 루트에서 실행합니다.

```bash
npm run dev
```

기본 주소는 다음과 같습니다.

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/api`

`3000` 포트가 이미 사용 중이면 아래 명령어를 사용합니다.

```bash
npm run dev:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

### Backend

Java 17 이상 설치가 필요합니다.

```bash
cd backend
./gradlew bootRun --console=plain
```

기본 API 주소는 `http://localhost:8080/api`입니다.

## 테스트 계정

초기 데이터와 테스트 계정은 백엔드 시드 구현 시 확정합니다.

| 이메일 | 비밀번호 | 비고 |
| --- | --- | --- |
| 예정 | 예정 | 시드 데이터 추가 후 갱신 |

## API 명세 초안

| Method | Path | 설명 | 인증 |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | 회원가입 | 아니오 |
| POST | `/api/auth/login` | 로그인 및 토큰 발급 | 아니오 |
| POST | `/api/auth/refresh` | Access Token 재발급 | 쿠키 |
| POST | `/api/auth/logout` | 로그아웃 및 Refresh Token 무효화 | 예 |
| GET | `/api/reports` | 내 리포트 목록, 서버 페이징/검색/필터/정렬 | 예 |
| GET | `/api/reports/{reportId}` | 리포트 상세 조회 및 조회 이력 기록 | 예 |
| GET | `/api/histories` | 내 조회 이력 최신순 목록 | 예 |

## 구현 우선순위

1. 회원가입/로그인, BCrypt 저장, JWT Access/Refresh Token 구조
2. 인증 필요 페이지 접근 제어와 FE 토큰 재발급 인터셉터
3. 리포트 목록 서버 페이징, 검색, 필터, 정렬과 URL 쿼리 동기화
4. 리포트 상세 조회, 민감정보 마스킹, 조회 이력 기록
5. README 보강, API 명세 확정, 테스트 계정 정리

## Git 규칙

모든 커밋 메시지는 Conventional Commits 기반으로 작성합니다.

```text
feat : 로그인 로직 구현
fix : 리포트 필터 조건 오류 수정
docs : 실행 방법 문서화
refactor : 인증 서비스 책임 분리
test : 로그인 서비스 테스트 추가
chore : 프로젝트 초기 설정
```

- 콜론 앞 타입은 영어 소문자 사용
- 콜론 뒤 설명은 한글 사용
- 작업 단위가 검토 가능한 크기일 때만 커밋
- 사용자 검토 전 임의 커밋 금지

## 진행 메모

- Backend는 과제 가산점 대상인 Spring Boot Option A를 선택했습니다.
- 인증, 페이지네이션, 검색, 필터, 정렬은 과제 조건에 맞춰 서버 측에서 처리합니다.
- 현재 단계는 디렉터리 구조와 실행 가능한 기본 골격 구성입니다.
- 과제 조건에 맞춰 Next.js 14 최신 패치인 `14.2.35`를 사용합니다. `npm audit`은 Next 16 업그레이드를 권고하지만, 현재 단계에서는 과제 명시 스택을 우선합니다.
- 현재 로컬 환경에는 Java 런타임이 없어 Backend 실행 검증은 Java 17+ 설치 후 진행해야 합니다.
