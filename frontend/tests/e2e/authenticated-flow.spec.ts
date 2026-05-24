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
});

test("리포트 상세 조회 후 조회 이력에 기록된다", async ({ page }) => {
  await login(page);

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
  await page.getByPlaceholder("test@example.com").fill(`empty-user-${Date.now()}@example.com`);
  await page.getByPlaceholder("Password1!").fill("Password1!");
  await page.getByRole("button", { name: "가입하기" }).click();

  await expect(page).toHaveURL(/\/reports$/);
  await expect(page.getByText("조건에 맞는 리포트가 없습니다.")).toBeVisible();
  await expect(page.getByRole("link", { name: /2026 상반기 개인 신용평가/ })).toHaveCount(0);
});
