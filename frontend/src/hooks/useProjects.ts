import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface SavedProject {
  id: string;
  projectName: string;
  description: string;
  sections: Record<string, any>;
  updatedAt: number;
  deletedAt?: string | null;
}

export function useProjects() {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [trashedProjects, setTrashedProjects] = useState<SavedProject[]>([]);
  const { user } = useAuth();

  // Load from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setProjects([]);
      return;
    }
    
    const loadProjects = async () => {
      const { data, error } = await supabase
        .from('blueprints')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });
        
      if (error) {
        console.error("Failed to load projects from Supabase:", error);
      } else if (data) {
        setProjects(data.map(d => ({
          id: d.id,
          projectName: d.project_name,
          description: d.description,
          sections: d.sections,
          updatedAt: new Date(d.updated_at).getTime()
        })));
      }
    };
    
    loadProjects();
  }, [user]);

  const loadTrash = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .eq('user_id', user.id)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
      
    if (error) {
      console.error("Failed to load trash from Supabase:", error);
    } else if (data) {
      setTrashedProjects(data.map(d => ({
        id: d.id,
        projectName: d.project_name,
        description: d.description,
        sections: d.sections,
        updatedAt: new Date(d.updated_at).getTime(),
        deletedAt: d.deleted_at
      })));
    }
  };

  const saveProject = async (projectId: string | null, projectName: string, description: string, sections: Record<string, any>): Promise<string | null> => {
    if (!user) return null;
    
    // Check if we have an explicit ID, or fallback to matching name
    const existing = projectId 
      ? projects.find(p => p.id === projectId)
      : projects.find(p => p.projectName === projectName);
      
    const targetId = existing?.id || projectId;
    
    if (targetId) {
      const { error } = await supabase
        .from('blueprints')
        .update({
          description,
          sections,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Failed to update project in Supabase:", error);
        return targetId;
      }
      
      setProjects(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(p => p.id === targetId);
        if (idx >= 0) {
          copy[idx] = { ...copy[idx], description, sections, updatedAt: Date.now() };
          copy.sort((a, b) => b.updatedAt - a.updatedAt);
        }
        return copy;
      });
      return targetId;
    } else {
      const { data, error } = await supabase
        .from('blueprints')
        .insert({
          user_id: user.id,
          project_name: projectName,
          description,
          sections
        })
        .select()
        .single();
        
      if (error) {
        console.error("Failed to insert project into Supabase:", error);
        return null;
      }
      
      const newProj: SavedProject = {
        id: data.id,
        projectName: data.project_name,
        description: data.description,
        sections: data.sections,
        updatedAt: new Date(data.updated_at).getTime()
      };
      
      setProjects(prev => [newProj, ...prev]);
      return data.id;
    }
  };

  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    const { data, error } = await supabase
      .from('blueprints')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
      
    if (error) {
      console.error("Failed to trash project:", error);
      return { success: false, error: `Failed to delete project: ${error.message}. If it says column doesn't exist, please run the SQL command!` };
    }
    
    if (!data || data.length === 0) {
      return { success: false, error: "Failed to delete project: Could not find the project or permission denied." };
    }
    
    setProjects(prev => prev.filter(p => p.id !== id));
    return { success: true };
  };

  const restoreProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    const { data, error } = await supabase
      .from('blueprints')
      .update({ deleted_at: null })
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
      
    if (error) {
      console.error("Failed to restore project:", error);
      return { success: false, error: `Failed to restore project: ${error.message}` };
    }
    
    if (!data || data.length === 0) {
      return { success: false, error: "Failed to restore project: Could not find the project or permission denied." };
    }
    
    setTrashedProjects(prev => prev.filter(p => p.id !== id));
    // Optionally trigger a reload of projects, or we can just let it reload when they switch tabs
    const { data: fetchedData } = await supabase.from('blueprints').select('*').eq('id', id).single();
    if (fetchedData) {
      setProjects(prev => [{
        id: fetchedData.id,
        projectName: fetchedData.project_name,
        description: fetchedData.description,
        sections: fetchedData.sections,
        updatedAt: new Date(fetchedData.updated_at).getTime()
      }, ...prev].sort((a, b) => b.updatedAt - a.updatedAt));
    }
    
    return { success: true };
  };

  const permanentlyDeleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    const { error } = await supabase
      .from('blueprints')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error("Failed to permanently delete project:", error);
      return { success: false, error: `Failed to permanently delete project: ${error.message}` };
    }
    
    setTrashedProjects(prev => prev.filter(p => p.id !== id));
    return { success: true };
  };

  const getProject = async (id: string): Promise<SavedProject | null> => {
    // Try to find it in memory first
    const memoryProject = projects.find(p => p.id === id);
    if (memoryProject) return memoryProject;
    
    // Fallback to fetching it
    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    
    return {
      id: data.id,
      projectName: data.project_name,
      description: data.description,
      sections: data.sections,
      updatedAt: new Date(data.updated_at).getTime(),
      deletedAt: data.deleted_at
    };
  };

  return { projects, trashedProjects, saveProject, deleteProject, restoreProject, permanentlyDeleteProject, loadTrash, getProject };
}
