import { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageContextType {
    itemIds: string[];
    setItemIds: (item: string) => void;
    loadItemIds: () => void;
  }
  
  const StorageContext = createContext<StorageContextType>({
    itemIds: [],
    setItemIds: () => {},
    loadItemIds: () => {},
  });
  
  export function StorageProvider(props: React.PropsWithChildren)  {
    const [itemIds, setItemIdsState] = useState<string[]>([]);
  
    const setItemIds = async (item: string) => {
      try {
        let items:string[] = [];
        const items_json = await AsyncStorage.getItem('itemIds');
        // await AsyncStorage.setItem('itemIds', JSON.stringify(item));
        if (items_json)
        {
            items = JSON.parse(items_json);
        }
        items.push(item) 
        setItemIdsState(items);
        await AsyncStorage.setItem('itemIds', JSON.stringify(items));

      } catch (error) {
        console.error('Error setting stored value:', error);
      }
    };
  
    const loadItemIds = useCallback(async () => {
      try {
        const items_json = await AsyncStorage.getItem('itemIds');
        if (items_json !== null) {
          setItemIdsState(JSON.parse(items_json));
        } else {
          setItemIdsState([]);
        }
      } catch (error) {
        console.error('Error fetching stored value:', error);
      }
    }, []);
  
    useEffect(() => {
      loadItemIds();
    }, [loadItemIds]);
  
    return (
      <StorageContext.Provider value={{ itemIds, setItemIds, loadItemIds }}>
        {props.children}
      </StorageContext.Provider>
    );
  };
  
  export const useStorage = () => useContext(StorageContext);