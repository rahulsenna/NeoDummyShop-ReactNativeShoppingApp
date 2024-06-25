import React, { useEffect, useState } from 'react';
import { Text, useColorScheme, View, } from 'react-native';

import { Colors } from './src/constants/Colors';

import { DarkTheme, DefaultTheme, NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './src/types/RootStackParams';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import TabBarIcon from './src/components/navigation/TabBarIcon';
import LoginScreen from './src/screens/LoginScreen';


const HomeStack = createNativeStackNavigator<RootStackParamList>();

const SettingsScreen: React.FC = () => {
  return (
    <View>
      <Text>
        Settings!
      </Text>
    </View>
  );
}

const AccountScreen: React.FC = () => {
  return (
    <View>
      <Text>
        Settings!
      </Text>
    </View>
  );
}

const Home = () =>
(
  <HomeStack.Navigator initialRouteName='ProductList'>
    <HomeStack.Screen name="ProductList" component={ProductListScreen} />
    <HomeStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </HomeStack.Navigator>
)

const Tab = createBottomTabNavigator();
const App: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };



  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, headerShown: false, }}>
        <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />), }} />
        <Tab.Screen name="You" component={LoginScreen} options={{ tabBarLabel: 'You', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />), }} />
        <Tab.Screen name="Cart" component={SettingsScreen} options={{ tabBarLabel: 'Cart', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />), }} />
        <Tab.Screen name="Menu" component={SettingsScreen} options={{ tabBarLabel: 'Menu', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />), }} />
      </Tab.Navigator>
    </NavigationContainer>

  );
}

export default App;
