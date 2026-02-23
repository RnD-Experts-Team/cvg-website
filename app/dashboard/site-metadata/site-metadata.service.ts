import { HttpClient } from "@/app/lib/http/http-client";
import { GetSiteMetadataResponse, UpdateSiteMetadataResponse } from "./site-metadata";
import { getAuthToken } from "@/app/lib/http/auth";


const http = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  getToken: getAuthToken,
});

export const SiteMetadataService = {
  async get(): Promise<GetSiteMetadataResponse> {
    return http.get<GetSiteMetadataResponse>(
      "/admin/site-metadata"
    );
  },

 async update(payload: FormData): Promise<UpdateSiteMetadataResponse> {
  return http.put<UpdateSiteMetadataResponse>(
    "/admin/site-metadata",
    payload
  );
}
};