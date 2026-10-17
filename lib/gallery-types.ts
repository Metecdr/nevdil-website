export const MAX_PHOTOS = 60;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const MAX_CAPTION_LENGTH = 180;

export type GalleryPhoto = {
  id: string;
  caption: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
};

export type Gallery = { version: 1; revision: string; photos: GalleryPhoto[] };
export const photoUrl = (id: string) => `/api/gallery/${id}`;
