/**
 * API client for Senergy backend
 * Includes offline support and caching
 */

import type { Site, ControlAction, TimeSeriesDataPoint, ApiResponse } from '@types';
import { getCachedData, cacheData } from '@lib/utils/offline';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      return data.data;
    } catch (error) {
      // Try to return cached data if available
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        const cached = await getCachedData<T>(`cache_${endpoint}`);
        if (cached) return cached;
      }
      throw error;
    }
  }

  private getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  async getSiteSummary(siteId: string): Promise<Site> {
    const endpoint = `/sites/${siteId}/summary`;
    const data = await this.fetch<Site>(endpoint);

    // Cache the response
    await cacheData(`cache_${endpoint}`, data, 300); // 5 min TTL

    return data;
  }

  async getTimeSeries(
    siteId: string,
    from: string,
    to: string
  ): Promise<TimeSeriesDataPoint[]> {
    return this.fetch<TimeSeriesDataPoint[]>(
      `/sites/${siteId}/telemetry?from=${from}&to=${to}`
    );
  }

  async performAction(siteId: string, action: ControlAction): Promise<void> {
    await this.fetch(`/sites/${siteId}/control`, {
      method: 'POST',
      body: JSON.stringify(action),
    });
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const data = await this.fetch<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
  }
}

export const apiClient = new ApiClient();
