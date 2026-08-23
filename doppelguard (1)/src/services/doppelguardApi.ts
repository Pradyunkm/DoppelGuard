import { 
  ProfileInput, 
  ProfileAnalysisResponse, 
  CompareResponse, 
  BenchmarkReport, 
  CrossPlatformResponse, 
  ScrapeAndCheckResponse,
  CompetitiveMatrixData
} from "../types";

// Base URL configuration: can be overridden in Settings or via VITE_API_BASE_URL env var
const STORAGE_KEY_API_BASE = "doppelguard_api_base_url";

export function getApiBaseUrl(): string {
  const custom = localStorage.getItem(STORAGE_KEY_API_BASE);
  if (custom) return custom.trim().replace(/\/+$/, "");
  return (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000";
}

export function setApiBaseUrl(url: string): void {
  if (!url || url.trim() === "") {
    localStorage.removeItem(STORAGE_KEY_API_BASE);
  } else {
    localStorage.setItem(STORAGE_KEY_API_BASE, url.trim().replace(/\/+$/, ""));
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMessage);
    }

    return (await response.json()) as T;
  } catch (err: any) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error(`Cannot connect to DoppelGuard backend at ${url || window.location.origin}. Please ensure the server is running.`);
    }
    throw err;
  }
}

export const doppelguardApi = {
  /**
   * Health check to verify backend connectivity and engine status
   */
  async checkHealth(): Promise<{ status: string; service?: string; version?: string; capabilities?: string[] }> {
    return request<{ status: string; service?: string; version?: string; capabilities?: string[] }>("/health");
  },

  /**
   * Evaluates a single profile for impersonation risk with hybrid ML and pHash
   */
  async checkProfile(profile: ProfileInput): Promise<ProfileAnalysisResponse> {
    return request<ProfileAnalysisResponse>("/profile/check", {
      method: "POST",
      body: JSON.stringify(profile),
    });
  },

  /**
   * Compares two profiles with real 64-bit pHash Hamming distance
   */
  async compareProfiles(profileA: ProfileInput, profileB: ProfileInput): Promise<CompareResponse> {
    return request<CompareResponse>("/profile/compare", {
      method: "POST",
      body: JSON.stringify({ profileA, profileB }),
    });
  },

  /**
   * One-click live social media URL scraper and forensic analysis
   */
  async scrapeAndCheckProfile(url: string): Promise<ScrapeAndCheckResponse> {
    return request<ScrapeAndCheckResponse>("/profile/scrape-and-check", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },

  /**
   * Cross-platform username audit across Twitter, Instagram, LinkedIn, GitHub, YouTube, Telegram
   */
  async checkCrossPlatform(username: string): Promise<CrossPlatformResponse> {
    return request<CrossPlatformResponse>("/profile/cross-platform-check", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  /**
   * Fetches the 40-case empirical benchmark report with Confusion Matrix & ROC-AUC
   */
  async getBenchmarkReport(threshold: number = 45.0): Promise<BenchmarkReport> {
    return request<BenchmarkReport>(`/evaluation/benchmark?threshold=${threshold}`);
  },

  /**
   * Fetches competitive comparison data vs Botometer, FaceCheck, SocialBlade, ZeroFox
   */
  async getCompetitiveMatrix(): Promise<CompetitiveMatrixData> {
    return request<CompetitiveMatrixData>("/evaluation/competitive-matrix");
  },

  /**
   * Fetches historical analysis reports
   */
  async getReports(params?: { band?: string; threat_type?: string; search?: string }): Promise<ProfileAnalysisResponse[]> {
    const query = new URLSearchParams();
    if (params?.band) query.append("band", params.band);
    if (params?.threat_type) query.append("threat_type", params.threat_type);
    if (params?.search) query.append("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return request<ProfileAnalysisResponse[]>(`/reports${queryString}`);
  },

  /**
   * Deletes a report by ID
   */
  async deleteReport(id: string | number): Promise<{ status: string; id: string | number }> {
    return request<{ status: string; id: string | number }>(`/reports/${id}`, {
      method: "DELETE",
    });
  },
};
