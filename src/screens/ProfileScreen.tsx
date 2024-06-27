import { fetchUser } from '@apis';
import { useSession } from '@app';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, useColorScheme, StyleSheet, ActivityIndicator, Button } from 'react-native';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  age: number;
  maidenName: string;
  phone: string;
  birthDate: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  ip: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
}

const ProfileScreen: React.FC = () => {
  
  const { signOut, session } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data: User = await fetchUser(session?.token!);
        setUser(data);
      } catch (error: any) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);



  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createStyles(isDarkMode);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#841584" />
      </View>
    );
  }

  if (!user) {
    return (
      <View >
        <Text>Failed to load user data</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} >
        <Image source={{ uri: user.image }} style={styles.profileImage} />
        <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
        <Text style={styles.info}>{`Age: ${user.age}`}</Text>
        <Text style={styles.info}>{`Gender: ${user.gender}`}</Text>
        <Text style={styles.info}>{`Email: ${user.email}`}</Text>
        <Text style={styles.info}>{`Phone: ${user.phone}`}</Text>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.info}>{`${user.address.address}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}, ${user.address.country}`}</Text>
        <Text style={styles.sectionTitle}>Company</Text>
        <Text style={styles.info}>{`Name: ${user.company.name}`}</Text>
        <Text style={styles.info}>{`Department: ${user.company.department}`}</Text>
        <Text style={styles.info}>{`Title: ${user.company.title}`}</Text>
        <Text style={styles.sectionTitle}>Crypto</Text>
        <Text style={styles.info}>{`Coin: ${user.crypto.coin}`}</Text>
        <Text style={styles.info}>{`Wallet: ${user.crypto.wallet}`}</Text>
        <Button title='Logout' onPress={signOut} color={isDarkMode ? "#555" : "#007AFF"} />
      </ScrollView>
    </View>
  );
  
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      padding: 16,
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      alignSelf: 'center',
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      marginBottom: 8,
    },
    info: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginTop: 16,
      marginBottom: 8,
    },
  });



export default ProfileScreen;
