import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native';
// import { Product } from '@my_types/Product';
import { fecthCartByID, updateCart } from '@apis';
import { FlashList } from '@shopify/flash-list';
import { useStorage } from "src/context/StorageProvier";

interface Product {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
    thumbnail: string;
  };
export interface Cart  {
  id: number;
  products: Product[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};

const CartScreen: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const { itemIds } = useStorage();

  useEffect(() => {
    loadCart();
  }, [itemIds]);

  const loadCart = async () => 
  {  
    try
    {
        setLoading(true);
        
        if (itemIds)
        {
          const data = await updateCart(itemIds);
          setCart(data);
        } else
        {
          const data = await fecthCartByID(1);
          setCart(data);
        }
          
        setLoading(false);
    }
    catch(error) 
    {
        console.error(error);
        setLoading(false); 
    }
    setLoading(false);
  };

  const styles = createStyles(colorScheme === 'dark');

  if (!cart || loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={cart.products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.productDetails}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
              <View style={styles.totalPriceContainer}>
              <Text style={styles.discountPercent}> -{item.discountPercentage}% </Text>
              <Text style={styles.productTotal}> ${item.total.toFixed(2)}</Text>
              </View>
              <View style={styles.totalPriceContainer}>
              <Text style={styles.discountTotal}>MRP: </Text>
              <Text style={{...styles.discountTotal, textDecorationLine:'line-through'}}>${(item.total + (item.total*(item.discountPercentage/100))).toFixed(2)}</Text>

              </View>

            </View>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.cartSummary}>
            <Text style={styles.summaryText}>Total Products: {cart.totalProducts}</Text>
            <Text style={styles.summaryText}>Total Quantity: {cart.totalQuantity}</Text>
            <Text style={styles.summaryText}>Total: ${cart.total.toFixed(2)}</Text>
            <Text style={styles.summaryText}>Discounted Total: ${cart.discountedTotal.toFixed(2)}</Text>
          </View>
        }
      />
    </View>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#ffffff',
      padding: 16,
    },
    loadingText: {
      color: isDarkMode ? '#ffffff' : '#000000',
      textAlign: 'center',
      marginTop: 20,
    },
    totalPriceContainer:
    {
      flexDirection: "row",
      
    },
    cartSummary: {
      marginBottom: 16,
    },
    summaryText: {
      fontSize: 18,
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 8,
    },
    productContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      padding: 16,
      backgroundColor: isDarkMode ? '#1f1f1f' : '#f9f9f9',
      borderRadius: 8,
    },
    thumbnail: {
      width: 80,
      height: 80,
      marginRight: 16,
    },
    productDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    productTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 14,
      color: isDarkMode ? '#b0b0b0' : '#757575',
      marginBottom: 4,
    },
    productQuantity: {
      fontSize: 14,
      color: isDarkMode ? '#b0b0b0' : '#757575',
      marginBottom: 4,
    },
    productTotal: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    discountPercent:
    {
      fontSize: 14,
      color: '#f3426c',
      marginBottom: 4,
    },
    discountTotal:
    {
      fontSize: 14,
      color: isDarkMode ? '#acaaa1' : '#565959',
      marginBottom: 4,
    }
  });

export default CartScreen;
