# 개인 신용평가 리포트 조회 서비스

한국평가정보 Product Engineer 사전 과제를 위한 개인 신용평가 리포트 조회 서비스입니다. 사용자는 회원가입/로그인 후 본인의 리포트 목록을 서버 페이징, 검색, 필터, 정렬로 조회하고 상세 내용을 확인할 수 있습니다. 상세 조회 시점은 조회 이력으로 기록됩니다.

## 기술 스택

| 영역 | 선택 |
| --- | --- |
| Frontend | Next.js 14, TypeScript, Tailwind CSS, TanStack Query, Zustand |
| Backend | Java 17, Spring Boot 3.5, Spring Security, JPA, H2 |
| 인증 | Access Token + Refresh Token, Refresh Token HttpOnly Cookie |
| DB | H2 인메모리 DB |

### 선택 이유

- **Spring Boot Option A**: 과제 가산점 대상이며, 실제 Java/Spring 협업 환경에 가까운 인증/권한/DB 흐름을 보여줄 수 있어 선택했습니다.
- **H2 인메모리 DB**: 별도 DB 설치 없이 5분 안에 실행할 수 있도록 구성했습니다.
- **TanStack Query**: 서버 상태의 캐싱, 로딩/에러 상태, mutation 흐름을 명확히 분리하기 위해 사용했습니다.
- **Zustand**: Access Token과 로그인 사용자 같은 클라이언트 상태만 가볍게 관리하기 위해 사용했습니다.
- **Tailwind CSS**: 빠르게 일관된 UI를 만들고, 과제 범위 안에서 사용성 중심의 화면을 구성하기 위해 사용했습니다.

## 프로젝트 구조

```text
.
├── frontend/        # Next.js 14 App Router 프로젝트
├── backend/         # Spring Boot 3.x 프로젝트
└── README.md
```

### Frontend 구조

```text
frontend/
├── app/                    # App Router 페이지와 레이아웃
├── components/             # 공통 UI, 레이아웃 컴포넌트
├── features/
│   ├── auth/               # 인증 API, 타입, 로그인/회원가입 UI
│   ├── reports/            # 리포트 목록/상세 API와 화면
│   └── history/            # 조회 이력 API와 화면
├── lib/                    # Axios 인스턴스, 유틸
├── stores/                 # Zustand store
└── types/                  # 공통 API 타입
```

### Backend 구조

```text
backend/src/main/java/com/kcs/creditreport/
├── domain/
│   ├── auth/               # 회원, JWT 인증 API
│   ├── report/             # 신용평가 리포트 목록/상세
│   └── history/            # 조회 이력
└── global/
    ├── config/             # Security, CORS, 시드 데이터
    ├── dto/                # 공통 페이지 응답
    ├── exception/          # 공통 에러 응답
    └── security/           # JWT Provider, Filter
```

## 실행 방법

### 한 번에 실행

Java 17 이상과 Node.js/npm 설치 후 프로젝트 루트에서 실행합니다.

```bash
npm install --prefix frontend
npm run dev
```

Homebrew로 설치한 Java 17은 실행 스크립트가 `/opt/homebrew/opt/openjdk@17` 경로를 자동으로 잡습니다.

주민등록번호 컬럼은 JPA `AttributeConverter`로 암호화 저장합니다. 로컬 기본 키가 있으며, 별도 키를 쓰려면 아래 환경변수를 설정합니다.

