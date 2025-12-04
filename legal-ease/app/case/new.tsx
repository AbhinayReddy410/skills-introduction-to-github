// New case form - simple

import { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const STAGES = ['Filing', 'Notice', 'Evidence', 'Arguments', 'Reserved', 'Decided'];

export default function NewCaseScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Simple form state
  const [title, setTitle] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [court, setCourt] = useState('');
  const [stage, setStage] = useState('Filing');
  const [notes, setNotes] = useState('');
  const [petitioners, setPetitioners] = useState(['']);
  const [respondents, setRespondents] = useState(['']);

  // Add party field
  function addPetitioner() {
    setPetitioners([...petitioners, '']);
  }
  function addRespondent() {
    setRespondents([...respondents, '']);
  }

  // Update party field
  function updatePetitioner(index, value) {
    const updated = [...petitioners];
    updated[index] = value;
    setPetitioners(updated);
  }
  function updateRespondent(index, value) {
    const updated = [...respondents];
    updated[index] = value;
    setRespondents(updated);
  }

  // Save case
  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('cases').insert({
      advocate_id: user?.id,
      title: title.trim(),
      case_number: caseNumber.trim() || null,
      court: court.trim() || null,
      stage,
      notes: notes.trim() || null,
      parties: {
        petitioners: petitioners.filter(p => p.trim()),
        respondents: respondents.filter(p => p.trim()),
      },
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
      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Case Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Smith vs. Johnson"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Case Number */}
      <View style={styles.field}>
        <Text style={styles.label}>Case Number</Text>
        <TextInput
          style={styles.input}
          placeholder="CIV-2024-001"
          value={caseNumber}
          onChangeText={setCaseNumber}
        />
      </View>

      {/* Court */}
      <View style={styles.field}>
        <Text style={styles.label}>Court</Text>
        <TextInput
          style={styles.input}
          placeholder="District Court"
          value={court}
          onChangeText={setCourt}
        />
      </View>

      {/* Stage */}
      <View style={styles.field}>
        <Text style={styles.label}>Stage</Text>
        <View style={styles.chips}>
          {STAGES.map((s) => (
            <Pressable
              key={s}
              style={[styles.chip, stage === s && styles.chipActive]}
              onPress={() => setStage(s)}
            >
              <Text style={[styles.chipText, stage === s && { color: 'white' }]}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Petitioners */}
      <View style={styles.field}>
        <View style={styles.fieldHeader}>
          <Text style={styles.label}>Petitioners</Text>
          <Pressable onPress={addPetitioner}>
            <Ionicons name="add-circle" size={24} color="#2563eb" />
          </Pressable>
        </View>
        {petitioners.map((p, i) => (
          <TextInput
            key={i}
            style={[styles.input, { marginBottom: 8 }]}
            placeholder={`Petitioner ${i + 1}`}
            value={p}
            onChangeText={(v) => updatePetitioner(i, v)}
          />
        ))}
      </View>

      {/* Respondents */}
      <View style={styles.field}>
        <View style={styles.fieldHeader}>
          <Text style={styles.label}>Respondents</Text>
          <Pressable onPress={addRespondent}>
            <Ionicons name="add-circle" size={24} color="#2563eb" />
          </Pressable>
        </View>
        {respondents.map((p, i) => (
          <TextInput
            key={i}
            style={[styles.input, { marginBottom: 8 }]}
            placeholder={`Respondent ${i + 1}`}
            value={p}
            onChangeText={(v) => updateRespondent(i, v)}
          />
        ))}
      </View>

      {/* Notes */}
      <View style={styles.field}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Additional notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* Save Button */}
      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Case'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  field: { marginBottom: 20 },
  fieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, fontSize: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd' },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { color: '#666' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 40 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
