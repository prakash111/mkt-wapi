import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from '@/navigation/navigationRef';
import { HomeScreen } from '@/screens/HomeScreen';
import { ChatListScreen } from '@/screens/ChatListScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { ContactsScreen } from '@/screens/ContactsScreen';
import { CrmHubScreen } from '@/screens/CrmHubScreen';
import { MoreScreen } from '@/screens/MoreScreen';
import { CampaignsScreen } from '@/screens/CampaignsScreen';
import { WhatsAppAccountsScreen } from '@/screens/WhatsAppAccountsScreen';
import { SubscriptionScreen } from '@/screens/SubscriptionScreen';
import { NotificationCenterScreen } from '@/screens/NotificationCenterScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { useAuth } from '@/context/AuthContext';
import { palette } from '@/theme';

const Tab = createBottomTabNavigator();
const Root = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
        tabBarActiveTintColor: palette.text,
        tabBarInactiveTintColor: palette.muted,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Inbox" component={ChatListScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="CRM" component={CrmHubScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { token } = useAuth();

  return (
    <NavigationContainer ref={navigationRef}>
      <Root.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: palette.surface },
          headerTintColor: palette.text,
          contentStyle: { backgroundColor: palette.bg },
        }}>
        {!token ? (
          <Root.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Root.Screen name="MainTabs" component={Tabs} options={{ headerShown: false }} />
            <Root.Screen name="ChatThread" component={ChatScreen} options={{ title: 'Conversation' }} />
            <Root.Screen name="Campaigns" component={CampaignsScreen} />
            <Root.Screen name="WhatsAppAccounts" component={WhatsAppAccountsScreen} options={{ title: 'WhatsApp Accounts' }} />
            <Root.Screen name="Subscription" component={SubscriptionScreen} />
            <Root.Screen name="Notifications" component={NotificationCenterScreen} />
            <Root.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}
