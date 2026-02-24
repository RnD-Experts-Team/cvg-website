export interface Value {
  id: number;
  title: string;
  description: string;
  media: {
    id: number;
    url: string;
  };
}

export interface ValueSection {
  id: number;
  title: string;
  values: Value[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}