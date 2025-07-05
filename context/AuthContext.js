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
  const redirectUri = makeRedirectUri({ useProxy: true });

  // 🔹 Bildirim token'ı al
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

      // Backend'e gönder
      await axios.post('https://imame-backend.onrender.com/api/users/update-token', {
        userId,
        token: expoPushToken,
      });
    } catch (err) {
      console.error('❌ Push token kaydedilemedi:', err.message);
    }
  };

  const [requestGoogle, responseGoogle, promptGoogle] = Google.useAuthRequest({
    expoClientId: '731274011151-ce78qup9757gfive4bb1rsojnc91sc3b.apps.googleusercontent.com',
    androidClientId: '731274011151-48vi9247ubv33r23rs41j7nr7d2siv34.apps.googleusercontent.com',
    webClientId: '731274011151-ce78qup9757gfive4bb1rsojnc91sc3b.apps.googleusercontent.com',
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
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        await registerForPushNotificationsAsync(parsed._id); // girişte token kontrolü
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (responseFacebook?.type === 'success') {
      const { authentication } = responseFacebook;
      handleOAuthLogin('facebook', authentication.accessToken);
    }
  }, [responseFacebook]);

  const handleOAuthLogin = async (provider, accessToken) => {
    try {
      const res = await axios.post('https://imame-backend.onrender.com/api/auth/social-login', {
        provider,
        accessToken,
      });

      const userData = res.data.user;
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await registerForPushNotificationsAsync(userData._id);
    } catch (err) {
      console.error(`❌ ${provider} login error:`, err.response?.data || err.message);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('https://imame-backend.onrender.com/api/auth/login', { email, password });
    const userData = res.data.user;
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await registerForPushNotificationsAsync(userData._id);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
