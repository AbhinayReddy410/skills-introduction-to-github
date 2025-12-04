// Simple calendar/hearings list

import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

export default function CalendarScreen() {
  const router = useRouter();
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load upcoming hearings
  async function loadHearings() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('hearings')
      .select('*, cases(title)')
      .gte('date', today)
      .order('date', { ascending: true });

    setHearings(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadHearings();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <FlatList
        data={hearings}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadHearings} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isToday = item.date === today;
          return (
            <Pressable
              style={[styles.card, isToday && styles.cardToday]}
              onPress={() => router.push(`/case/${item.case_id}`)}
            >
              <View style={styles.dateBox}>
                <Text style={styles.dateText}>{item.date}</Text>
                {item.time && <Text style={styles.timeText}>{item.time}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.caseTitle}>{item.cases?.title}</Text>
                {item.location && <Text style={styles.location}>{item.location}</Text>}
              </View>
              {isToday && (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayText}>Today</Text>
                </View>
              )}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No upcoming hearings</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', borderWidth: 1, borderColor: '#e5e5e5' },
  cardToday: { borderColor: '#2563eb', borderWidth: 2 },
  dateBox: { marginRight: 16, alignItems: 'center', minWidth: 60 },
  dateText: { fontWeight: '600', color: '#2563eb', fontSize: 12 },
  timeText: { color: '#666', fontSize: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  caseTitle: { color: '#666', marginTop: 2 },
  location: { color: '#999', fontSize: 13, marginTop: 2 },
  todayBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  todayText: { color: '#16a34a', fontSize: 12, fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#999', marginTop: 12 },
});
