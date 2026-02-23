import { HttpClient } from "@/app/lib/http/http-client";
import { getAuthToken } from "@/app/lib/http/auth";
import { ApiResponse, Project, ProjectSection, Category } from "./projects";

const http = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  getToken: getAuthToken,
});

export const ProjectsService = {
  // SECTION
  getSection() {
    return http.get<ApiResponse<ProjectSection>>("/admin/projects-section");
  },

  updateSection(payload: { title: string; description: string }) {
    return http.put<ApiResponse<ProjectSection>>(
      "/admin/projects-section",
      payload
    );
  },

  // PROJECTS CRUD
  getProjects() {
    return http.get<ApiResponse<Project[]>>("/admin/projects");
  },

  getProject(id: number) {
    return http.get<ApiResponse<Project>>(`/admin/projects/${id}`);
  },

  createProject(payload: FormData) {
    return http.post<ApiResponse<Project>>("/admin/projects", payload);
  },

  updateProject(id: number, payload: FormData) {
    return http.put<ApiResponse<Project>>(
      `/admin/projects/${id}`,
      payload
    );
  },

  deleteProject(id: number) {
    return http.delete<ApiResponse<{}>>(`/admin/projects/${id}`);
  },

    // CATEGORIES
    getCategories() {
    return http.get<ApiResponse<Category[]>>("/admin/categories");
    },

    getCategory(id: number) {
    return http.get<ApiResponse<Category>>(`/admin/categories/${id}`);
    },

    createCategory(payload: FormData) {
    return http.post<ApiResponse<Category>>("/admin/categories", payload);
    },

    updateCategory(id: number, payload: FormData) {
    return http.post<ApiResponse<Category>>(
        `/admin/categories/${id}?_method=PUT`,
        payload
    );
    },

    deleteCategory(id: number) {
    return http.delete<ApiResponse<{}>>(`/admin/categories/${id}`);
},
};