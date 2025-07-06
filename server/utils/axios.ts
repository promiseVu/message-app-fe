import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios"; 
interface AxiosOptions {
   "Content-Type"?: string;
  Accept?: string;
  Authorization?: string;
}

// environment variables
const config = useRuntimeConfig();
const BASE_URL = config.private.baseUrl || "https://localhost:8080";
const ENVIRONMENT = config.public.environment || "development";
const DEFAULT_TIMEOUT = 10000;

// Create instance of Axios with default configuration
export const useAxiosProxy = (options: AxiosOptions = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": options['Content-Type'] || "application/json",
      Accept: options.Accept || "application/json",
      Authorization: options.Authorization,
    },
    timeout: DEFAULT_TIMEOUT,
  });

  // Interceptor for request
  instance.interceptors.request.use(
    (request) => {
      if (ENVIRONMENT === "development") {
        console.log("Request url", request.url);
      }
      return request;
    },
    (error) => {
      if (ENVIRONMENT === "development") {
        console.error("Error Request", error.message);
      }

      return Promise.reject(error);
    }
  );

  // Interceptor for response
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (ENVIRONMENT === "development") {
        console.log("Response:", response.data);
      }
      return response.data;
    },
    (error) => {
      if (ENVIRONMENT === "development") {
        console.log("Error Response:", error.response);
      }
      return Promise.reject({
        status: error.response?.status || 500,
        message: error.response?.data || "Server Error",
        url: error.config?.url,
      });
    }
  );

  return instance;
};
