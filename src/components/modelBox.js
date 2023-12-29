import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, Alert, TouchableOpacity, Image, Pressable } from 'react-native'
import { Button, Skeleton } from '@rneui/base'
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import userStore from '../mobx/userStore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import I18n from '../localization/i18n/i18n';
import ActivityModal from './ActivityModal';

const ModelBox = ({ product, onPress }) => {

  const [isLoading, setIsLoading] = useState(true)
  const [isProductInCart, setIsProductInCart] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const [Datas, setDatas] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <ActivityModal isModalVisible={isModalVisible}/>
      <View style={{ width: '100%', height: '75%' }}>
        <Image
          onLoad={() => {
            setIsLoading(false)
            console.log('endd');
          }}
          source={{ uri: product.item.showroomImage }}
          resizeMethod='resize'
          resizeMode='contain'
          style={{ height: null, flex: 1, width: null, opacity: isLoading ? 0 : 1 }} />
        {isLoading ?  <Skeleton animation="wave" width={'100%'} height={'99%'}/> : null }
        {(product.item.isProductNew || product.item.isProductPopular) && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: product.item.isProductNew ? '#30D5C8' : 'red',
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
              zIndex: 1,
              
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {product.item.isProductNew ? 'NEW' : 'POPULAR'}
            </Text>
          </View>
        )}
      </View>
      <Text style={{ marginTop: '10%' }}>{product.item.title}</Text>
      <Text style={{ alignSelf: 'flex-end', color: '#D83F31', marginTop: '5%' }}>{product.item.price} {I18n.t('Pieces')}</Text>
      {isProductInCart ?
        <View style={{ flexDirection: 'row', width: '100%', marginTop: '5%', flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              if (userStore.selectedProduct?.quantity === 1) {
                setIsProductInCart(false)
                userStore.decreaseProductQuantity(userStore.selectedProduct);
              } else {
                userStore.decreaseProductQuantity(userStore.selectedProduct);
                setQuantity(quantity - 1)
              }
            }}>
            <AntDesign name="minus" size={22} color={userStore.selectedProduct?.quantity == 1 ? 'gray' : '#000'} />
          </TouchableOpacity>
          <Text style={{ marginLeft: '2%', marginRight: '2%', color: '#000', fontWeight: 'bold', fontSize: 18 }}>{userStore.selectedProduct?.quantity}</Text>
          <TouchableOpacity onPress={() => {
            userStore.increaseProductQuantity(userStore.selectedProduct);
            setQuantity(quantity + 1)
          }}>
            <AntDesign name="plus" size={22} color='#000' />
          </TouchableOpacity>
        </View>
        :

        <Pressable onPress={() => {
          userStore.increaseProductQuantity({
            name: product.item.title,
            image: product.item.showroomImage,
            quantity: 1,
            price: product.item.price
          });
          userStore.setSelectedProduct(
            {
              name: product.item.title,
              image: product.item.showroomImage,
              quantity: 1,
              price: product.item.price
            }
          )
          setIsProductInCart(true)
        }}>
        </Pressable>
      }

    </Pressable>
  )
};
export default ModelBox;


const styles = StyleSheet.create({
  container: {
    width: '47%',
    aspectRatio: .5,
    padding: 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    //marginHorizontal:5,
  },
});

