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
import { formatDate } from '../utils/FormatDate';



const OrderScreen = observer( () => {
const [quantity,setQuantity] = useState(1);
  
const createOrder = async () => {
  const orderDate = formatDate(new Date());
  const useremail = userStore.user.email; // Kullanıcının kimliği
  const orderID = `${useremail}_${'order'}`;
  const orderDetailID= 'siparis_'+ new Date().getTime()

  const ORDERS = {
    [orderDetailID]:{
      useremail: userStore.user.email,
      items: [], // Sipariş ürünlerini buraya ekleyin
      orderDate: orderDate, // Sipariş tarihi
      status: 'new',
      total:[],
    } 
  };
  let totalSeries = 0 
  let totalPieces = 0

  userStore.UserCart.forEach((cartItem) => {
    const { productInfo, quantity } = cartItem;
    ORDERS[orderDetailID].items.push({
      title: productInfo.title,
      model: productInfo.model,
      productCode: productInfo.productCode? productInfo.productCode:'Kod Yok',
      price: productInfo.price,
      quantity,
      totalPrice: productInfo.price * quantity,
      image: productInfo.showroomImage,
    });
    totalSeries+= Number(quantity)
    totalPieces+= Number(productInfo.price) * Number(quantity)
  });
    ORDERS[orderDetailID].total.push({
     totalSeries,
     totalPieces,

    })
  // Firebase'e veriyi gönder
  try {
     await firestore()
    .collection('orders')
    .doc(orderID)
    .update(ORDERS);
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
const Item = ({ item ,quantity,productKey}) => (
    <View key={productKey} style={{ flexDirection: 'row', flex:1,  backgroundColor: '#f0f0f0',  alignItems: 'center', borderWidth: 0.4, borderColor: '#000',aspectRatio:3 }}>
      <View style={{flex:0.5}}>
          <Image source={{uri:item.showroomImage}}
            resizeMethod='resize'
            resizeMode='contain'
            style={{height:null,flex:1,width:null}}>
          </Image>
        </View>
      <View style={{ flexDirection: 'column', flex: 2, }}>
        <View style={{ flex: 1,justifyContent:'center',marginLeft:'10%' }}>
          <Text style={{ color: '#000',fontWeight:'500'}}>{item.title.toUpperCase()}</Text>
          <Text style={{ color: '#000',fontWeight:'300'}}>{item.label.toUpperCase()}</Text>
          <Text style={{ color: '#000',fontWeight:'500'}}>{item.description}</Text>
          <Text style={{ color: '#000',fontWeight:'500'}}> {quantity} * {item.price} = {quantity * item.price} {I18n.t('pieces')}</Text>
        </View>
      </View>
    </View>
  );
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
                navigationRef.navigate('MyBag')
              }}>
              <Ionicons name="return-up-back-sharp" color={'#000'} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text h4 h4Style={{ fontSize: 21, alignSelf: 'center', fontWeight: '400', color: '#000' }} >{I18n.t('OrderDetail')}</Text>
          </View>
        }
        
      />
        <FlatList
          data={userStore.UserCart}
          renderItem={(item,i) => <Item key={i} item={item.item.productInfo} quantity={item.item.quantity} productKey={i} />}
          keyExtractor={(item,i) => i}
          extraData={userStore.triggerCartRender}
          style={{ width: '100%', height: '100%', }}
        />
       <Text style={{textAlign:'center',marginBottom:'5%',marginTop:'1%'}}>{I18n.t('OrderInfo')}</Text>
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10, backgroundColor:'black',width:'100%'}} 
          onPress={() => {
            Alert.alert(
                I18n.t('SureOrder'),
                 I18n.t('SurOrderAlt'),
                [
                  {
                    text: I18n.t('Confirm'), onPress: () =>(
                      createOrder(),
                      Alert.alert(I18n.t('Congratulations'),  
                      I18n.t('OrderSended'),
                      
                      [{ text: I18n.t('Ok'), 
                      onPress:()=>{
                          navigationRef.navigate('HomeScreen');
                          //userStore.setUserCart([]);
                          }}], { cancelable: false })
                    )
                  }, { text: I18n.t('Decline'), style: 'cancel' }],
                { cancelable: false }
              );
            navigationRef.navigate('OrderScreen')
             }}>
          <FontAwesome name='truck' size={25} color='#fff' style={{ marginRight: 10 }}></FontAwesome>
          <Text style={{color:'#fff'}}>{I18n.t('SendOrder')}</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10, backgroundColor:'green',width:'100%',marginBottom:'2%'}} 
          onPress={() => { 
            Alert.alert(
                I18n.t('SureOrder'),
                 I18n.t('SureOrderAlt'),
                [
                  {
                    text: I18n.t('Confirm'), onPress: () =>
                    Alert.alert(I18n.t('Congratulations'), 
                     I18n.t('OrderSended'), 
                     [{ text: I18n.t('Ok'), 
                     onPress:()=>{
                     navigationRef.navigate('HomeScreen');
                     userStore.setUserCart([]);
                     createOrder();
                     createWhatsappMsg()}}], { cancelable: false })
                  }, { text: I18n.t('Decline'), style: 'cancel' }],
                { cancelable: false }
              );       
             }}>
          <FontAwesome name='whatsapp' size={25} color='black' style={{ marginRight: 10 }}></FontAwesome>
          <Text>{I18n.t('SendWhatsapp')}</Text>
        </TouchableOpacity> 
    </View>
  )
})
export default OrderScreen;

const styles = StyleSheet.create({})