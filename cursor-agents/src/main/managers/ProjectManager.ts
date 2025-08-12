import { Project } from '../../shared/types';
import { promises as fs } from 'fs';
import { join, basename } from 'path';
import { v4 as uuidv4 } from 'uuid';

export class ProjectManager {
  private projects: Map<string, Project> = new Map();

  async openProject(path: string): Promise<Project> {
    try {
      // Check if path exists and is a directory
      const stats = await fs.stat(path);
      if (!stats.isDirectory()) {
        throw new Error('Path is not a directory');
      }

      const project: Project = {
        id: uuidv4(),
        name: basename(path),
        path,
        type: await this.detectProjectType(path),
        lastOpened: new Date()
      };

      this.projects.set(project.id, project);
      return project;
    } catch (error) {
      throw new Error(`Failed to open project: ${error}`);
    }
  }

  async closeProject(projectId: string): Promise<void> {
    this.projects.delete(projectId);
  }

  async listProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(name: string, path: string): Promise<Project> {
    try {
      const fullPath = join(path, name);
      await fs.mkdir(fullPath, { recursive: true });

      const project: Project = {
        id: uuidv4(),
        name,
        path: fullPath,
        type: 'folder',
        lastOpened: new Date()
      };

      this.projects.set(project.id, project);
      return project;
    } catch (error) {
      throw new Error(`Failed to create project: ${error}`);
    }
  }

  private async detectProjectType(path: string): Promise<'folder' | 'git' | 'workspace'> {
    try {
      // Check for .git directory
      await fs.access(join(path, '.git'));
      return 'git';
    } catch {
      // Check for workspace files
      try {
        const files = await fs.readdir(path);
        if (files.some(file => file.endsWith('.code-workspace'))) {
          return 'workspace';
        }
      } catch {
        // Ignore error
      }
      return 'folder';
    }
  }
}