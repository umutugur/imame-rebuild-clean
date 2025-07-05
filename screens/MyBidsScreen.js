import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function MyBidsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchBids();
    }
  }, [user]);

  const fetchBids = async () => {
    try {
      const res = await axios.get(`https://imame-backend.onrender.com/api/bids/user/${user._id}`);
      const allBids = res.data;

      // En son teklifleri mezat bazında grupla
      const grouped = allBids.reduce((acc, bid) => {
        const auctionId = bid.auction._id.toString();
        if (!acc[auctionId] || new Date(bid.createdAt) > new Date(acc[auctionId].createdAt)) {
          acc[auctionId] = bid;
        }
        return acc;
      }, {});

      const latestBids = Object.values(grouped);

      const bidsWithStatus = latestBids.map(bid => {
        // Bu mezata ait tüm teklifler
        const auctionBids = allBids
          .filter(b => b.auction._id.toString() === bid.auction._id.toString())
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const lastBid = auctionBids[auctionBids.length - 1];
        const currentUserId = user._id.toString();
        const isWinner = bid.auction.winner?.toString() === currentUserId;

        let statusText = isWinner ? 'Kazandınız' : 'Teklif Verildi';
        if (!isWinner && lastBid.user._id.toString() !== currentUserId) {
          statusText = 'Sizden sonra teklif verildi';
        }

        return {
          ...bid,
          statusText,
          isWinner,
          auctionCurrentPrice: bid.auction.currentPrice || bid.amount,
        };
      });

      setBids(bidsWithStatus);
    } catch (err) {
      console.error('Teklifler alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadReceipt = (auctionId) => {
    navigation.navigate('UploadReceipt', { auctionId });
  };

  const renderItem = ({ item }) => {
    const auctionImage = item.auction.images?.[0];

    return (
      <TouchableOpacity
        style={styles.bidItem}
        onPress={() => navigation.navigate('AuctionDetail', { auctionId: item.auction._id })}
      >
        {auctionImage && (
          <Image source={{ uri: auctionImage }} style={styles.auctionImage} />
        )}

        <View style={styles.rightContainer}>
          <Text style={[styles.title, { marginTop: 6 }]}>{item.auction.title}</Text>
          <Text style={[styles.amount, { marginTop: 6 }]}>
            {item.statusText === 'Sizden sonra teklif verildi' ? item.auctionCurrentPrice : item.amount} TL
          </Text>
          <Text
            style={[
              styles.status,
              {
                marginTop: 6,
                color:
                  item.isWinner
                    ? '#388e3c'
                    : item.statusText === 'Sizden sonra teklif verildi'
                      ? '#d32f2f'
                      : '#00796b',
              },
            ]}
          >
            {item.statusText}
          </Text>
          {item.isWinner && (
            <TouchableOpacity
              style={[styles.uploadButton, { marginTop: 10 }]}
              onPress={() => handleUploadReceipt(item.auction._id)}
            >
              <Text style={styles.uploadText}>Dekont Yükle</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6d4c41" />
        <Text>Teklifler yükleniyor...</Text>
      </View>
    );
  }

  if (bids.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz teklif vermediniz.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tekliflerim</Text>
      <FlatList
        data={bids}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8e1', padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 10,
    marginTop: 30,
  },
  bidItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  auctionImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  rightContainer: {
    flex: 1,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#3e2723' },
  amount: { fontSize: 14, color: '#6d4c41' },
  status: { fontSize: 14 },
  uploadButton: {
    paddingVertical: 6,
    backgroundColor: '#6d4c41',
    borderRadius: 8,
    width: 110,
    alignItems: 'center',
  },
  uploadText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});
