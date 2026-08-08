'use client';

import { create } from 'zustand';

type GroupPostDraftState = {
  content: string;
  category: string | null;
  image: File | null;
  /** Existing hosted URL picked from a saved Content — sent as-is, no re-upload. */
  imageUrl: string | null;
  previewUrl: string | null;
  /** Bỏ soạn content — n8n random content của danh mục cho từng nhóm. */
  randomContent: boolean;
  setContent: (content: string) => void;
  setRandomContent: (randomContent: boolean) => void;
  setCategory: (category: string | null) => void;
  setImage: (file: File | null) => void;
  applyTemplate: (template: { content: string; image_url: string }) => void;
  clearImage: () => void;
  clearDraft: () => void;
};

function revokePreview(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}

export const useGroupPostDraftStore = create<GroupPostDraftState>((set, get) => ({
  content: '',
  category: null,
  image: null,
  imageUrl: null,
  previewUrl: null,
  randomContent: false,

  setContent: (content) => set({ content }),

  setRandomContent: (randomContent) => set({ randomContent }),

  setCategory: (category) => set({ category }),

  setImage: (file) => {
    revokePreview(get().previewUrl);
    set({
      image: file,
      imageUrl: null,
      previewUrl: file ? URL.createObjectURL(file) : null,
    });
  },

  applyTemplate: (template) => {
    revokePreview(get().previewUrl);
    set({
      content: template.content,
      image: null,
      imageUrl: template.image_url || null,
      previewUrl: template.image_url || null,
    });
  },

  clearImage: () => {
    revokePreview(get().previewUrl);
    set({ image: null, imageUrl: null, previewUrl: null });
  },

  clearDraft: () => {
    revokePreview(get().previewUrl);
    set({
      content: '',
      category: null,
      image: null,
      imageUrl: null,
      previewUrl: null,
      randomContent: false,
    });
  },
}));
