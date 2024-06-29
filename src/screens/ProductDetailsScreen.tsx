import { useEffect, useState } from "react";
import { Button, Image, Pressable, ScrollView, Text, useColorScheme, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@my_types/RootStackParams";
import { Product } from "@my_types/Product";
import { fecthProductByID } from "@apis";
import { FlashList } from "@shopify/flash-list";
import createProductStyles from "@styles/ProductStyle";
import { useStorage } from "src/context/StorageProvier";


type ProductDetailsProp = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;
const ProductDetailsScreen: React.FC<ProductDetailsProp> = ({ navigation, route }) => {
  const { id } = route.params;

  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [reviewsCollapsed, setReviewsCollapsed] = useState(true);
  const colorScheme = useColorScheme();
  const { itemIds, setItemIds } = useStorage();

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: product?.title });
  }, [navigation, product]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => 
  {  
    try
    {
        const data = await fecthProductByID(id);
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
  const styles = createProductStyles(isDarkMode);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= rating ? '★' : '☆'}
        </Text>
      );
    }
    return stars;
  };

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

      <ScrollView contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
      >
      <FlashList
        estimatedItemSize={4}
        data={product.images}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator
        horizontal
        renderItem={({ item }) => {
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
    { itemIds?.includes(id.toString()) ? (<Text style={{...styles.loadingText, textAlign: "center"}}>in Cart</Text>) :(
        <Button title="Add to Cart" onPress={() => { setItemIds(id.toString()) }} />)
    }
    <Text></Text>
    <Button title="Buy Now" onPress={() => { console.log("Buy Now") }} />

    <Pressable onPress={() => setReviewsCollapsed(!reviewsCollapsed)}>
        <Text style={styles.reviewsTitle}>Reviews {reviewsCollapsed ? '▼' : '▲'}</Text>
    </Pressable>

    {!reviewsCollapsed && (
    <View style={styles.reviewsContainer}>
      {product.reviews.length === 0 ? (
        <Text>No reviews available</Text>
      ) : (
        <FlashList
          estimatedItemSize={125}
          data={product.reviews}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewRating}>Rating: {renderStars(item.rating)}</Text>
              <Text style={styles.reviewComment}>{item.comment}</Text>
              <Text style={styles.reviewDate}>Date: {new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.reviewReviewer}>By: {item.reviewerName}</Text>
            </View>
          )}
        />
      )}
    </View>
      )}
  </ScrollView>
  

  );
  
};

export default ProductDetailsScreen;
