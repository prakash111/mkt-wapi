import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { ListRow } from '@/components/ListRow';
import { Button } from '@/components/Button';
import { Body, Caption, Subtitle, Title } from '@/components/Typography';
import { SectionCard } from '@/components/SectionCard';
import { createContact, getContacts, updateContact } from '@/services/api/modules';
import { extractArray } from '@/utils/helpers';
import type { Contact } from '@/types';
import { palette, spacing } from '@/theme';

export function ContactsScreen() {
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const contactsQuery = useQuery({
    queryKey: ['contacts', search],
    queryFn: () => getContacts(search ? { search } : undefined),
  });

  const data = useMemo(() => extractArray<Contact>(contactsQuery.data, ['data']), [contactsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { name, phone_number: phone, email };
      if (editing?._id || editing?.id) {
        return updateContact((editing._id || editing.id) as string, payload);
      }
      return createContact(payload);
    },
    onSuccess: () => {
      setEditorOpen(false);
      setEditing(null);
      setName('');
      setPhone('');
      setEmail('');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: any) => {
      Alert.alert('Unable to save', error?.message || 'Contact save failed');
    },
  });

  const openEditor = (contact?: Contact) => {
    setEditing(contact || null);
    setName(contact?.name || '');
    setPhone(contact?.phone_number || '');
    setEmail(contact?.email || '');
    setEditorOpen(true);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Contacts</Title>
        <TextField value={search} onChangeText={setSearch} placeholder="Search contacts" />
        <Button title="Add Contact" onPress={() => openEditor()} />
      </View>

      {contactsQuery.isLoading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item._id || item.id || `contact-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListRow
              title={item.name || item.phone_number || 'Unknown contact'}
              subtitle={item.email || item.phone_number}
              meta={item.chat_status}
              onPress={() => openEditor(item)}
            />
          )}
          ListEmptyComponent={<Body>No contacts found.</Body>}
        />
      )}

      <Modal visible={editorOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <SectionCard style={styles.modalCard}>
            <Subtitle>{editing ? 'Edit contact' : 'Create contact'}</Subtitle>
            <Caption>Basic fields map directly to your existing backend contact endpoints.</Caption>
            <TextField placeholder="Name" value={name} onChangeText={setName} />
            <TextField placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextField placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="secondary" onPress={() => setEditorOpen(false)} />
              <Button
                title={saveMutation.isPending ? 'Saving...' : 'Save'}
                disabled={saveMutation.isPending}
                onPress={() => saveMutation.mutate()}
              />
            </View>
          </SectionCard>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing(1.5),
    marginBottom: spacing(1.5),
  },
  list: {
    gap: spacing(1),
    paddingBottom: spacing(4),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'flex-end',
    padding: spacing(2),
  },
  modalCard: {
    gap: spacing(1.25),
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing(1),
  },
});
