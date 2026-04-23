"use client";

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
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
      timeout: opts.timeoutMs ?? 3000000,
    });

    // Attach Bearer token automatically
    this.client.interceptors.request.use((config) => {
      const token = this.opts.getToken?.();
      const isLogin = config.url?.includes("/auth/login");

      if (token && !isLogin) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Standardized error handling
    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        const status = error.response?.status ?? 0;
        const details: any = error.response?.data ?? {
          message: error.message,
        };

        // Build a user-friendly message that includes validation field errors
        let message = `HTTP ${status || "ERR"} for ${error.config?.url}`;
        if (status === 422 && details?.errors && typeof details.errors === "object") {
          const fieldMsgs = Object.entries(details.errors)
            .map(([field, msgs]) => {
              const list = Array.isArray(msgs) ? msgs : [String(msgs)];
              return `${field}: ${list.join(", ")}`;
            })
            .join(" | ");
          message = `${details.message || "Validation Error"} — ${fieldMsgs}`;
        } else if (details?.message) {
          message = `${details.message} (HTTP ${status})`;
        }

        throw new HttpError(message, status, details);
      }
    );
  }

  private async request<T>(
    config: AxiosRequestConfig
  ): Promise<T> {
    const res: AxiosResponse<T> =
      await this.client.request<T>(config);
    return res.data;
  }

  login<T = any>(payload: {
    email: string;
    password: string;
  }): Promise<T> {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("password", payload.password);

    return this.request<T>({
      url: "/auth/login",
      method: "POST",
      data: formData,
      headers: { Accept: "application/json" },
    });
  }

  logout<T = any>(): Promise<T> {
    return this.post<T>("/auth/logout", {});
  }

  get<T>(path: string, config?: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      url: path,
      method: "GET",
    });
  }

  post<T>(
    path: string,
    payload?: unknown,
    config?: AxiosRequestConfig
  ) {
    return this.request<T>({
      ...config,
      url: path,
      method: "POST",
      data: payload,
    });
  }

  put<T>(
  path: string,
  payload?: unknown,
  config?: AxiosRequestConfig
) {
  return this.request<T>({
    ...config,
    url: path,
    method: "POST", // ✅ USE POST
    data: payload,
  });
}

  delete<T>(path: string, config?: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      url: path,
      method: "DELETE",
    });
  }
}