// Case detail screen - simple view

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState(null);
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCase();
    loadHearings();
  }, [id]);

  async function loadCase() {
    const { data } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();
    setCaseData(data);
    setLoading(false);
  }

  async function loadHearings() {
    const { data } = await supabase
      .from('hearings')
      .select('*')
      .eq('case_id', id)
      .order('date', { ascending: true });
    setHearings(data || []);
  }

  async function handleDelete() {
    Alert.alert('Delete Case', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('cases').delete().eq('id', id);
          router.back();
        },
      },
    ]);
  }

  if (loading || !caseData) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>{caseData.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{caseData.stage}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>
        {caseData.case_number && (
          <Text style={styles.info}>Case #: {caseData.case_number}</Text>
        )}
        {caseData.court && (
          <Text style={styles.info}>Court: {caseData.court}</Text>
        )}
      </View>

      {/* Parties */}
      {caseData.parties && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parties</Text>
          {caseData.parties.petitioners?.length > 0 && (
            <View>
              <Text style={styles.partyLabel}>Petitioners:</Text>
              {caseData.parties.petitioners.map((p, i) => (
                <Text key={i} style={styles.partyName}>• {p}</Text>
              ))}
            </View>
          )}
          {caseData.parties.respondents?.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.partyLabel}>Respondents:</Text>
              {caseData.parties.respondents.map((p, i) => (
                <Text key={i} style={styles.partyName}>• {p}</Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Notes */}
      {caseData.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{caseData.notes}</Text>
        </View>
      )}

      {/* Hearings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hearings</Text>
          <Pressable onPress={() => router.push({ pathname: '/hearing/new', params: { caseId: id } })}>
            <Ionicons name="add-circle" size={24} color="#2563eb" />
          </Pressable>
        </View>
        {hearings.length === 0 ? (
          <Text style={styles.empty}>No hearings yet</Text>
        ) : (
          hearings.map((h) => (
            <View key={h.id} style={styles.hearingCard}>
              <Text style={styles.hearingTitle}>{h.title}</Text>
              <Text style={styles.hearingDate}>{h.date} {h.time && `at ${h.time}`}</Text>
            </View>
          ))
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Delete Case</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: 'white', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  badge: { backgroundColor: '#e0e7ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4, alignSelf: 'flex-start' },
  badgeText: { color: '#4338ca', fontWeight: '500' },
  section: { backgroundColor: 'white', padding: 16, marginTop: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  info: { color: '#666', marginBottom: 4 },
  partyLabel: { fontWeight: '500', marginBottom: 4 },
  partyName: { color: '#666', marginLeft: 8 },
  notes: { color: '#444', lineHeight: 22 },
  empty: { color: '#999', fontStyle: 'italic' },
  hearingCard: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 6, marginBottom: 8 },
  hearingTitle: { fontWeight: '500' },
  hearingDate: { color: '#2563eb', marginTop: 4 },
  actions: { padding: 16 },
  deleteBtn: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#ef4444', alignItems: 'center' },
  deleteBtnText: { color: '#ef4444', fontWeight: '600' },
});
