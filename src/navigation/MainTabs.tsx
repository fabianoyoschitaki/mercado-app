import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../cart/CartScreen';
import CheckoutScreen from '../cart/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import SellerDashboardScreen from '../seller/SellerDashboardScreen';
import { useCart } from '../cart/CartContext';
import { colors } from '../theme';
import Brand from '../../components/Brand';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackHeader = {
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: '700' as const, color: colors.text },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackHeader}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home', headerTitle: () => <Brand /> }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={stackHeader}>
      <Stack.Screen name="CartMain" component={CartScreen} options={{ title: 'Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackHeader}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="Favourites" component={FavouritesScreen} options={{ title: 'My Favourites' }} />
      <Stack.Screen name="SellerDashboard" component={SellerDashboardScreen} options={{ title: 'Seller Dashboard' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
      {/* legacy route name kept for old deep links; seller screens still use it */}
      <Stack.Screen name="ListingDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
    </Stack.Navigator>
  );
}

const icon = (glyph: string) => ({ focused }: { focused: boolean }) => (
  <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>{glyph}</Text>
);

export default function MainTabs() {
  const { count } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: icon('🏠') }} />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarIcon: icon('🛒'),
          ...(count > 0 ? { tabBarBadge: count } : {}),
        }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarIcon: icon('📦'), headerShown: true, title: 'Orders', ...stackHeader }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarIcon: icon('👤') }} />
    </Tab.Navigator>
  );
}
