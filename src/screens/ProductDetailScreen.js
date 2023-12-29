import { View, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Linking, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { storage, ref, getDownloadURL } from '@react-native-firebase/storage';
import ModelBox from '../components/modelBox';
import { Button, Header, Text } from '@rneui/base';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from '../../App';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Carousel from 'react-native-reanimated-carousel';
import userStore from '../mobx/userStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { observer } from 'mobx-react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import I18n from '../localization/i18n/i18n';
import { deleteObject } from 'firebase/storage';
import firestore from '@react-native-firebase/firestore';

const ProductDetailScreen = observer(() => {
  const route = useRoute();
  const PRODUCT = route.params.productInfo;
  const [isProductNew, setProductNew] = useState(PRODUCT.isProductNew);
  const [isProductPopular, setProductPopular] = useState(PRODUCT.isProductPopular);

  const changeProductLabel = () => {
    firestore()
      .collection('products')
      .doc(PRODUCT.id)
      .update({
        isProductNew: isProductNew,
        isProductPopular: isProductPopular
      })
      .then(() => {
        Alert.alert('Başarılı', 'Ürün Durumu Değiştirildi', [{ text: 'TAMAM' }], { cancelable: false })
      });

  }

  const handleToggleProductNew = () => {
    // Mevcut durumu tersine çevirin
    setProductNew(!isProductNew);
  };
  const handleToggleProductPopular = () => {
    // Mevcut durumu tersine çevirin
    setProductPopular(!isProductPopular);
  };

  
 
  console.log('PRODUCT', PRODUCT);
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;
  console.log('PRODUCT.id---', PRODUCT.id);
  const deleteProduct = async (product) => {
    try {
      const productRef = doc(db, 'products', PRODUCT.id);
      await deleteDoc(productRef).then((res) => Alert.alert('Ürün silindi!', 'Ürün başarıyla silindi.', [I18n.t('Ok')], { cancelable: false }));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Header
        backgroundColor={'#fff'}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.navigate('Urunler', { parametreVar: false })

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
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            {userStore.user?.isAdmin ?
              <TouchableOpacity
                style={{ padding: 4, backgroundColor: 'red', borderRadius: 6 }}
                onPress={() => {
                  deleteProduct()
                }}>
                <Text style={{ color: '#fff' }} >Sil</Text>
              </TouchableOpacity>
              : null
            }
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.navigate('MyBag')
              }}>
              <Ionicons name="cart-outline" size={26} color='#000' />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ flexDirection: 'row', marginBottom: -(height / 100 * 2), justifyContent: 'flex-start', zIndex: 10 }}>
            <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 8, borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ color: '#000', fontSize: 13 }} >{I18n.t(PRODUCT.category)}</Text>
              <FontAwesome name='angle-right' size={17} color={'#000'} style={{ marginHorizontal: 4 }} />
              <Text style={{ color: '#000', fontSize: 13 }}>{I18n.t(PRODUCT.model)}</Text>
            </View>
          </View>
          <Carousel
            loop
            width={width}
            height={height * 0.6}
            data={userStore.selectedProductsImages}
            autoPlay={false}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: .5 }}>
                <View style={{ flex: 1 }}>
                  <Image source={{ uri: item }} resizeMethod='scale' resizeMode='contain' style={{ height: '100%', width: '100%', position: 'absolute' }} />
                </View>
              </View>
            )}
          />
          <View style={{ flexDirection: 'row', marginTop: -(height / 100 * 2.5), justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'row', backgroundColor: 'red', padding: 8, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} >
              <Text style={{ color: '#fff', fontSize: 13, padding: 1 }}>{PRODUCT.label}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 17, fontStyle: 'italic' }} >{PRODUCT.title}</Text>
            <View style={{ backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 4 }} >
              <Text style={{ fontSize: 15, fontStyle: 'italic', color: '#fff' }} >{PRODUCT.price} {I18n.t('pieces')}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={{ fontSize: 14, fontStyle: 'italic' }} >{I18n.t('description')}</Text>
          </View>
          <Text style={{color:'red',textAlign:'center'}}>{I18n.t('priceDescription')}</Text>
         { userStore.user?.isAdmin ?
         <View style={{ flexDirection: 'row', padding: 10,justifyContent:'center'}}>
            <View style={{ width: '20%', flexDirection: 'row', alignItems: 'center',  }}>
              <TouchableOpacity style={[styles.buttonContainer,]}
                onPress={() => { handleToggleProductNew() }}>
                <FontAwesome name='circle' size={25} style={[styles.buttonContainer, isProductNew ? styles.buttonActive : styles.buttonInactive]} />
              </TouchableOpacity>
              <Text style={{ color: 'black', marginLeft: '5%' }}>New</Text>
            </View>
            <View style={{ width: '20%', flexDirection: 'row', alignItems: 'center', }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                  handleToggleProductPopular()
                }}>
                <FontAwesome name='circle' size={25} color='black' style={[styles.buttonContainer, isProductPopular ? styles.buttonActive : styles.buttonInactive]}>
                </FontAwesome>
              </TouchableOpacity>
              <Text style={{ color: 'black', marginLeft: '5%' }}>Popular</Text>
            </View> 
          </View> : null }
          

          {userStore.user?.isAdmin ?
            <View style={{ flexDirection: 'row', padding: 10,justifyContent:'center' }}>
            <TouchableOpacity onPress={()=>{changeProductLabel()}}  style={{backgroundColor:'black',borderRadius:10}}>
            <Text style={{ fontSize: 14, fontWeight:'bold',alignSelf:'center',color:'#fff',padding:10 }} >KAYDET</Text>
            </TouchableOpacity>
          </View> : null}
          
        </ScrollView>
        {
          userStore.selectedProduct.quantity > 0 ? 
            <View style={{ flexDirection: 'row', width: '100%', padding: 15, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, backgroundColor: '#000' }} >
              <TouchableOpacity
                style={{ borderWidth: .6, borderColor: '#fff', padding: 5, borderRadius: 4 }}
                onPress={() => {
                  userStore.deleteFromCart(PRODUCT);
                  userStore.setSelectedProduct({ ...PRODUCT, quantity: userStore.selectedProduct.quantity - 1 })
                }}
              >
                <AntDesign name="minus" size={22} color={'#fff'} />
              </TouchableOpacity>
              <Text style={{ color: '#fff', fontSize: 15 }}>{I18n.t('quantityInCart')} {userStore.selectedProduct.quantity}</Text>
              <TouchableOpacity
                style={{ borderWidth: .6, borderColor: '#fff', padding: 5, borderRadius: 4 }}
                onPress={() => {
                  userStore.addToCart(PRODUCT);
                  userStore.setSelectedProduct({ ...PRODUCT, quantity: userStore.selectedProduct.quantity + 1 })
                }}
              >
                <AntDesign name="plus" size={22} color={'#fff'} />
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#000', width: '100%' }}
              onPress={() => {
                userStore.addToCart(PRODUCT);
                userStore.setSelectedProduct({ ...PRODUCT, quantity: userStore.selectedProduct.quantity + 1 })
              }}>
              <FontAwesome name='shopping-cart' size={25} color='white' style={{ marginRight: 10 }}></FontAwesome>
              <Text style={{ color: '#fff', fontSize: 16 }}>{I18n.t('AddToCart')}</Text>
            </TouchableOpacity>
        }

      </View>
    </View>
  )
})

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  header: {
    width: '100%',
    backgroundColor: 'red',
    marginTop: '6%',
    height: '7%'
  },
  imageBox: {
    width: 200,
    height: 250,
    aspectRatio: 1
  },
  buttonContainer: {
    marginRight: 5,
  },
  buttonActive: {
    color: 'green', // True olduğunda yeşil
  },
  buttonInactive: {
    color: 'red', // False olduğunda kırmızı
  },
});