'use client';

import { create } from 'zustand';

type GroupPostDraftState = {
  content: string;
  category: string | null;
  image: File | null;
  previewUrl: string | null;
  setContent: (content: string) => void;
  setCategory: (category: string | null) => void;
  setImage: (file: File | null) => void;
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
  previewUrl: null,

  setContent: (content) => set({ content }),

  setCategory: (category) => set({ category }),

  setImage: (file) => {
    revokePreview(get().previewUrl);
    set({
      image: file,
      previewUrl: file ? URL.createObjectURL(file) : null,
    });
  },

  clearImage: () => {
    revokePreview(get().previewUrl);
    set({ image: null, previewUrl: null });
  },

  clearDraft: () => {
    revokePreview(get().previewUrl);
    set({
      content: '',
      category: null,
      image: null,
      previewUrl: null,
    });
  },
}));
