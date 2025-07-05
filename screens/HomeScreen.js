import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [auctions, setAuctions] = useState([]);

  const fetchAuctions = async () => {
    try {
      const res = await axios.get('https://imame-backend.onrender.com/api/auctions/all');
      setAuctions(res.data);
    } catch (err) {
      console.log('Mezatlar alınamadı:', err.message);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchAuctions();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AuctionDetail', { auctionId: item._id })}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/200' }}
          style={styles.image}
        />
        {item.isSigned && (
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>✒️ Usta İmzalı</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.currentPrice || item.startingPrice}₺</Text>
        <Text style={styles.seller}>{item.seller?.companyName || 'Firma Bilinmiyor'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={auctions}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2} // ✅ 2 sütunlu görünüm
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8e1' },
  list: { padding: 12 },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ribbon: {
  position: 'absolute',
  top: 6,
  right: 6,
  backgroundColor: '#4e342e',
  paddingVertical: 4,
  paddingHorizontal: 8, // artırıldı
  borderRadius: 6,
  maxWidth: '90%',      // güvenlik önlemi
},
ribbonText: {
  color: '#fff',
  fontSize: 12,         // biraz büyütüldü
  fontWeight: 'bold',
},

  info: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4e342e',
  },
  price: {
    fontSize: 13,
    color: '#2e7d32',
    marginTop: 4,
    fontWeight: 'bold',
  },
  seller: {
    fontSize: 12,
    color: '#6d4c41',
    marginTop: 2,
  },
});
