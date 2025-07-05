import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ChatScreen = ({ route }) => {
  const { userName } = route.params;

  // Bu kısmı gerçek veritabanına bağladığımızda değiştireceğiz
  const messages = [
    { id: '1', text: `Merhaba, ben ${userName}`, sender: userName },
    { id: '2', text: 'Tesbih ile ilgili bilgi alabilir miyim?', sender: 'Ben' },
    { id: '3', text: 'Tabii, ne öğrenmek istersiniz?', sender: userName },
  ];

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === 'Ben' ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{userName} ile Sohbet</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
        inverted
      />
      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder="Mesaj yaz..." />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#6d4c41',
    color: '#fff',
    textAlign: 'center',
  },
  chatArea: {
    flex: 1,
    padding: 10,
  },
  message: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: '#dcedc8',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#ffe0b2',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#6d4c41',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
