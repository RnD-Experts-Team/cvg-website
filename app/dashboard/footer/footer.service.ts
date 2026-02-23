import { getAuthToken } from "@/app/lib/http/auth";
import { HttpClient } from "@/app/lib/http/http-client";
import { FooterData, GetFooterResponse, UpdateFooterResponse } from "./footer";

const http = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  getToken: getAuthToken,
});

export const FooterService = {
  async get(): Promise<GetFooterResponse> {
    return http.get<GetFooterResponse>("/admin/footer");
  },

  async update(payload: FooterData): Promise<UpdateFooterResponse> {
    return http.put<UpdateFooterResponse>(
      "/admin/footer",
      payload
    );
  },
};