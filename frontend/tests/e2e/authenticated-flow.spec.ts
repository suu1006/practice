import { expect, test, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("이메일").fill("test@example.com");
  await page.getByLabel("비밀번호").fill("Password1!");
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL(/\/reports$/);
}

test("로그인 후 리포트 목록 테이블을 조회할 수 있다", async ({ page }) => {
  await login(page);
  const firstReport = page.getByRole("link", { name: /2026 상반기 개인 신용평가/ });

  await expect(page.getByRole("heading", { name: "신용평가 리포트" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "리포트명" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "발급기관" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "점수" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "등급" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "발급일" })).toBeVisible();
  await expect(firstReport).toBeVisible();
  await expect(firstReport).toHaveAttribute("href", /\/reports\/\d+$/);
});

test("검색어를 입력하면 리포트 목록이 실시간으로 필터링된다", async ({ page }) => {
  await login(page);

  await page.getByPlaceholder("제목 또는 발급기관 검색").fill("카드");

  await expect(page).toHaveURL(/keyword=%EC%B9%B4%EB%93%9C/);
  await expect(page.getByRole("link", { name: "카드 이용 기반 신용 리포트" })).toBeVisible();
  await expect(page.getByRole("link", { name: /2026 상반기 개인 신용평가/ })).toHaveCount(0);
});

test("발급일 입력창을 클릭하면 날짜 선택기가 열린다", async ({ page }) => {
  await login(page);
  await page.evaluate(() => {
    type PickerWindow = Window & { __showPickerCalls?: number };
    const pickerWindow = window as PickerWindow;
    pickerWindow.__showPickerCalls = 0;
    HTMLInputElement.prototype.showPicker = function () {
      pickerWindow.__showPickerCalls = (pickerWindow.__showPickerCalls ?? 0) + 1;
    };
  });

  await page.getByLabel("발급 시작일").click();

  await expect
    .poll(() => page.evaluate(() => (window as Window & { __showPickerCalls?: number }).__showPickerCalls ?? 0))
    .toBe(1);
});

test("외부 redirect 파라미터는 로그인 후 기본 리포트 경로로 대체된다", async ({ page }) => {
  await page.goto("/login?redirect=//evil.example/path");
  await page.getByLabel("이메일").fill("test@example.com");
  await page.getByLabel("비밀번호").fill("Password1!");
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL(/\/reports$/);
});

test("회원가입 비밀번호 정책 오류를 표시한다", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("이메일").fill(`invalid-password-${Date.now()}@example.com`);
  await page.getByLabel("비밀번호").fill("password");
  await page.getByRole("button", { name: "가입하기" }).click();

  await expect(page.getByText("8자 이상, 영문 · 숫자 · 특수문자를 포함해야 합니다.")).toBeVisible();
});

test("회원가입 이메일 형식 오류를 표시한다", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("이메일").fill("invalid-email");
  await page.getByLabel("비밀번호").fill("Password1!");
  await page.getByRole("button", { name: "가입하기" }).click();

  await expect(page.getByText("이메일 형식이 올바르지 않습니다.")).toBeVisible();
});

test("이미 가입한 계정으로 회원가입하면 오류를 표시한다", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("이메일").fill("test@example.com");
  await page.getByLabel("비밀번호").fill("Password1!");
  await page.getByRole("button", { name: "가입하기" }).click();

  await expect(page.getByText("이미 가입한 계정입니다.")).toBeVisible();
});

test("리포트 상세 조회 후 조회 이력에 기록된다", async ({ page }) => {
  await login(page);
  await page.getByRole("link", { name: "조회 이력" }).click();
  await expect(page).toHaveURL(/\/history$/);

  await page.getByRole("link", { name: "리포트", exact: true }).click();
  await expect(page).toHaveURL(/\/reports$/);
  await page.getByRole("link", { name: /2026 상반기 개인 신용평가/ }).click();
  await expect(page).toHaveURL(/\/reports\/\d+$/);
  const reportTitle = await page.getByRole("heading", { level: 1 }).innerText();

  await page.getByRole("link", { name: "조회 이력" }).click();
  await expect(page).toHaveURL(/\/history$/);
  await expect(page.getByRole("heading", { name: "조회 이력" })).toBeVisible();
  await expect(page.getByText(reportTitle).first()).toBeVisible();
});

test("다른 계정으로 전환하면 이전 계정의 리포트 캐시가 보이지 않는다", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("link", { name: /2026 상반기 개인 신용평가/ })).toBeVisible();

  await page.getByRole("button", { name: "로그아웃" }).click();
  await expect(page).toHaveURL(/\/login/);

  await page.getByRole("link", { name: "계정이 없다면 회원가입" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "회원가입" })).toBeVisible();
  await page.getByLabel("이메일").fill(`empty-user-${Date.now()}@example.com`);
  await page.getByLabel("비밀번호").fill("Password1!");
  await page.getByRole("button", { name: "가입하기" }).click();

  await expect(page).toHaveURL(/\/reports$/);
  await expect(page.getByText("조건에 맞는 리포트가 없습니다.")).toBeVisible();
  await expect(page.getByRole("link", { name: /2026 상반기 개인 신용평가/ })).toHaveCount(0);
});