```bash
export KCS_RRN_CRYPTO_KEY="replace-with-local-secret"
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

### 검증 명령어

```bash
cd frontend
npm run type-check
npm run lint
npm run build
```

```bash
cd backend
./gradlew test --console=plain
```

## 테스트 계정

| 이메일 | 비밀번호 | 비고 |
| --- | --- | --- |
| `test@example.com` | `Password1!` | 샘플 리포트 15건 포함 |

## 샘플 데이터 제공 방식

외부 신용평가사 API는 사용하지 않습니다. 개발 환경에서는 Spring Boot 실행 시 `DataInitializer`가 H2 인메모리 DB에 테스트 계정과 샘플 신용평가 리포트 15건을 적재합니다. 프론트엔드는 별도 JSON Mock을 직접 읽지 않고, 실제 백엔드 API를 호출해 자체 DB의 데이터를 조회합니다.

샘플 데이터는 애플리케이션 재시작 시 초기화됩니다. 리포트 상세 조회 이력도 H2 인메모리 DB에 저장되므로, 서버를 재시작하면 다시 빈 이력에서 시작합니다.

## API 명세

| Method | Path | 설명 | 인증 |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | 회원가입 | 아니오 |
| POST | `/api/auth/login` | 로그인 및 토큰 발급 | 아니오 |
| POST | `/api/auth/refresh` | Access Token 재발급 | 쿠키 |
| POST | `/api/auth/logout` | 로그아웃 및 Refresh Token 무효화 | 예 |
| GET | `/api/reports` | 내 리포트 목록, 서버 페이징/검색/필터/정렬 | 예 |
| GET | `/api/reports/{reportId}` | 리포트 상세 조회 및 조회 이력 기록 | 예 |
| GET | `/api/histories` | 내 조회 이력 최신순 목록 | 예 |

### 인증 API

#### POST `/api/auth/signup`

Request:

```json
{
  "email": "test@example.com",
  "password": "Password1!"
}
```

Response `201 Created`:

```json
{
  "accessToken": "...",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

Refresh Token은 `HttpOnly` Cookie로 내려갑니다.

#### POST `/api/auth/login`

Request와 Response는 회원가입과 동일하며, 성공 시 Access Token과 Refresh Token Cookie를 재발급합니다.

#### POST `/api/auth/refresh`

Refresh Token Cookie를 검증해 Access Token을 재발급합니다.

#### POST `/api/auth/logout`

Authorization Header가 필요하며, DB에 저장된 Refresh Token 해시와 Cookie를 무효화합니다.

### 리포트 목록 쿼리 파라미터

| 이름 | 설명 | 예시 |
| --- | --- | --- |
| `page` | 0부터 시작하는 페이지 번호 | `0` |
| `size` | 페이지 크기, 기본 10건 | `10` |
| `keyword` | 제목 또는 발급기관명 검색어 | `카드` |
| `creditGrade` | 신용등급 1~10 | `3` |
| `from` | 발급일 시작일 | `2026-01-01` |
| `to` | 발급일 종료일 | `2026-05-31` |
| `sortBy` | `issuedAt` 또는 `creditScore` | `creditScore` |
| `direction` | `asc` 또는 `desc` | `desc` |

목록 응답:

```json
{
  "content": [
    {
      "id": 1,
      "title": "2026 상반기 개인 신용평가",
      "agencyName": "KCS 평가정보",
      "creditScore": 842,
      "creditGrade": 2,
      "issuedAt": "2026-05-18"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 15,
  "totalPages": 2
}
```

### 리포트 상세 응답

`GET /api/reports/{reportId}` 호출 시 조회 이력이 함께 기록됩니다.

```json
{
  "id": 1,
  "title": "2026 상반기 개인 신용평가",
  "agencyName": "KCS 평가정보",
  "creditScore": 842,
  "creditGrade": 2,
  "issuedAt": "2026-05-18",
  "maskedResidentRegistrationNumber": "900101-1******",
  "summary": "최근 금융 거래 이력..."
}
```

### 조회 이력 응답

`GET /api/histories?page=0&size=10`

```json
{
  "content": [
    {
      "id": 1,
      "reportId": 1,
      "reportTitle": "2026 상반기 개인 신용평가",
      "agencyName": "KCS 평가정보",
      "creditScore": 842,
      "creditGrade": 2,
      "viewedAt": "2026-05-23T18:00:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1
}
```

## 구현 내용

- 이메일/비밀번호 회원가입, BCrypt 해싱
- JWT Access Token + Refresh Token 구조
- Refresh Token `HttpOnly` Cookie 저장, DB에는 SHA-256 해시 저장
- Access Token 만료 시 프론트 Axios 인터셉터에서 자동 재발급
- 인증 필요 페이지 접근 제어
- 리포트 목록 서버 페이징, 검색, 필터, 정렬
- 검색/필터/정렬/페이지 상태 URL 쿼리 동기화
- 리포트 상세 조회 시 조회 이력 기록
- 동일 리포트 중복 조회 시점별 기록
- 주민등록번호 DB 암호화 저장, 응답 마스킹 처리

## 고민했던 점과 트레이드오프

- **Access Token 저장 위치**: 과제 범위에서는 Zustand 메모리 상태에 저장했습니다. 새로고침 시 Access Token은 사라지지만 Refresh Token Cookie로 세션을 복구합니다. localStorage 저장보다 XSS 노출을 줄이는 쪽을 선택했습니다.
- **Refresh Token 저장 방식**: Cookie에는 실제 토큰을 두고, DB에는 SHA-256 해시만 저장했습니다. 토큰 원문이 DB에 남지 않도록 하기 위한 선택입니다.
- **CSRF 대응**: Refresh Token Cookie는 `SameSite=Lax`, `HttpOnly`로 설정했습니다. 운영 환경이라면 HTTPS 기반 `Secure=true`와 CSRF 토큰 전략을 추가로 고려해야 합니다.
- **민감정보 처리**: 주민등록번호는 JPA `AttributeConverter`로 암호화 저장하고, API 응답에서는 마스킹된 값만 제공합니다.
- **Next.js 14 유지**: `npm audit`은 Next 16 업그레이드를 권고하지만, 과제 명시 스택인 Next.js 14를 우선했습니다.

## 구현하지 못한 부분과 이유

- **Refresh Token 재사용 탐지와 토큰 패밀리 관리**: 과제 범위에서는 로그아웃 시 현재 Refresh Token 해시를 무효화하는 수준으로 구현했습니다. 운영 환경이라면 탈취 의심 상황을 추적하기 위해 토큰 패밀리와 재사용 탐지를 추가해야 합니다.
- **Swagger/OpenAPI 문서 자동화**: README의 표와 예시 JSON으로 API 명세를 제공했습니다. 과제 시간 범위에서는 별도 Swagger UI 구성보다 핵심 API 구현과 실행 편의성을 우선했습니다.
- **운영용 환경변수 분리와 HTTPS Cookie `Secure=true` 적용**: 로컬 실행 편의성을 위해 기본 설정은 HTTP localhost 기준입니다. 운영 배포 시에는 환경별 설정 파일과 HTTPS 기반 Secure Cookie 설정이 필요합니다.
- **더 세밀한 접근성 점검과 모바일 UI 개선**: 기본적인 키보드 이동, 로딩/에러/빈 상태는 구성했지만, 스크린리더 흐름과 모바일 UX는 추가 점검 여지가 있습니다.

## 추후 개선 항목

- Refresh Token 재사용 탐지와 토큰 패밀리 관리
- Swagger/OpenAPI 문서 자동화
- 운영용 환경변수 분리와 HTTPS Cookie `Secure=true` 적용
- 더 세밀한 접근성 점검과 모바일 UI 개선

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
- 과제 조건에 맞춰 Next.js 14 최신 패치인 `14.2.35`를 사용합니다. `npm audit`은 Next 16 업그레이드를 권고하지만, 현재 단계에서는 과제 명시 스택을 우선합니다.
