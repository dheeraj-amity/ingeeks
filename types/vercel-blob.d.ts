declare module '@vercel/blob' {
  export interface PutOptions { access?: 'public' | 'private'; contentType?: string; cacheControlMaxAge?: number; addRandomSuffix?: boolean; }
  export interface BlobEntry { url: string; pathname: string; size: number; uploadedAt?: string; }
  export interface ListResult { blobs: BlobEntry[]; }
  export function put(pathname: string, data: string | ArrayBuffer | Blob, options?: PutOptions): Promise<{ url: string; pathname: string; }>; 
  export function list(opts?: { prefix?: string }): Promise<ListResult>;
}
