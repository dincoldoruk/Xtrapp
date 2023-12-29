import { StyleSheet, TouchableOpacity, View, ScrollView, Image, Linking, Alert } from 'react-native'
import React, { memo, useState } from 'react'
import { Avatar, Header, Text } from '@rneui/base'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';
import userStore from '../mobx/userStore';
import { FlatList } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { observer } from 'mobx-react';
import I18n from '../localization/i18n/i18n';
import firestore from '@react-native-firebase/firestore';
const MyBag = observer( () => {
const [quantity,setQuantity] = useState(1);
  
const createOrder = async () => {
  const orderDate = new Date();
  const useremail = userStore.user.email; // Kullanıcının kimliği
  const orderID = `${useremail}_${orderDate.getTime()}`;
  const ORDERS = {
    useremail: userStore.user.email,
    items: [], // Sipariş ürünlerini buraya ekleyin
    orderDate: orderDate, // Sipariş tarihi
  };

  // Kullanıcının sepetini dolaşarak sipariş ürünlerini ORDERS.items'e ekleyin
  userStore.UserCart.forEach((cartItem) => {
    const { productInfo, quantity } = cartItem;
    ORDERS.items.push({
      model: productInfo.model,
      productCode: productInfo.productCode? productInfo.productCode:'Kod Yok',
      price: productInfo.price,
      quantity,
      totalPrice: productInfo.price * quantity,
    });
  });

  // Firebase'e veriyi gönder
  try {
     await firestore()
    .collection('orders')
    .doc(orderID)
    .set(ORDERS);
    console.log('order',orderID)
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    // Hata durumunda kullanıcıya bilgi verebilirsiniz
  }
};

const createWhatsappMsg  = () => {
  let MESSAGE = ''; 
  userStore.UserCart.map((prod) => {
    MESSAGE += `
    Model: ${String(prod.productInfo.model).toUpperCase()},
    Ürün Kodu: ${prod.productInfo.productCode},
    Fiyat : ${prod.productInfo.price}$ ,
    Seri Adedi : ${prod.quantity},
    Toplam Adet : ${prod.productInfo.price * prod.quantity}
    \n
    `
  })
  let url =
    'https://wa.me/+905373673060?text=' + MESSAGE 
    ;
    console.log(url);
    Linking.openURL(url)
userStore.setUserCart([])
}    

const renderCartItem = (item, quantity, productKey) => {
  console.log(item); // Ekleyin
  return (
    <View key={productKey} style={{ flexDirection: 'row', flex: 1, backgroundColor: '#f0f0f0', alignItems: 'center', borderWidth: 0.4, borderColor: '#000', aspectRatio: 1.4 }}>
      <View style={{flex:2}}>
          <Image source={{uri:item.showroomImage}}
            resizeMethod='resize'
            resizeMode='contain'
            style={{height:null,flex:1,width:null}}>
          </Image>
        </View>
      <View style={{ flexDirection: 'column', flex: 2, }}>
        <View style={{ flex: 1 }}>
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <TouchableOpacity 
              style={{ marginRight: '2%', }} onPress={() => {
              userStore.deleteProductFromCart(item);
            }}>
              <AntDesign name="close" size={24} color='#000' style={{marginTop:'5%',marginRight:'5%'}} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: '#000',fontWeight:'500',marginTop:'5%' }}>{item.title}</Text>
          <Text style={{ color: '#000',fontWeight:'500',marginTop:'5%' }}>{item.description}</Text>
          <Text style={{ color: '#000',fontWeight:'bold',marginTop:'10%' }}>{quantity * item.price} {I18n.t('pieces')}</Text>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', marginTop: '5%', flex: 1,alignItems:'flex-end',justifyContent:'space-around' }}>
          <TouchableOpacity 
            onPress={() => {
              userStore.deleteFromCart(item);
              }}>
            <AntDesign name="minus" size={22} color={ '#000' }/>
          </TouchableOpacity>
          <Text style={{ marginLeft: '2%', marginRight: '2%', color: '#000',fontWeight:'bold',fontSize:18 }}>{quantity}</Text>
          <TouchableOpacity onPress={() => { 
              userStore.addToCart(item)
            }}>
            <AntDesign name="plus" size={22} color='#000' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
  return (
    <View style={{ width: '100%', height: '100%' }}>
      {userStore.triggerLangRender}
      <Header
        backgroundColor={'#fff'}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.goBack()
              }}>
              <Ionicons name="return-up-back-sharp" color={'#000'} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text h4 h4Style={{ fontSize: 21, alignSelf: 'center', fontWeight: '400', color: '#000' }} >X-TRAP</Text>
          </View>
        }
        rightComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              style= {{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.navigate('MyBag')
              }}>
              <Ionicons name="cart-outline" size={26} color='#000' />
            </TouchableOpacity>
          </View>
        }
      />
       <ScrollView style={{ width: '100%', height: '100%' }}>
        {userStore.UserCart.map((item, i) => renderCartItem(item.productInfo, item.quantity, i))}
      </ScrollView>
     
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:15, backgroundColor:'black',width:'100%'}} 
          onPress={() => {
            userStore.UserCart.length>0 ? 
           
            navigationRef.navigate('OrderScreen')
            : Alert.alert(I18n.t('Error'),  I18n.t('CartEmpty'), [{ text: I18n.t('Ok')}], { cancelable: false })
             }}>
          <Ionicons name="cart-outline" size={25} color='#fff' style={{marginBottom:'5%'}}/>
          <Text style={{color:'#fff',fontSize:18,marginBottom:'5%',textAlign:'center'}}>{I18n.t('ConfirmCart')}</Text>
        </TouchableOpacity> 
    </View>
  )
})
export default MyBag;

const styles = StyleSheet.create({})