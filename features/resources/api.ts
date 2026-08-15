import { api } from '@/lib/axios';

export type ResourceFolder = { name: string; count: number };
export type ResourceImage = {
  path: string;
  folder: string;
  name: string;
  url: string;
  createdAt: string;
};

export const resourceImagesQueryKey = ['resources'] as const;
export const resourceFoldersQueryKey = ['resource-folders'] as const;

export function listResourceImages(folder?: string | null) {
  return api
    .get<{ data: ResourceImage[] }>('/resources', { params: folder ? { folder } : undefined })
    .then((res) => res.data);
}

export function createResourceImage(input: { folder: string; name?: string | null; image: File }) {
  const formData = new FormData();
  formData.append('folder', input.folder);
  if (input.name) formData.append('name', input.name);
  formData.append('image', input.image);
  return api.post<{ data: ResourceImage }>('/resources', formData).then((res) => res.data);
}

export function updateResourceImage(
  path: string,
  input: { name?: string | null; folder?: string },
) {
  return api
    .patch<{ data: ResourceImage }>('/resources', { path, ...input })
    .then((res) => res.data);
}

export function deleteResourceImage(path: string) {
  return api
    .delete<{ data: { path: string } }>('/resources', { params: { path } })
    .then((res) => res.data);
}

export function listResourceFolders() {
  return api.get<{ data: ResourceFolder[] }>('/resource-folders').then((res) => res.data);
}

export function createResourceFolder(name: string) {
  return api.post<{ data: ResourceFolder }>('/resource-folders', { name }).then((res) => res.data);
}

export function renameResourceFolder(name: string, newName: string) {
  return api
    .patch<{ data: ResourceFolder }>('/resource-folders', { name, newName })
    .then((res) => res.data);
}

export function deleteResourceFolder(name: string) {
  return api
    .delete<{ data: { name: string } }>('/resource-folders', { params: { name } })
    .then((res) => res.data);
}
