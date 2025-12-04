// New hearing form - simple

import { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function NewHearingScreen() {
  const router = useRouter();
  const { caseId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSave() {
    if (!title.trim() || !date.trim()) {
      Alert.alert('Error', 'Title and date are required');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('hearings').insert({
      case_id: caseId,
      title: title.trim(),
      date: date.trim(),
      time: time.trim() || null,
      location: location.trim() || null,
      notes: notes.trim() || null,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.back();
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} placeholder="First Hearing" value={title} onChangeText={setTitle} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} placeholder="2024-12-15" value={date} onChangeText={setDate} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Time (HH:MM)</Text>
        <TextInput style={styles.input} placeholder="10:30" value={time} onChangeText={setTime} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} placeholder="Court Room 5" value={location} onChangeText={setLocation} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>
        <TextInput style={[styles.input, { height: 80 }]} placeholder="Notes..." value={notes} onChangeText={setNotes} multiline />
      </View>

      <Pressable style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Add Hearing'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  field: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 40 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
