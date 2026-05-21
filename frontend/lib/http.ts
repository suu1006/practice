import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api",
  withCredentials: true,
  timeout: 10_000
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    // TODO: Access Token 만료 시 refresh API 호출 후 원 요청을 재시도한다.
    return Promise.reject(error);
  }
);
