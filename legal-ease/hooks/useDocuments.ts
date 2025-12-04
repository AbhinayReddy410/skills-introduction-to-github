// Simple document upload hook

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Document } from '../types';

export function useDocuments(caseId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load documents for a case
  async function loadDocuments() {
    setLoading(true);
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    setDocuments(data || []);
    setLoading(false);
  }

  // Pick and upload a file
  async function uploadFile() {
    // Let user pick a file
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
    });

    if (result.canceled) return { error: 'Cancelled' };

    setUploading(true);
    const file = result.assets[0];

    try {
      // Read file
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create path
      const path = `${caseId}/${Date.now()}_${file.name}`;

      // Upload to storage
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      await supabase.storage.from('documents').upload(path, bytes);

      // Save to database
      const { data } = await supabase
        .from('documents')
        .insert({
          case_id: caseId,
          name: file.name,
          file_path: path,
          file_type: file.mimeType,
        })
        .select()
        .single();

      if (data) {
        setDocuments([data, ...documents]);
      }

      setUploading(false);
      return { data };
    } catch (error) {
      setUploading(false);
      return { error };
    }
  }

  // Delete a document
  async function deleteFile(id: string, path: string) {
    await supabase.storage.from('documents').remove([path]);
    await supabase.from('documents').delete().eq('id', id);
    setDocuments(documents.filter(d => d.id !== id));
  }

  return { documents, loading, uploading, loadDocuments, uploadFile, deleteFile };
}
