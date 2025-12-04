// Simple settings screen

import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  // Export data as JSON
  async function handleExport() {
    const { data: cases } = await supabase.from('cases').select('*');
    const { data: hearings } = await supabase.from('hearings').select('*');

    const backup = {
      exported_at: new Date().toISOString(),
      cases: cases || [],
      hearings: hearings || [],
    };

    console.log('Backup:', JSON.stringify(backup, null, 2));
    Alert.alert('Export Complete', `Exported ${cases?.length || 0} cases`);
  }

  // Sign out with confirmation
  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', onPress: signOut },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* Profile */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#666" />
        </View>
        <View>
          <Text style={styles.name}>{user?.full_name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.role}>{user?.role}</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <MenuItem icon="person-outline" label="Edit Profile" />
        <MenuItem icon="notifications-outline" label="Notifications" />
        <MenuItem icon="download-outline" label="Export Data" onPress={handleExport} />
        <MenuItem icon="help-circle-outline" label="Help" />
      </View>

      {/* Sign Out */}
      <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#333" />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profile: { backgroundColor: 'white', padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: '600' },
  email: { color: '#666', marginTop: 2 },
  role: { color: '#2563eb', fontSize: 13, marginTop: 2, textTransform: 'capitalize' },
  menu: { backgroundColor: 'white', marginTop: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', gap: 12 },
  menuLabel: { flex: 1, fontSize: 16 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, marginTop: 20, backgroundColor: 'white' },
  signOutText: { color: '#ef4444', fontSize: 16, fontWeight: '500' },
  version: { textAlign: 'center', color: '#999', marginTop: 20 },
});
