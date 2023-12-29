import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, Alert, TouchableOpacity, Image, Pressable, Dimensions } from 'react-native'
import { Button, Skeleton } from '@rneui/base'
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import userStore from '../mobx/userStore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import I18n from '../localization/i18n/i18n';
import ActivityModal from './ActivityModal';

const OrderBox = ({ product,index}) => {
  const width = Dimensions.get('window').width
  const [isLoading, setIsLoading] = useState(true)

  return (
    <View  style={[styles.container,{width:width/3.5}]}>
      <View
            style={{
              position: 'absolute',
              backgroundColor: 'black',
              height:20,
              width:20,
              borderRadius: 10,
              zIndex: 99,
              justifyContent:'center',
              marginLeft:2,
              marginTop:12,
              
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold',textAlign:'center' }}>
            {product.price}
            </Text>
          </View>
      <View style={{ width:'100%', height:'100%' }}>
        <Image
          onLoad={() => {
            setIsLoading(false)
            console.log('endd');
          }}
          source={{ uri: product.image }}
          resizeMethod='resize'
          resizeMode='contain'
          style={{ height: null, flex: 1, width: null, opacity: isLoading ? 0 : 1 }} />
        {isLoading ?  <Skeleton animation="wave" width={'100%'} height={'99%'}/> : null }
      </View>
    </View>
  )
};
export default OrderBox;


const styles = StyleSheet.create({
  container: {
    height:'100%',
    //marginHorizontal:5,
  },
});

