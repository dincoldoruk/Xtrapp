import { View, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { listAll, getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';
import ModelBox from '../components/modelBox';
import { Button, Header, Text } from '@rneui/base';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from '../../App';
import { collection, getDocs, query, where } from 'firebase/firestore';
import storage from '@react-native-firebase/storage';
import userStore from '../mobx/userStore';
import SelectDropdown from 'react-native-select-dropdown';
import I18n from '../localization/i18n/i18n';
import { observer } from 'mobx-react';

const Urunler = observer(({route}) => {
  const myStorage = getStorage();
  const [imageList, setImageList] = useState([]);
  const twoArr = ['item1', 'item2', 'item3', 'item4'];
  const [modelFilters, setModelFilter] = useState('');
  const productCategory = ['Üst Giyim', 'Alt Giyim'];
  const productModelTop = ['Gömlek', 'Tişört', 'Mont', 'Ceket'];
  const productModelBottom = ['Pantolon', 'Şort', 'Ayakkabı'];
  const [productModel, setProductModel] = useState(productModelTop);
  const [selectedModel, setSelectedModel] = useState(productModelTop[0]);
  const [selectedCategory, setSelectedCategory] = useState(productCategory[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const modelFilterAll = query(collection(db, "products"));
  const { parametreVar , parametre } = route.params;

  function createModelFilterQuery(collectionName, field, value) {
    return query(collection(db, collectionName), where(field, "==", value));
  }
  const DATA = [
    {title: 'all',},{title: 'gomlek',},{title: 'mont',},{title: 'bluz',},{title: 'sweatshirt',},{title: 'tshirt',},{title: 'elbise',},{title: 'pantolon',},{title: 'esofman',},{title: 'etek',}];

  const Item = ({  title }) => (
    <View style={{ flexDirection: 'column', alignItems: 'center',backgroundColor:'#000',marginHorizontal:4,padding:6}}>
      <TouchableOpacity style={{ alignItems: 'center', width: '100%', height: '100%'}} 
       onPress={()=>{navigationRef.navigate('Urunler', { parametreVar: title == 'all' ? false : true, 
       parametre: {title}, });
       }}>
        <Text style={{textAlignVertical:'center',borderRadius:5,color:'#fff'}}>{I18n.t(title)}</Text>
      </TouchableOpacity>
    </View>
  );
  const numColumns = Math.ceil(DATA.length / 1);

  const renderItem = (product, i) => {
    return (
      <ModelBox
        key={i}
        product={product}
        onPress={() => {
          setModalVisible(true);
          const getProductInformation = async () => {
            const imageListRef = ref(myStorage, product.item.fbStoragePath);
            listAll(imageListRef)
              .then(async (res) => {
                const selectedProdImages = [];
                async function getPhotoUrl(item, index) {
                  const imageDownloadURL = await storage().ref(item.path).getDownloadURL();
                  return imageDownloadURL;
                }
                const PhotoList = await Promise.all(
                  res.items.map(getPhotoUrl)
                );
                userStore.setSelectedProductsImages(PhotoList).then(()=>{
                  setTimeout(()=>{navigationRef.navigate('ProductDetailScreen',{
                    productInfo: product.item
                  })},250)
                  setModalVisible(false);
                  const productQuantity = userStore.getProductQuantityInCart(product.item);
                  console.log('QUANT',productQuantity);
                  userStore.setSelectedProduct({...product.item,quantity: productQuantity})
                });

              }).catch((error) => {
                setModalVisible(false);
                console.log('error', error)
              });
          }
          getProductInformation()
          //navigationRef.navigate('ProductDetailScreen')
        }}
      />
    )
  }
  useEffect(() => {
    const getAllProducts = async () => {
      let querySnapshot;
      const allProductsFromFB = [];
      console.log(parametre)
      if (parametreVar) {
        querySnapshot = await getDocs(query(collection(db, "products"),where("model","==",parametre.title)));
        console.log('geldik ama olmadı')
      } else {
        querySnapshot = await getDocs(modelFilterAll);
      }
        querySnapshot.forEach((doc) => {
          allProductsFromFB.push({...doc.data(),id:doc.id})
        });
      setImageList(allProductsFromFB);
      userStore.setAllProducts(allProductsFromFB)
    };
  
    getAllProducts();
  }, [parametreVar, parametre]);

  return (
    <View style={styles.container}>
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
        rightComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
      <ScrollView horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: '5%', marginRight: '1%', marginLeft: '1%',marginBottom:'4%',height:'5%'}}>
          <FlatList
            scrollEnabled={false}
            data={DATA}
            renderItem={({ item }) => <Item title={item.title} />}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        </ScrollView>
        <FlatList
          data={imageList}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-around', marginTop: 5 ,flexWrap:'nowrap'}}
          renderItem={renderItem}
          keyExtractor={(item, i) => i}
          style={{ width: '100%', height: '100%', }}
        />
      </View>
      <Modal
        visible={modalVisible} 
        transparent={true} 
        animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{width:'25%',height:'25%',justifyContent:'center',alignItems:'center'}}>
          <Image
            source={require('../assets/auth/loading.png')} 
            resizeMethod='resize'
            resizeMode='contain'
            style={{height:'100%',width:'100%'}}
          />
          <ActivityIndicator size='small' color='#fff' style={{zIndex:1,position:'absolute',bottom:'30%'}}></ActivityIndicator>
          </View>
        </View>
      </Modal>
    </View>

  )
});

export default Urunler;

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
  }
});