"use client";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpError } from "./errors";

export type HttpClientOptions = {
  baseUrl: string;
  getToken?: () => string | null;
  timeoutMs?: number;
};

export class HttpClient {
  private client: AxiosInstance;

  constructor(private opts: HttpClientOptions) {
    this.client = axios.create({
      baseURL: opts.baseUrl,
      timeout: opts.timeoutMs ?? 30_000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = this.opts.getToken?.();
      // Do not add Authorization header for login endpoint
      const isLogin = config.url?.includes("/api/auth/login");
      if (token && !isLogin) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        const status = error.response?.status ?? 0;
        const details = error.response?.data ?? {
          message: error.message,
          code: error.code,
        };
        throw new HttpError(`HTTP ${status || "ERR"} for ${error.config?.url}`, status, details);
      }
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.request<T>(config);
    return res.data;
  }

  login<T = any>(payload: { email: string; password: string }): Promise<T> {
    return this.post<T>("/auth/login", payload).catch((error: HttpError) => {
      console.error("Login Error", error);
      throw error;
    });
  }
    // Updated logout function to ensure proper API interaction
  logout<T = any>(): Promise<T> {
    const token = localStorage.getItem("auth_token");
    return this.post<T>("/auth/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((error: HttpError) => {
      console.error("Logout Error", error);
      throw error;
    });
  }

  post<T>(path: string, payload?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url: path, method: "POST", data: payload });
  }
  get<T>(path: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url: path, method: "GET" });
  }

  put<T>(path: string, payload?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url: path, method: "PUT", data: payload });
  }

  delete<T>(path: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url: path, method: "DELETE" });
  }
}