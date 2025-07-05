import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function AddSellerScreen() {
  const [seller, setSeller] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    iban: '',
    ibanName: '',
    bankName: '',
  });

  const handleChange = (key, value) => {
    setSeller((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!seller.companyName || !seller.email || !seller.password) {
      return Alert.alert('Hata', 'Firma adı, e-posta ve şifre zorunludur.');
    }

    try {
      const res = await fetch('https://imame-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...seller,
          role: 'seller',
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Satıcı kaydı başarısız');

      Alert.alert('Başarılı', 'Satıcı başarıyla eklendi.');
      setSeller({
        companyName: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        iban: '',
        ibanName: '',
        bankName: '',
      });
    } catch (err) {
      Alert.alert('Hata', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Yeni Satıcı Ekle</Text>

      {[ 
        { label: 'Firma Adı', key: 'companyName' },
        { label: 'Yetkili Adı Soyadı', key: 'name' },
        { label: 'E-posta', key: 'email' },
        { label: 'Şifre', key: 'password' },
        { label: 'Telefon Numarası', key: 'phone' },
        { label: 'Adres', key: 'address' },
        { label: 'IBAN', key: 'iban' },
        { label: 'IBAN Sahibi', key: 'ibanName' },
        { label: 'Banka Adı', key: 'bankName' },
      ].map(({ label, key }) => (
        <TextInput
          key={key}
          placeholder={label}
          value={seller[key]}
          onChangeText={(text) => handleChange(key, text)}
          secureTextEntry={key === 'password'}
          style={styles.input}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Satıcıyı Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff8e1',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6d4c41',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
