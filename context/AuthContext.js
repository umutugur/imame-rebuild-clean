import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Google Sign-In ayarı (app yüklenirken)
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '10042514664-hd90v340a3tltvqte7pho0dttfuplio0.apps.googleusercontent.com', // <-- Firebase'den Web Client ID
      offlineAccess: false,
    });
  }, []);

  // ✅ Push bildirim token'ı kaydet
  const registerForPushNotificationsAsync = async (userId) => {
    try {
      if (!Device.isDevice) return;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = tokenData.data;

      await axios.post('https://imame-backend.onrender.com/api/users/update-token', {
        userId,
        pushToken: expoPushToken,
      });
    } catch (err) {
      console.error('Push token kaydedilemedi:', err);
    }
  };

  // ✅ Google Login
  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.idToken;
      const credential = GoogleAuthProvider.credential(idToken);

      const firebaseUserCredential = await signInWithCredential(auth, credential);
      const firebaseUser = firebaseUserCredential.user;

      // ✅ backend'e kayıt veya giriş
      const res = await axios.post('https://imame-backend.onrender.com/api/auth/social-login', {
  idToken,
});

const userData = res.data.user;

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await registerForPushNotificationsAsync(userData._id);

    } catch (err) {
      console.error('Google Sign-In hatası:', err);
    }
  };

  // ✅ Normal email login
  const login = async (email, password) => {
    try {
      const res = await axios.post('https://imame-backend.onrender.com/api/auth/login', { email, password });
      const userData = res.data.user;
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await registerForPushNotificationsAsync(userData._id);
    } catch (err) {
      console.error('Giriş başarısız:', err.response?.data || err.message);
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await GoogleSignin.signOut();
    } catch (err) {
      console.error('Google SignOut hatası:', err);
    }
  };

  // ✅ Profil güncelle
  const updateUser = async (updatedFields) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(
        'https://imame-backend.onrender.com/api/auth/update-profile',
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = res.data.user;
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Profil güncelleme hatası:', err.response?.data || err.message);
    }
  };

  // ✅ Local storage'dan kullanıcıyı yükle
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          await registerForPushNotificationsAsync(parsed._id);
        }
      } catch (err) {
        setUser(null);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        googleLogin,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
