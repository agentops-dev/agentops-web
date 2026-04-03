import { v4 as uuidv4 } from 'uuid';
import { Folder, Project } from '../types/models';
import { memoryStore } from './store';

export const MAX_FOLDER_DEPTH = 6;

export async function createProject(name: string): Promise<Project> {
  const nowIso = new Date().toISOString();
  const project: Project = {
    id: uuidv4(),
    name,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  memoryStore.projects.set(project.id, project);
  return project;
}

export async function listProjects(): Promise<Project[]> {
  return Array.from(memoryStore.projects.values()).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  return memoryStore.projects.get(projectId) ?? null;
}

export async function createFolder(params: {
  projectId: string;
  name: string;
  parentFolderId?: string;
  charter?: string;
}): Promise<Folder> {
  const project = await getProjectById(params.projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  let depth = 1;
  if (params.parentFolderId) {
    const parent = memoryStore.folders.get(params.parentFolderId);
    if (!parent) {
      throw new Error('Parent folder not found');
    }
    if (parent.projectId !== params.projectId) {
      throw new Error('Parent folder must belong to the same project');
    }
    depth = parent.depth + 1;
  }

  if (depth > MAX_FOLDER_DEPTH) {
    throw new Error(`Folder depth exceeds max level ${MAX_FOLDER_DEPTH}`);
  }

  const nowIso = new Date().toISOString();
  const folder: Folder = {
    id: uuidv4(),
    projectId: params.projectId,
    parentFolderId: params.parentFolderId,
    name: params.name,
    depth,
    charter: params.charter,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  memoryStore.folders.set(folder.id, folder);
  return folder;
}

export async function getFolderById(folderId: string): Promise<Folder | null> {
  return memoryStore.folders.get(folderId) ?? null;
}

export async function listFoldersByProject(projectId: string): Promise<Folder[]> {
  return Array.from(memoryStore.folders.values())
    .filter((folder) => folder.projectId === projectId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getFolderAncestry(folderId: string): Promise<Folder[]> {
  const ancestry: Folder[] = [];
  let current = memoryStore.folders.get(folderId);

  while (current) {
    ancestry.unshift(current);
    current = current.parentFolderId
      ? (memoryStore.folders.get(current.parentFolderId) ?? undefined)
      : undefined;
  }

  return ancestry;
}
