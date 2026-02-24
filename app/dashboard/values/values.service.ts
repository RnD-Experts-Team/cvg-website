import { getAuthToken } from "@/app/lib/http/auth";
import { HttpClient } from "@/app/lib/http/http-client";

const http = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  getToken: getAuthToken,
});

export const ValuesService = {
  // Get all values section
  getValuesSection() {
    return http.get<ApiResponse<ValuesSection>>("/admin/values");
  },

  // Update the values section
  updateValuesSection(payload: { title: string; values: ValueItem[] }) {
    return http.put<ApiResponse<ValuesSection>>(
      "/admin/values",
      payload
    );
  },
};

export interface ValuesSection {
  id: number;
  title: string;
  values: ValueItem[];
}

export interface ValueItem {
  id: number;
  title: string;
  description: string;
  media: {
    url: string;
    alt_text: string;
    title: string;
  };
  sort_order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}