import React, { useState, useEffect } from 'react';
import { View,  FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Header, Text } from '@rneui/base';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await firestore().collection('orders').get();

        const orderData = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const { email } = parseOrderId(doc.id);
          const userData = await fetchUserData(email);

          return {
            id: doc.id,
            order:{...doc.data()},
            user: userData,
          };
        }));
      
        setOrders(orderData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const parseOrderId = (orderId) => {
    const [email, suffix] = orderId.split('_');
    return { email, suffix };
  };

  const fetchUserData = async (email) => {
    try {
      const userDoc = await firestore().collection('users').doc(email).get();

      if (userDoc.exists) {
        return userDoc.data();
      } else {
        console.warn('User document not found for email:', email);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
      return null;
    }
  };

  const renderItem = ({ item }) => {
    let newCounter = 0
    const orders = item.order
    for(const key in orders){
      console.log('item',orders[key].status)
      orders[key].status == "new" ? newCounter++ : null
    }
    return(
      <>
      { newCounter >0 ? 
        <TouchableOpacity onPress={() => navigationRef.navigate('UserOrdersScreen',{item})}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <Text>{`İsim Soyisim: ${item.user.nameSurname}`}</Text>
        <Text>{`E-Mail: ${item.user.email}`}</Text>
        <Text>{`Telefon: ${item.user.phone}`}</Text>
        <Text>{`Sipariş Sayısı: ${Object.keys(item.order).length}`}</Text>
        <Text>{`Yeni Sipariş Sayısı: ${newCounter}`}</Text>
        {/* Diğer sipariş bilgilerini burada gösterin */}
      </View>
    </TouchableOpacity>
      : null}
    </>
  )};

  return (
    <View>
      <Header
        backgroundColor={'#fff'}
        leftComponent={
          <View style={styles.headerRight}>
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => {
                  navigationRef.dispatch(DrawerActions.toggleDrawer())

                }}>
                <Ionicons name="menu" color={'#000'} size={26} />
              </TouchableOpacity>
            </View>
        }
        centerComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text h4 h4Style={{ fontSize: 21, alignSelf: 'center', fontWeight: '400', color: '#000' }} >X-TRAP</Text>
          </View>
        }
      />
     
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default OrderListScreen;

const styles = StyleSheet.create({
  infotext:{
   fontWeight:'600'
  }
})