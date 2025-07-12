// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';
import { makeRedirectUri } from 'expo-auth-session';
import * as Device from 'expo-device';

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
 const redirectUri = makeRedirectUri({
  scheme: 'imame', // app.config.js içinde 'imame' olarak tanımlı
  path: 'redirect',
  useProxy:false
});


  // Push notification token kaydı
  const registerForPushNotificationsAsync = async (userId) => {
    try {
      alert('[DEBUG] registerForPushNotificationsAsync ÇAĞRILDI. userId: ' + userId);

      if (!Device.isDevice) {
        alert('[DEBUG] Device.isDevice false!');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      alert('[DEBUG] Notification status: ' + existingStatus);

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        alert('[DEBUG] Permission SONUCU: ' + finalStatus);
      }
      if (finalStatus !== 'granted') {
        alert('[DEBUG] Bildirim izni yok, push token alınamadı.');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = tokenData.data;

      alert('[DEBUG] Expo Push Token üretildi: ' + expoPushToken);

      // Backend'e gönder
      const response = await axios.post('https://imame-backend.onrender.com/api/users/update-token', {
        userId,
        pushToken: expoPushToken,
      });

      alert('[DEBUG] Backend\'e token gönderildi: ' + response.data.message);
    } catch (err) {
      alert('❌ Push token kaydedilemedi: ' + (err.response?.data?.message || err.message));
      console.error('❌ Push token kaydedilemedi:', err.message);
    }
  };

  const [requestGoogle, responseGoogle, promptGoogle] = Google.useAuthRequest({
    /// expoClientId: '731274011151-ce78qup9757gfive4bb1rsojnc91sc3b.apps.googleusercontent.com',
    clientId: '731274011151-suq1e846ecuenurt0lnam9poe8u43o1t.apps.googleusercontent.com',
    /// webClientId: '731274011151-nq9i17bc2km1e7uq8utcbk49fkjoahob.apps.googleusercontent.com',
    redirectUri,
  });

  useEffect(() => {
    if (responseGoogle?.type === 'success') {
      const { authentication } = responseGoogle;
      handleOAuthLogin('google', authentication.accessToken);
    }
  }, [responseGoogle]);

  const [requestFacebook, responseFacebook, promptFacebook] = Facebook.useAuthRequest({
    clientId: '100703048183075414',
    redirectUri,
  });

  useEffect(() => {
    if (responseFacebook?.type === 'success') {
      const { authentication } = responseFacebook;
      handleOAuthLogin('facebook', authentication.accessToken);
    }
  }, [responseFacebook]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        alert('[DEBUG] AsyncStorage user yükleniyor...');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          alert('[DEBUG] AsyncStorage user bulundu! _id: ' + parsed._id);
          await registerForPushNotificationsAsync(parsed._id);
        } else {
          alert('[DEBUG] AsyncStorage user YOK!');
        }
      } catch (err) {
        setUser(null);
        alert('[DEBUG] AsyncStorage loadUser HATA: ' + err.message);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const handleOAuthLogin = async (provider, accessToken) => {
    try {
      alert('[DEBUG] handleOAuthLogin çağrıldı, provider: ' + provider);
      const res = await axios.post('https://imame-backend.onrender.com/api/auth/social-login', {
        provider,
        accessToken,
      });

      const userData = res.data.user;
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      alert('[DEBUG] Social login sonrası user._id: ' + userData._id);
      await registerForPushNotificationsAsync(userData._id);
    } catch (err) {
      alert(`❌ ${provider} login error: ` + (err.response?.data?.message || err.message));
      console.error(`❌ ${provider} login error:`, err.response?.data || err.message);
    }
  };

  const login = async (email, password) => {
    try {
      alert('[DEBUG] Normal login başladı.');
      const res = await axios.post('https://imame-backend.onrender.com/api/auth/login', { email, password });
      const userData = res.data.user;
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      alert('[DEBUG] Normal login sonrası user._id: ' + userData._id);
      await registerForPushNotificationsAsync(userData._id);
    } catch (err) {
      alert('❌ Giriş başarısız: ' + (err.response?.data?.message || err.message));
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

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
      alert('❌ Profil güncelleme hatası: ' + (err.response?.data?.message || err.message));
      console.error('❌ Profil güncelleme hatası:', err.response?.data || err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        promptGoogle,
        promptFacebook,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
