import { Router } from 'express';
import { z } from 'zod';
import {
  getEffectiveAgentContext,
  moveAgentToFolder,
} from '../supabase/agents';
import { createFolder, createProject, listFoldersByProject, listProjects } from '../supabase/org';

const router = Router();

const createProjectSchema = z.object({
  name: z.string().min(1),
});

const createProjectWithFolderSchema = z.object({
  name: z.string().min(1),
  charter: z.string().optional(),
});

const createFolderSchema = z.object({
  project_id: z.string().min(1),
  name: z.string().min(1),
  parent_folder_id: z.string().optional(),
  charter: z.string().optional(),
});

const moveAgentSchema = z.object({
  project_id: z.string().min(1),
  folder_id: z.string().min(1),
});

router.post('/projects', async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  const project = await createProject(parsed.data.name);
  return res.status(201).json({ project });
});

router.post('/projects-with-folder', async (req, res) => {
  const parsed = createProjectWithFolderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  try {
    const project = await createProject(parsed.data.name);
    const folder = await createFolder({
      projectId: project.id,
      name: parsed.data.name,
      charter: parsed.data.charter,
    });
    return res.status(201).json({ project, folder });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to create project and folder';
    return res.status(400).json({ error: message });
  }
});

router.get('/projects', async (_req, res) => {
  const projects = await listProjects();
  return res.json({ projects });
});

router.post('/folders', async (req, res) => {
  const parsed = createFolderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  try {
    const folder = await createFolder({
      projectId: parsed.data.project_id,
      name: parsed.data.name,
      parentFolderId: parsed.data.parent_folder_id,
      charter: parsed.data.charter,
    });
    return res.status(201).json({ folder });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create folder';
    return res.status(400).json({ error: message });
  }
});

router.get('/projects/:projectId/folders', async (req, res) => {
  const folders = await listFoldersByProject(req.params.projectId);
  return res.json({ folders });
});

router.post('/agents/:agentId/move', async (req, res) => {
  const parsed = moveAgentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  try {
    const agent = await moveAgentToFolder({
      agentId: req.params.agentId,
      projectId: parsed.data.project_id,
      folderId: parsed.data.folder_id,
    });
    return res.json({ agent });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to move agent';
    if (message === 'Agent not found') {
      return res.status(404).json({ error: message });
    }
    return res.status(400).json({ error: message });
  }
});

router.get('/agents/:agentId/context', async (req, res) => {
  try {
    const context = await getEffectiveAgentContext(req.params.agentId);
    return res.json(context);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to resolve context';
    if (message === 'Agent not found') {
      return res.status(404).json({ error: message });
    }
    return res.status(400).json({ error: message });
  }
});

export default router;
