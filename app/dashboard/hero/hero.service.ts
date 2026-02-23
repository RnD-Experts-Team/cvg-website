import { HttpClient } from "@/app/lib/http/http-client";
import { getAuthToken } from "@/app/lib/http/auth";
import { GetHeroResponse, UpdateHeroResponse } from "./hero";

const http = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  getToken: getAuthToken,
});

export const HeroService = {
  async get(): Promise<GetHeroResponse> {
    return http.get<GetHeroResponse>("/admin/hero");
  },

  async update(payload: FormData): Promise<UpdateHeroResponse> {
    // ⚠ If your backend only supports POST, keep this:
    return http.post<UpdateHeroResponse>("/admin/hero", payload);

    // If backend supports PUT instead, change to:
    // return http.put<UpdateHeroResponse>("/admin/hero", payload);
  },
};