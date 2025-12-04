// Simple messaging hook with realtime

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Message } from '../types';

export function useMessages(recipientId: string, myId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();

    // Listen for new messages in realtime
    const channel = supabase
      .channel('messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as Message;
          // Only add if it's our conversation
          const isOurChat =
            (msg.sender_id === myId && msg.receiver_id === recipientId) ||
            (msg.sender_id === recipientId && msg.receiver_id === myId);

          if (isOurChat) {
            setMessages(prev => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, myId]);

  // Load all messages between two users
  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${myId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${myId})`)
      .order('created_at', { ascending: true });

    setMessages(data || []);
    setLoading(false);
  }

  // Send a message
  async function sendMessage(text: string) {
    const { data } = await supabase
      .from('messages')
      .insert({
        sender_id: myId,
        receiver_id: recipientId,
        content: text,
      })
      .select()
      .single();

    // Message will be added via realtime subscription
    return { data };
  }

  return { messages, loading, sendMessage, loadMessages };
}
