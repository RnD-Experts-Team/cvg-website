import { getAuthToken } from '@/app/lib/http/auth';
import { HttpClient } from '@/app/lib/http/http-client';
import { ApiResponse, CreateServiceRequest, Service, ServiceSection, UpdateServiceRequest } from './service';

export class ServiceService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
      getToken: getAuthToken,
    });
  }

  // Fetch the service section data (Title and Description)
  async getServiceSection(): Promise<ApiResponse<ServiceSection['data']>> {
    return this.client.get<ApiResponse<ServiceSection['data']>>('/admin/services-section');
  }

  // Update the service section (Title and Description)
  async updateServiceSection(payload: { title: string, description: string, image: File | null }): Promise<ServiceSection> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    if (payload.image) formData.append('image', payload.image);
    return this.client.put<ApiResponse<ServiceSection['data']>>('/admin/services-section', formData);
  }

  // Fetch all services
  async getAllServices(): Promise<ApiResponse<Service[]>> {
    return this.client.get<ApiResponse<Service[]>>('/admin/services');
  }

  // Fetch a single service by ID
  async getServiceById(id: number): Promise<ApiResponse<Service>> {
    return this.client.get<ApiResponse<Service>>(`/admin/services/${id}`);
  }

  // Create a new service
  async createService(payload: CreateServiceRequest): Promise<ApiResponse<Service>> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('content', payload.content || '');
    formData.append('featured', payload.featured ? '1' : '0');
    formData.append('slug', payload.slug);
    if (payload.image) formData.append('image', payload.image);
    if (payload.alt_text) formData.append('alt_text', payload.alt_text);
    if (payload.image_title) formData.append('image_title', payload.image_title);

    return this.client.post<ApiResponse<Service>>('/admin/services', formData);
  }

  // Update an existing service
  async updateService(payload: UpdateServiceRequest): Promise<ApiResponse<Service>> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('content', payload.content || '');
    formData.append('featured', payload.featured ? '1' : '0');
    formData.append('slug', payload.slug);
    if (payload.image) formData.append('image', payload.image);
    if (payload.alt_text) formData.append('alt_text', payload.alt_text);
    if (payload.image_title) formData.append('image_title', payload.image_title);

    return this.client.put<ApiResponse<Service>>(`/admin/services/${payload.id}`, formData);
  }

  // Delete a service
  async deleteService(id: number): Promise<void> {
    return this.client.delete<void>(`/admin/services/${id}`);
  }
}