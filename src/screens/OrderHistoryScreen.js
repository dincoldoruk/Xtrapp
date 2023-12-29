import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Header, Text } from '@rneui/base';
import { FlatList } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import I18n from '../localization/i18n/i18n';
import userStore from '../mobx/userStore';
import { db } from '../../App';
import { collection, getDoc, query } from 'firebase/firestore';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import OrderBox from '../components/orderBox';
import { observer } from 'mobx-react';


const OrderHistoryScreen = observer(() => {
  const windowHeight = Dimensions.get('window').height
  const [orderList, setOrderList] = useState([]);

  const flattenOrderData = (orderData) => {
    const flattenedOrders = [];

    // orderData içindeki belgeleri döngüye al
    Object.entries(orderData).forEach(([key, order]) => {
      // Eğer belge içinde bir dizi varsa (örneğin, items)
      if (Array.isArray(order.items)) {
        flattenedOrders.push({
          orderId: key, // Belgeye ait key
          useremail: order.useremail,
          orderDate: order.orderDate,
          total: order.total,
          status: order.status,
          // Diğer belge alanlarını da buraya ekleyebilirsiniz
          items: { ...order.items }, // item içindeki öğeleri de ekleyin
        });
        order.items.forEach((item) => {

        });
      }
    });
    // console.log('ORDERSSS',flattenedOrders)
    return flattenedOrders;
  };


  useFocusEffect(
    React.useCallback(() => {
      const getAllOrders = async () => {
        try {
          const querySnapshot = await firestore().collection('orders').doc(userStore.user.email + '_order').get();
          const orderData = querySnapshot.data();
          if (orderData) {
            const flattenedOrders = flattenOrderData(orderData);
            setOrderList(flattenedOrders);
          } else {
            console.log('Belge bulunamadı');
            setOrderList([])
          }
        } catch (error) {
          console.error('Siparişleri alma hatası:', error);
        }
      };
      getAllOrders();
    }, [])
  );

  


  return (
    <View style={{flex:1}}>
      {userStore.triggerLangRender}
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
     <View style={{flex:1,marginBottom:'10%'}}>
      <ScrollView>
        {
          orderList?.map((order, key) => {
            console.log('AAAAAAAAORDER++KEY', key, '     ', order)
            const productList = Object.values(order.items)
            return (
              <View key={key} style={{ padding: 2, backgroundColor: '#f0f0f0',  borderBottomWidth:0.2}}>
                <View style={{ height: windowHeight / 4.5, }}>
                  <FlatList
                    style={{}}
                    data={productList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollIndicatorInsets={0}
                    renderItem={({ item, index }) => <OrderBox key={index} product={item} index={index + 1}></OrderBox>}
                    keyExtractor={(item, i) => i}
                    extraData={userStore.user}
                  />
                </View>
                <View style={{flexDirection:'row',flex:1,marginBottom:1}}>
                  <View style={{flexDirection:'column', flex:3}}>
                    <Text style={styles.infotext}> {I18n.t('OrderDate')} : {order.orderDate}</Text>
                    <Text style={styles.infotext}> {I18n.t('TotalSeries')} : {order.total[0].totalSeries}</Text>
                    <Text style={styles.infotext}> {I18n.t('TotalPieces')} :  {order.total[0].totalPieces}</Text>
                  </View>
                <View style={{flexDirection:'column',flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{flexDirection:'row',fontWeight:'bold'}}> {I18n.t('Status')} </Text>
                  <TouchableOpacity
                    style={{ 
                       backgroundColor:'red',
                       borderRadius:10,
                       height:'50%',
                       width:null,
                       justifyContent:'center',
                       backgroundColor:
                       order.status === 'new' ? 'green' :
                       order.status === 'cancelled' ? 'red' :
                       order.status === 'pending' ? '#FFD700' : 
                       order.status === 'completed' ? 'black' : 'black',
                     }}
                    onPress={() => {
                      
                    }}>
                      <Text style={{textAlign:'center',color:'#fff',fontWeight:'500',padding:5}}>{I18n.t(order.status)}</Text>
                  </TouchableOpacity>
                </View>
                </View>
              </View>
            )
          })
        }
      </ScrollView>
      </View>
    </View>
  )
})

export default OrderHistoryScreen

const styles = StyleSheet.create({
   infotext:{
    fontWeight:'600'
   }
})