import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: '700', color: colors.text },
        }}
      >
        {!user ? (
          // login required since 2.0 - everything lives behind the gate now
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log In' }} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
