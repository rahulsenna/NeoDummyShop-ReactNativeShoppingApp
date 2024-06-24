import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View, } from 'react-native';

import { Colors } from './src/constants/Colors';

import { DarkTheme, DefaultTheme, NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps  } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { type IconProps } from 'react-native-vector-icons/icon';
import { Product } from './src/types/Product';
import { getAnItem, getItems } from './src/utils/apis';
import { FlashList } from '@shopify/flash-list';



function TabBarIcon({ style, ...rest }: IconProps) {
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}

type ProductListProps = NativeStackScreenProps<RootStackParamList, 'ProductList'>;
const ProductListScreen: React.FC<ProductListProps> = ({ navigation }) =>
{
 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const colorScheme = useColorScheme();
  const limit = 20;

  useEffect(() => {
    loadProducts(skip, limit);
  }, []);

  const loadProducts = async (skip: number, limit: number) =>
  {
    try 
    {
        const data = await getItems(skip, limit);
        setProducts(prevProducts => [...prevProducts, ...data.products]);
        setLoading(false);
        setLoadingMore(false);
        if (data.products.length < limit)
        {
          setHasMore(false);
        }
    }    
    catch(error)
    {
        console.error(error);
        setLoading(false);
        setLoadingMore(false);
    };
  };

  const handleLoadMore = () =>
  {
    if (!loadingMore && hasMore)
    {
      setLoadingMore(true);
      setSkip(prevSkip => prevSkip + limit);
      loadProducts(skip + limit, limit);
    }
  };
  const isDarkMode = colorScheme === 'dark';
  const styles = createStylesForProductList(isDarkMode);
  
  if (loading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }  
  const renderItem = ({ item }: { item: Product }) => (
    
    <Pressable onPress={() => { navigation.navigate('ProductDetails', { id: item.id }) }}>
      <View style={styles.productContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.productDetails}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );


  return (
    <FlashList
      estimatedItemSize={189}
      data={products}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} /> : null}
    />
  );
 
}


export type RootStackParamList = {
  Home: undefined;
  ProductList: undefined;
  ProductDetails: { id: number };
};

const HomeStack = createNativeStackNavigator<RootStackParamList>();

type ProductDetailsProp = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;
const ProductDetailsScreen: React.FC<ProductDetailsProp> = ({ navigation, route }) => {
  const { id } = route.params;

  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   navigation.setOptions({ headerShown: true, title: product?.title });
  // }, [navigation, product]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => 
  {  
    try
    {
        const data = await getAnItem(id);
        setProduct(data);
        setLoading(false);
    }
    catch(error) 
    {
        console.error(error);
        setLoading(false); 
    }
  };


  const isDarkMode = colorScheme === 'dark';
  const styles = createStylesForProductList(isDarkMode);

  if (loading ) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }



  if (!product) {
    return (
    <>
    <View></View>
    </>
    );
  }


  return (

    <ScrollView contentContainerStyle={styles.container}>
      <FlashList
        estimatedItemSize={4}
        data={product.images}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator
        horizontal
        renderItem={({ item }) => {
          console.log('Rendering image:', item); // Log each image URL
          return (
            <Image source={{ uri: item }} style={styles.carroselImages} />
          );
        }}
      />
    
    <Text style={styles.title}>{product.title}</Text>
    <Text style={styles.description}>{product.description}</Text>
    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    <Text style={styles.availability}>Availability: {product.availabilityStatus}</Text>
    <Text style={styles.warranty}>Warranty: {product.warrantyInformation}</Text>
    <Text style={styles.shipping}>Shipping: {product.shippingInformation}</Text>
    <Text style={styles.returnPolicy}>Return Policy: {product.returnPolicy}</Text>
    <Text style={styles.tags}>Tags: {product.tags.join(', ')}</Text>

    <View style={styles.reviewsContainer}>
      <Text style={styles.reviewsTitle}>Reviews:</Text>
      {product.reviews.length === 0 ? (
        <Text>No reviews available</Text>
      ) : (
        <FlashList
          estimatedItemSize={125}
          data={product.reviews}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewRating}>Rating: {item.rating}</Text>
              <Text style={styles.reviewComment}>{item.comment}</Text>
              <Text style={styles.reviewDate}>Date: {new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.reviewReviewer}>By: {item.reviewerName}</Text>
            </View>
          )}
        />
      )}
    </View>
  </ScrollView>
  

  );
  
};


const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text>
        Settings!
      </Text>
    </View>
  );
}

const AccountScreen: React.FC = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text>
        Settings!
      </Text>
    </View>
  );
}

const Home = () =>
{
  return (
    <HomeStack.Navigator initialRouteName='ProductList'>
      <HomeStack.Screen name="ProductList" component={ProductListScreen} />
      <HomeStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </HomeStack.Navigator>
  );
}

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
        <Tab.Screen name="You" component={AccountScreen} options={{ tabBarLabel: 'You', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />), }} />
        <Tab.Screen name="Cart" component={SettingsScreen} options={{ tabBarLabel: 'Cart', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />), }} />
        <Tab.Screen name="Menu" component={SettingsScreen} options={{ tabBarLabel: 'Menu', tabBarIcon: ({ focused, color }) => (<TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />), }} />
      </Tab.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  // backgroundColor: isDarkMode ? Colors.black : Colors.white
  Container: {
    flex: 1
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;


const createStylesForProductList = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#000' : '#fff',
  },
  loadingText: {
    color: isDarkMode ? '#fff' : '#000',
  },
  list: {
    padding: 10,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
    borderRadius: 5,
    shadowColor: isDarkMode ? '#fff' : '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  carroselImages: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
  },
  description: {
    fontSize: 14,
    color: isDarkMode ? '#ccc' : '#666',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
    marginTop: 10,
  },
  availability: {
    fontSize: 16,
    color: isDarkMode ? '#ccc' : '#000',
    marginBottom: 10,
  },
  warranty: {
    fontSize: 16,
    color: isDarkMode ? '#ccc' : '#000',
    marginBottom: 10,
  },
  shipping: {
    fontSize: 16,
    color: isDarkMode ? '#ccc' : '#000',
    marginBottom: 10,
  },
  returnPolicy: {
    fontSize: 16,
    color: isDarkMode ? '#ccc' : '#000',
    marginBottom: 10,
  },
  tags: {
    fontSize: 16,
    color: isDarkMode ? '#ccc' : '#000',
    marginBottom: 10,
  },
  reviewsContainer: {
    marginTop: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#555' : '#ddd',
    paddingBottom: 10,
  },
  reviewRating: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#000',
  },
  reviewComment: {
    fontSize: 16,
    color: isDarkMode ? '#ccc' : '#000',
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 14,
    color: isDarkMode ? '#aaa' : '#555',
    marginBottom: 5,
  },
  reviewReviewer: {
    fontSize: 14,
    color: isDarkMode ? '#aaa' : '#555',
  },
});