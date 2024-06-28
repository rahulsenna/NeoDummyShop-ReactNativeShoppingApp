import { StyleSheet } from "react-native";

const createProductStyles = (isDarkMode: boolean) => StyleSheet.create({
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
    star: {
      fontSize: 18,
      color: isDarkMode ? '#ffd700' : '#ffd700',
    },
  });

  export default createProductStyles;