export interface ApiResponse<T> {
  status: number;
  message: string | string[];
  data?: T;
}
