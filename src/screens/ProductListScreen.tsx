import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, useColorScheme, View, } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import {  NativeStackScreenProps  } from '@react-navigation/native-stack';
import { RootStackParamList } from '@my_types/RootStackParams';
import { Product } from '@my_types/Product';
import { fetchProducts } from '@apis';
import createProductStyles from '@styles/ProductStyle';

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
        const data = await fetchProducts(skip, limit);
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
  const styles = createProductStyles(isDarkMode);
  
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

export default ProductListScreen;