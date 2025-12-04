// Simple cases hook - CRUD operations

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Case } from '../types';

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all cases when hook is used
  useEffect(() => {
    loadCases();
  }, []);

  // Get all cases
  async function loadCases() {
    setLoading(true);
    const { data } = await supabase
      .from('cases')
      .select('*')
      .order('updated_at', { ascending: false });

    setCases(data || []);
    setLoading(false);
  }

  // Create new case
  async function addCase(newCase: Partial<Case>) {
    const { data, error } = await supabase
      .from('cases')
      .insert(newCase)
      .select()
      .single();

    if (data) {
      setCases([data, ...cases]);
    }
    return { data, error };
  }

  // Update existing case
  async function editCase(id: string, updates: Partial<Case>) {
    const { data, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (data) {
      setCases(cases.map(c => c.id === id ? data : c));
    }
    return { data, error };
  }

  // Delete case
  async function removeCase(id: string) {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);

    if (!error) {
      setCases(cases.filter(c => c.id !== id));
    }
    return { error };
  }

  // Search cases
  async function searchCases(term: string) {
    const { data } = await supabase
      .rpc('search_cases', { search_term: term });
    return data || [];
  }

  return { cases, loading, loadCases, addCase, editCase, removeCase, searchCases };
}
