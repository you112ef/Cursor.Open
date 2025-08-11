import { SearchResult } from '../../shared/types';
import { promises as fs } from 'fs';
import { join } from 'path';

export class SearchManager {
  async searchFiles(query: string, path: string): Promise<string[]> {
    try {
      const allFiles = await this.getAllFilesRecursively(path);
      const searchRegex = new RegExp(query, 'i');
      
      return allFiles.filter(filePath => {
        const fileName = filePath.split('/').pop() || '';
        return searchRegex.test(fileName);
      });
    } catch (error) {
      console.error('File search error:', error);
      return [];
    }
  }

  async searchContent(query: string, path: string): Promise<SearchResult[]> {
    try {
      const allFiles = await this.getAllFilesRecursively(path);
      const results: SearchResult[] = [];
      const searchRegex = new RegExp(query, 'gi');

      // Limit search to reasonable file types
      const searchableFiles = allFiles.filter(file => 
        this.isSearchableFile(file)
      );

      for (const file of searchableFiles.slice(0, 50)) { // Limit for performance
        try {
          const content = await fs.readFile(file, 'utf-8');
          const lines = content.split('\n');
          
          lines.forEach((line, index) => {
            const matches = line.match(searchRegex);
            if (matches) {
              matches.forEach(match => {
                const column = line.indexOf(match);
                results.push({
                  file,
                  line: index + 1,
                  column,
                  content: line.trim(),
                  context: this.getContext(lines, index),
                  score: this.calculateRelevanceScore(match, query, line)
                });
              });
            }
          });
        } catch (err) {
          // Skip files that can't be read
          continue;
        }
      }

      // Sort by relevance score
      return results.sort((a, b) => (b.score || 0) - (a.score || 0));
    } catch (error) {
      console.error('Content search error:', error);
      return [];
    }
  }

  async searchSemantic(query: string, path: string): Promise<SearchResult[]> {
    // TODO: Implement semantic search using vector embeddings
    console.log('Semantic search request:', { query, path });
    
    // For now, fall back to content search
    return this.searchContent(query, path);
  }

  private async getAllFilesRecursively(directoryPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const items = await fs.readdir(directoryPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = join(directoryPath, item.name);
        
        if (item.isDirectory() && this.shouldSearchDirectory(item.name)) {
          const subFiles = await this.getAllFilesRecursively(fullPath);
          files.push(...subFiles);
        } else if (item.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return files;
  }

  private shouldSearchDirectory(dirName: string): boolean {
    const ignoredDirs = [
      'node_modules',
      '.git',
      '.vscode',
      '.idea',
      'dist',
      'build',
      'coverage',
      '.next',
      '.nuxt',
      '__pycache__',
      '.pytest_cache',
      'venv',
      'env'
    ];

    return !ignoredDirs.includes(dirName) && !dirName.startsWith('.');
  }

  private isSearchableFile(filePath: string): boolean {
    const searchableExtensions = [
      '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs',
      '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.html', '.css', '.scss',
      '.sass', '.less', '.json', '.xml', '.yaml', '.yml', '.md', '.txt',
      '.sh', '.bash', '.ps1', '.sql', '.r', '.m', '.h', '.hpp'
    ];

    const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    return searchableExtensions.includes(extension);
  }

  private getContext(lines: string[], lineIndex: number): string {
    const contextLines = 2;
    const start = Math.max(0, lineIndex - contextLines);
    const end = Math.min(lines.length, lineIndex + contextLines + 1);
    
    return lines.slice(start, end).join('\n');
  }

  private calculateRelevanceScore(match: string, query: string, line: string): number {
    let score = 0;
    
    // Exact match bonus
    if (match.toLowerCase() === query.toLowerCase()) {
      score += 10;
    }
    
    // Beginning of word bonus
    if (line.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      score += 5;
    }
    
    // Line length factor (shorter lines with matches are more relevant)
    score += Math.max(0, 50 - line.length) / 10;
    
    return score;
  }
}