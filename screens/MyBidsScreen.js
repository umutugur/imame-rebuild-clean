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
    if (user?._id) fetchBids();
  }, [user]);

  const fetchBids = async () => {
    try {
      const res = await axios.get(`https://imame-backend.onrender.com/api/bids/user/${user._id}`);
      const allBids = res.data;

      // Grupla: her mezata kendi son teklifin
      const grouped = allBids.reduce((acc, bid) => {
        const auctionId = bid.auction._id.toString();
        if (!acc[auctionId] || new Date(bid.createdAt) > new Date(acc[auctionId].createdAt)) {
          acc[auctionId] = bid;
        }
        return acc;
      }, {});

      const auctionIds = Object.keys(grouped);

      const bidsWithStatus = auctionIds.map((auctionId) => {
        const myBid = grouped[auctionId];
        const auctionCurrentPrice = myBid.auction.currentPrice || myBid.amount;
        const allBidsForThisAuction = allBids.filter(b => b.auction._id.toString() === auctionId);
        const sortedBids = allBidsForThisAuction.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const lastBid = sortedBids[sortedBids.length - 1];
        const currentUserId = user._id.toString();
        const isWinner = myBid.auction.winner?.toString() === currentUserId;

        let statusText = isWinner ? 'Kazandınız' : '';
        let isAfterYou = false;

        if (!isWinner && lastBid && lastBid.user._id.toString() !== currentUserId) {
          statusText = 'Sizden sonra teklif verildi';
          isAfterYou = true;
        }

        return {
          ...myBid,
          statusText,
          isAfterYou,
          isWinner,
          auctionCurrentPrice,
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
          <Text style={[styles.title]}>{item.auction.title}</Text>

          <Text
            style={[
              styles.amount,
              item.isAfterYou ? styles.redAmount : item.isWinner ? styles.greenAmount : styles.normalAmount,
            ]}
          >
            {item.isAfterYou ? item.auctionCurrentPrice : item.amount} TL
          </Text>

          {item.isAfterYou && (
            <Text style={styles.redWarning}>Sizden sonra teklif verildi</Text>
          )}
          {item.isWinner && (
            <Text style={styles.greenStatus}>Kazandınız</Text>
          )}

          {item.isWinner && (
            <TouchableOpacity
              style={styles.uploadButton}
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
  title: { fontSize: 16, fontWeight: 'bold', color: '#3e2723', marginTop: 6 },
  amount: { fontSize: 15, fontWeight: 'bold', marginTop: 6 },
  normalAmount: { color: '#6d4c41' },
  redAmount: { color: '#d32f2f' },
  greenAmount: { color: '#388e3c' },
  redWarning: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 6,
    fontSize: 14,
    backgroundColor: '#ffebee',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  greenStatus: {
    color: '#388e3c',
    fontWeight: 'bold',
    marginTop: 6,
    fontSize: 14,
    backgroundColor: '#e8f5e9',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  uploadButton: {
    paddingVertical: 6,
    backgroundColor: '#6d4c41',
    borderRadius: 8,
    width: 110,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});
