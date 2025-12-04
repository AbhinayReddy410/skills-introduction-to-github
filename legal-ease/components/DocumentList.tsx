// Simple document list component

import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDocuments } from '../hooks/useDocuments';

export function DocumentList({ caseId }) {
  const { documents, loading, uploading, loadDocuments, uploadFile, deleteFile } = useDocuments(caseId);

  useEffect(() => {
    loadDocuments();
  }, [caseId]);

  function handleDelete(id, path, name) {
    Alert.alert('Delete', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteFile(id, path) },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <Pressable style={styles.uploadBtn} onPress={uploadFile} disabled={uploading}>
          <Ionicons name={uploading ? 'hourglass' : 'cloud-upload'} size={18} color="white" />
          <Text style={styles.uploadText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
        </Pressable>
      </View>

      {documents.length === 0 ? (
        <Text style={styles.empty}>No documents</Text>
      ) : (
        documents.map((doc) => (
          <View key={doc.id} style={styles.docItem}>
            <Ionicons name="document-text" size={24} color="#2563eb" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
              <Text style={styles.docDate}>{new Date(doc.created_at).toLocaleDateString()}</Text>
            </View>
            <Pressable onPress={() => handleDelete(doc.id, doc.file_path, doc.name)}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', padding: 16, marginTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  uploadText: { color: 'white', fontWeight: '500' },
  empty: { color: '#999', fontStyle: 'italic' },
  docItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  docName: { fontWeight: '500' },
  docDate: { color: '#999', fontSize: 12, marginTop: 2 },
});
