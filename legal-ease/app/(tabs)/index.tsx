// Cases list - main home screen

import { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCases } from '../../hooks/useCases';

export default function CasesScreen() {
  const router = useRouter();
  const { cases, loading, loadCases } = useCases();
  const [search, setSearch] = useState('');

  // Filter cases by search term
  const filtered = cases.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.case_number?.toLowerCase().includes(search.toLowerCase()) ||
    c.court?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cases..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Cases List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCases} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/case/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <View style={[styles.badge, getBadgeColor(item.stage)]}>
                <Text style={styles.badgeText}>{item.stage}</Text>
              </View>
            </View>

            {item.case_number && (
              <Text style={styles.detail}>Case #: {item.case_number}</Text>
            )}
            {item.court && (
              <Text style={styles.detail}>Court: {item.court}</Text>
            )}

            <View style={styles.footer}>
              <Text style={styles.date}>
                Updated {new Date(item.updated_at).toLocaleDateString()}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="briefcase-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No cases yet</Text>
            <Text style={styles.emptySubtext}>Tap + to create your first case</Text>
          </View>
        }
      />

      {/* Add Button */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/case/new')}
      >
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </View>
  );
}

// Get badge color based on stage
function getBadgeColor(stage: string) {
  const colors = {
    Filing: { backgroundColor: '#e0e7ff' },
    Notice: { backgroundColor: '#dbeafe' },
    Evidence: { backgroundColor: '#fef3c7' },
    Arguments: { backgroundColor: '#fed7aa' },
    Reserved: { backgroundColor: '#e9d5ff' },
    Decided: { backgroundColor: '#dcfce7' },
  };
  return colors[stage] || { backgroundColor: '#f3f4f6' };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  searchInput: { flex: 1, fontSize: 16 },
  list: { padding: 16 },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e5e5e5' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 12, fontWeight: '500', color: '#4338ca' },
  detail: { color: '#666', fontSize: 14, marginBottom: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  date: { color: '#999', fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 },
  emptySubtext: { color: '#999', marginTop: 4 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
});
