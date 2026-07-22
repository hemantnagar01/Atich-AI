import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase';

export const sharedRouter = Router();

sharedRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Use the admin client to bypass RLS, allowing public access by ID
    const { data, error } = await supabaseAdmin
      .from('blueprints')
      .select('project_name, description, sections')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
      
    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch blueprint' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Blueprint not found' });
    }
    
    res.json(data);
  } catch (error: any) {
    console.error('Shared route error:', error);
    res.status(500).json({ error: error.message });
  }
});
