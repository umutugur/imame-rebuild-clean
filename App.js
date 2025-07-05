import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { AuthProvider, AuthContext } from './context/AuthContext';
import OfflineNotice from './components/OfflineNotice';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabNavigator from './navigation/TabNavigator';
import AuctionDetailScreen from './screens/AuctionDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import MyBidsScreen from './screens/MyBidsScreen';
import OngoingAuctionsScreen from './screens/OngoingAuctionsScreen';
import CompletedAuctionsScreen from './screens/CompletedAuctionsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import UploadReceiptScreen from './screens/UploadReceiptScreen';
import ChatScreen from './screens/ChatScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import UserListScreen from './screens/UserListScreen';
import AddSellerScreen from './screens/AddSellerScreen';
import ManageAuctionsScreen from './screens/ManageAuctionsScreen';
import ReceiptApprovalScreen from './screens/ReceiptApprovalScreen';
import ViewReportsScreen from './screens/ViewReportsScreen';
import BanUserScreen from './screens/BanUserScreen';
import SendNotificationScreen from './screens/SendNotificationScreen';
import AddAuctionScreen from './screens/AddAuctionScreen';
import MyAuctionsScreen from './screens/MyAuctionsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';

const Stack = createNativeStackNavigator();

// Bildirim davranışı ayarı
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Token gönderme hook'u
const useRegisterPushToken = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (!Device.isDevice) return;

      // Bildirim izinlerini kontrol et
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      // Expo Push Token al
      const { data: pushToken } = await Notifications.getExpoPushTokenAsync();
      console.log("📲 Push Token:", pushToken);

      // Token'ı backend'e kaydet
      if (user?._id && pushToken) {
        try {
          await fetch(`https://imame-backend.onrender.com/api/users/push-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, token: pushToken }),
          });
        } catch (err) {
          console.error('❌ Push token gönderilemedi:', err);
        }
      }
    };

    registerForPushNotificationsAsync();
  }, [user]);
};


// Ayrı bileşende hook'u çalıştır
const PushTokenManager = () => {
  useRegisterPushToken();
  return null;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <OfflineNotice />
        <PushTokenManager />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="AuctionDetail" component={AuctionDetailScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="MyBids" component={MyBidsScreen} />
          <Stack.Screen name="OngoingAuctions" component={OngoingAuctionsScreen} />
          <Stack.Screen name="CompletedAuctions" component={CompletedAuctionsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="UploadReceipt" component={UploadReceiptScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
          <Stack.Screen name="UserList" component={UserListScreen} />
          <Stack.Screen name="AddSeller" component={AddSellerScreen} />
          <Stack.Screen name="ManageAuctions" component={ManageAuctionsScreen} />
          <Stack.Screen name="ReceiptApproval" component={ReceiptApprovalScreen} />
          <Stack.Screen name="ViewReports" component={ViewReportsScreen} />
          <Stack.Screen name="BanUser" component={BanUserScreen} />
          <Stack.Screen name="SendNotification" component={SendNotificationScreen} />
          <Stack.Screen name="AddAuction" component={AddAuctionScreen} />
          <Stack.Screen name="MyAuctions" component={MyAuctionsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Terms" component={TermsAndConditionsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
