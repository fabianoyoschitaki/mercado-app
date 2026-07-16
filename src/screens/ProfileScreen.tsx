import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { FLAGS } from '../config';
import { colors } from '../theme';
import AppButton from '../../components/AppButton';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.screen}>
        <Text style={styles.notLogged}>You are not logged in</Text>
        <AppButton title="Log In" onPress={() => navigation.navigate('Login')} />
        <AppButton
          variant="outline"
          title="My Favourites"
          onPress={() => navigation.navigate('Favourites')}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text testID="profile-name" style={styles.name}>
        {user.name}
      </Text>
      <Text testID="profile-email" style={styles.email}>
        {user.email}
      </Text>
      <AppButton
        variant="outline"
        title="My Favourites"
        onPress={() => navigation.navigate('Favourites')}
      />
      {user.isSeller && FLAGS.sellerDashboard && (
        <AppButton
          title="Seller Dashboard"
          onPress={() => navigation.navigate('SellerDashboard')}
        />
      )}
      <AppButton variant="danger" title="Log Out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.bg,
  },
  notLogged: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 16,
  },
});
