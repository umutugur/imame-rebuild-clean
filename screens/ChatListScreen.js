// screens/ChatListScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const dummyChats = [
  { id: '1', name: 'Satıcı Ahmet' },
  { id: '2', name: 'Alıcı Elif' },
  { id: '3', name: 'Satıcı Mehmet' },
];

export default function ChatListScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { userName: item.name })}
    >
      <Text style={styles.chatName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyChats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff8e1',
  },
  chatItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  chatName: {
    fontSize: 18,
    color: '#4e342e',
  },
});
