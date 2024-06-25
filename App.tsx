import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, useColorScheme, View, } from 'react-native';

import { Colors } from '@constants/Colors';

import { DarkTheme, DefaultTheme, NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@my_types/RootStackParams';
import ProductDetailsScreen from '@screens/ProductDetailsScreen';
import ProductListScreen from '@screens/ProductListScreen';
import TabBarIcon from '@components/navigation/TabBarIcon';
import LoginScreen from '@screens/LoginScreen';
import * as Keychain from 'react-native-keychain';
import api, { AuthResponse, removeAuthToken, setAuthToken } from '@apis';
import ProfileScreen from '@screens/ProfileScreen';

const AuthContext = React.createContext<{
  signIn: (token: string, refresh_token: string) => void;
  signOut: () => void;
  session?: { token: string, refresh_token: string } | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}>({
  signIn: (token: string, refresh_token: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isLoggedIn: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

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

const Home = () =>
(
  <HomeStack.Navigator initialRouteName='ProductList'>
    <HomeStack.Screen name="ProductList" component={ProductListScreen} />
    <HomeStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </HomeStack.Navigator>
)

const UserStack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();
const App: React.FC = () => {
  const [state, setState] = useState({
    isLoading: true,
    isLoggedIn: false,
    session: null as { token: string, refresh_token: string } | null,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token:string = '';
      let refresh_token:string = '';
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          token =  credentials.password;
          refresh_token =  credentials.username;  
          setAuthToken(token);
        }
      } catch (e) {
        console.error(e);
      }
      setState({ ...state, isLoading: false, isLoggedIn: token ? true : false, session: { token, refresh_token } });

    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async ( token: string, refresh_token: string ) => {
        await Keychain.setGenericPassword(refresh_token, token);
        setState({ ...state, isLoggedIn: true, session: { token, refresh_token } });
        await setAuthToken(token);
      },
      signOut: async () => {
        await Keychain.resetGenericPassword();
        setState({ ...state, isLoggedIn: false, session: null });
        await removeAuthToken();
      },
      isLoggedIn: state.isLoggedIn,
      isLoading: state.isLoading,
      session: state.session
    }),
    [state]
  );

  useEffect(() => {
    //------------------------------------------------------
    // Axios interceptor to handle token expiry
    api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry)
        {
          originalRequest._retry = true;
          
          const credentials = await Keychain.getGenericPassword();
          if (credentials)
          {            
            try
            {
              const response = await api.post<AuthResponse>('auth/refresh', {
                refreshToken: credentials.username,
                expiresInMins: 30,
              });
              const { token, refreshToken } = response.data;
              authContext.signIn(token, refreshToken);
              return api(originalRequest);
            } catch (err)
            {
              authContext.signOut();
              await removeAuthToken();
              return Promise.reject(err);
            }
          }

        }
        return Promise.reject(error);
      }
    );
    //------------------------------------------------------
  }, [state] );



  const User = () =>
    (
      <UserStack.Navigator>
      {
        state.isLoggedIn ? 
        (<><UserStack.Screen name="Profile" component={ProfileScreen} /></>): 
        (<><UserStack.Screen name="Login" component={LoginScreen} /></>)
      }
      </UserStack.Navigator>
    )


  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

/*   if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } */
  return (
    <AuthContext.Provider value={authContext}>
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, headerShown: false, }}>
        <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />), }} />
        <Tab.Screen name="You" component={User} options={{ tabBarLabel: 'You', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />), }} />
        <Tab.Screen name="Cart" component={SettingsScreen} options={{ tabBarLabel: 'Cart', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />), }} />
        <Tab.Screen name="Menu" component={SettingsScreen} options={{ tabBarLabel: 'Menu', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />), }} />
      </Tab.Navigator>
    </NavigationContainer>
    </AuthContext.Provider>

  );
}

export default App;
