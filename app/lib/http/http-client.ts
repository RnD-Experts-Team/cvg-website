import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { HttpError } from "@/lib/http/errors";

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
      // withCredentials: true, // enable if your CMS uses cookie-based auth
    });

    // Request interceptor: attach token
    this.client.interceptors.request.use((config) => {
      const token = this.opts.getToken?.();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: normalize errors
    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        // Axios error may not have response (network / CORS / timeout)
        const status = error.response?.status ?? 0;
        const details = error.response?.data ?? {
          message: error.message,
          code: error.code,
        };

        // Best-effort path for debugging (like your fetch version)
        const path =
          (error.config?.url ?? "").toString() ||
          (error.config?.baseURL ?? "").toString() ||
          "unknown";

        throw new HttpError(`HTTP ${status || "ERR"} for ${path}`, status, details);
      }
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.request<T>(config);
    return res.data;
  }

  get<T>(path: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url: path, method: "GET" });
  }

  post<T>(path: string, payload?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url: path, method: "POST", data: payload });
  }

  put<T>(path: string, payload?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url: path, method: "PUT", data: payload });
  }

  delete<T>(path: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url: path, method: "DELETE" });
  }
}
