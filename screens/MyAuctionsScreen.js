import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function AuctionDetailScreen({ route }) {
  const { auctionId } = route.params;
  const { user } = useContext(AuthContext);

  const [auction, setAuction] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [selectedIncrement, setSelectedIncrement] = useState(10);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuction = async () => {
    try {
      const res = await fetch(`https://imame-backend.onrender.com/api/auctions/${auctionId}`);
      const data = await res.json();
      setAuction(data);
      setCurrentPrice(data.currentPrice || data.startingPrice);
    } catch (err) {
      Alert.alert('Hata', 'Mezat bilgisi alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const res = await fetch(`https://imame-backend.onrender.com/api/bids/${auctionId}`);
      const data = await res.json();
      setBids(data);
    } catch (err) {
      Alert.alert('Hata', 'Teklifler yüklenemedi');
    }
  };

  useEffect(() => {
    fetchAuction();
    fetchBids();
  }, []);

  const handleBid = async () => {
    const newAmount = currentPrice + selectedIncrement;

    // Adres kontrolü (alıcı için)
    if (user.role === 'buyer' && (!user.address || user.address.trim() === '')) {
      Alert.alert(
        'Adres Gerekli',
        'Teklif verebilmek için profilinize adres bilgisi eklemelisiniz.'
      );
      return;
    }

    if (bids.length > 0) {
      const lastBidUserId = bids[0].user?._id;
      if (lastBidUserId === user._id) {
        Alert.alert("Hatalı İşlem", "Son teklifi zaten siz verdiniz.");
        return;
      }
    }

    try {
      const res = await fetch(`https://imame-backend.onrender.com/api/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auctionId,
          userId: user._id,
          amount: newAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Teklif başarısız');

      Alert.alert('Tebrikler', `Yeni teklif verdiniz: ${newAmount}₺`);
      setCurrentPrice(newAmount);
      fetchBids();
    } catch (err) {
      Alert.alert('Hata', err.message);
    }
  };

  if (loading || !auction) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6d4c41" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Görseller */}
      <FlatList
        data={auction.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.sliderImage} />
        )}
        style={styles.sliderContainer}
      />

      {/* Usta İmzalı Rozeti */}
      {auction.isSigned && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✒️ Usta İmzalı</Text>
        </View>
      )}

      {/* Bilgiler */}
      <Text style={styles.title}>{auction.title}</Text>
      <Text style={styles.seller}>Satıcı: {auction.seller?.companyName || 'Bilinmiyor'}</Text>
      <Text style={styles.description}>{auction.description}</Text>
      <Text style={styles.price}>Güncel Fiyat: {currentPrice}₺</Text>

      {/* Teklif artış butonları */}
      <View style={styles.incrementContainer}>
        {[10, 20, 30, 40, 50].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.incrementButton,
              selectedIncrement === amount && styles.selectedIncrement,
            ]}
            onPress={() => setSelectedIncrement(amount)}
          >
            <Text style={styles.incrementText}>+{amount}₺</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Teklif Ver Butonu */}
      <TouchableOpacity style={styles.bidButton} onPress={handleBid}>
        <Text style={styles.bidButtonText}>Teklif Ver</Text>
      </TouchableOpacity>

      {/* Teklif Geçmişi */}
      <Text style={styles.bidsTitle}>Önceki Teklifler</Text>
      {bids.length > 0 ? (
        bids.map((item) => (
          <View key={item._id} style={styles.bidItem}>
            <Text style={styles.bidUser}>{item.user?.name || 'Anonim'}</Text>
            <Text style={styles.bidAmount}>{item.amount}₺</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: '#4e342e', fontStyle: 'italic' }}>Henüz teklif yok.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff8e1' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sliderContainer: { marginBottom: 12 },
  sliderImage: {
    width: Dimensions.get('window').width - 32,
    height: 240,
    borderRadius: 10,
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#4e342e',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4e342e', marginBottom: 4 },
  seller: { fontSize: 16, color: '#6d4c41', marginBottom: 4 },
  description: { fontSize: 15, color: '#4e342e', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32', marginBottom: 12 },
  incrementContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  incrementButton: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#d7ccc8', borderRadius: 8 },
  selectedIncrement: { backgroundColor: '#6d4c41' },
  incrementText: { color: '#fff', fontWeight: 'bold' },
  bidButton: { backgroundColor: '#4e342e', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  bidButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bidsTitle: { fontSize: 18, fontWeight: 'bold', color: '#4e342e', marginBottom: 8 },
  bidItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  bidUser: { fontWeight: 'bold', color: '#5d4037' },
  bidAmount: { color: '#2e7d32' },
});
