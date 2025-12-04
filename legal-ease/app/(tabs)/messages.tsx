// Simple messages list

import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadConversations() {
    if (!user) return;
    setLoading(true);

    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(full_name), receiver:profiles!receiver_id(full_name)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    // Group by conversation partner
    const convos = new Map();
    data?.forEach((msg) => {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      const partnerName = msg.sender_id === user.id ? msg.receiver?.full_name : msg.sender?.full_name;

      if (!convos.has(partnerId)) {
        convos.set(partnerId, {
          id: partnerId,
          name: partnerName || 'Unknown',
          lastMessage: msg.content,
          unread: !msg.read && msg.receiver_id === user.id,
          time: new Date(msg.created_at).toLocaleDateString(),
        });
      }
    });

    setConversations(Array.from(convos.values()));
    setLoading(false);
  }

  useEffect(() => {
    loadConversations();
  }, [user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadConversations} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/chat/${item.id}`)}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text style={[styles.name, item.unread && { fontWeight: '700' }]}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.message} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            {item.unread && <View style={styles.dot} />}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e5e5' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '500' },
  time: { fontSize: 12, color: '#999' },
  message: { color: '#666', marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563eb' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#999', marginTop: 12 },
});
