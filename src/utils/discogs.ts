// Discogs API integration
// API Documentation: https://www.discogs.com/developers

export interface DiscogsRelease {
  id: number;
  title: string;
  year?: number;
  country?: string;
  label?: string[];
  catno?: string;
  format?: string[];
  genre?: string[];
  style?: string[];
  thumb?: string;
  cover_image?: string;
  resource_url?: string;
  master_id?: number;
  master_url?: string;
  uri?: string;
}

export interface DiscogsSearchResult {
  id: number;
  type: 'release' | 'master' | 'artist' | 'label';
  title: string;
  thumb: string;
  cover_image: string;
  country?: string;
  year?: string;
  format?: string[];
  label?: string[];
  genre?: string[];
  style?: string[];
  catno?: string;
  barcode?: string[];
  resource_url: string;
}

export interface DiscogsSearchResponse {
  results: DiscogsSearchResult[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
    urls: {
      last?: string;
      next?: string;
    };
  };
}

export interface DiscogsReleaseDetails {
  id: number;
  title: string;
  artists: Array<{
    name: string;
    anv?: string;
    id: number;
  }>;
  year?: number;
  released?: string;
  country?: string;
  labels: Array<{
    name: string;
    catno: string;
    id: number;
  }>;
  formats: Array<{
    name: string;
    qty: string;
    descriptions?: string[];
  }>;
  genres?: string[];
  styles?: string[];
  tracklist?: Array<{
    position: string;
    title: string;
    duration: string;
  }>;
  images?: Array<{
    type: string;
    uri: string;
    uri150: string;
    width: number;
    height: number;
  }>;
  identifiers?: Array<{
    type: string;
    value: string;
  }>;
  notes?: string;
  uri?: string;
  resource_url?: string;
}

class DiscogsAPI {
  private baseUrl = 'https://api.discogs.com';
  private token: string | null = null;
  private consumerKey: string | null = null;
  private consumerSecret: string | null = null;

  constructor() {
    // Try to get credentials from environment variables
    this.token = import.meta.env.VITE_DISCOGS_TOKEN || null;
    this.consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY || null;
    this.consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET || null;
  }

  /**
   * Set authentication credentials manually
   */
  setToken(token: string) {
    this.token = token;
  }

  setConsumerCredentials(key: string, secret: string) {
    this.consumerKey = key;
    this.consumerSecret = secret;
  }

  /**
   * Check if API is configured
   */
  isConfigured(): boolean {
    return !!(this.token || (this.consumerKey && this.consumerSecret));
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'User-Agent': 'VinylCollectionApp/1.0',
    };

    if (this.token) {
      headers['Authorization'] = `Discogs token=${this.token}`;
    }

    return headers;
  }

  /**
   * Make a request to the Discogs API
   */
  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error('Discogs API not configured. Please provide authentication credentials.');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add URL parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // For consumer key/secret, add as URL parameters (not in Authorization header)
    if (!this.token && this.consumerKey && this.consumerSecret) {
      url.searchParams.append('key', this.consumerKey);
      url.searchParams.append('secret', this.consumerSecret);
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Discogs API error: ${response.status} ${response.statusText}. ${
            errorData.message || ''
          }`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch data from Discogs API');
    }
  }

  /**
   * Search for releases, artists, labels, etc.
   */
  async search(
    query: string,
    type?: 'release' | 'master' | 'artist' | 'label',
    page: number = 1,
    perPage: number = 20
  ): Promise<DiscogsSearchResponse> {
    const params: Record<string, string> = {
      q: query,
      page: page.toString(),
      per_page: perPage.toString(),
    };

    if (type) {
      params.type = type;
    }

    return this.request<DiscogsSearchResponse>('/database/search', params);
  }

  /**
   * Search specifically for releases by artist and album name
   */
  async searchRelease(artist: string, album: string, page: number = 1): Promise<DiscogsSearchResponse> {
    const query = `${artist} ${album}`;
    return this.search(query, 'release', page);
  }

  /**
   * Get detailed information about a specific release
   */
  async getRelease(releaseId: number): Promise<DiscogsReleaseDetails> {
    return this.request<DiscogsReleaseDetails>(`/releases/${releaseId}`);
  }

  /**
   * Get detailed information about a master release
   */
  async getMasterRelease(masterId: number): Promise<any> {
    return this.request(`/masters/${masterId}`);
  }

  /**
   * Search by barcode
   */
  async searchByBarcode(barcode: string): Promise<DiscogsSearchResponse> {
    return this.request<DiscogsSearchResponse>('/database/search', {
      barcode: barcode,
      type: 'release',
    });
  }

  /**
   * Search by catalog number
   */
  async searchByCatalogNumber(catno: string, page: number = 1): Promise<DiscogsSearchResponse> {
    return this.request<DiscogsSearchResponse>('/database/search', {
      catno: catno,
      type: 'release',
      page: page.toString(),
    });
  }
}

// Export a singleton instance
export const discogsAPI = new DiscogsAPI();
