import { Button, Text, Avatar } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, TextInput, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, ActivityIndicator, Modal } from 'react-native';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { observer } from 'mobx-react';
import { Header } from '@rneui/base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import { FlatList } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Carousel from 'react-native-reanimated-carousel';
import { listAll, getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../App';
import ModelBox from '../components/modelBox';
import userStore from '../mobx/userStore';
import I18n from '../localization/i18n/i18n';
import ActivityModal from '../components/ActivityModal';
import ModelBoxV2 from '../components/modelBoxV2';
import { BackHandler } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import navigation from '../navigation/navigation';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = observer(() => {
  const isScreenFocused = navigationRef.isFocused();
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (isScreenFocused) {
          // Eğer ekranda ise geri gitme tuşunu devre dışı bırak
          return true; // Varsayılan geri gitme işlemini engeller
        } else {
          // Ekranda değilse varsayılan işlem devam eder
          return false;
        }
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [isScreenFocused])
  );
  
  const myStorage = getStorage();
  const [newImageList, setNewImageList] = useState([]);
  const [popularImageList, setPopularImageList] = useState([]);

  const renderItem = (product, i) => {
    const getProductInformation = async () => {
      const imageListRef = ref(myStorage, product.item.fbStoragePath);
      userStore.setLoadingActivity(true);
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
          userStore.setSelectedProductsImages(PhotoList).then(() => {
            setTimeout(() => {
              navigationRef.navigate('ProductDetailScreen', {
                productInfo: product.item
              })
            }, 250)
            userStore.setLoadingActivity(false);
            const productQuantity = userStore.getProductQuantityInCart(product.item);
            console.log('QUANT', productQuantity);
            userStore.setSelectedProduct({ ...product.item, quantity: productQuantity })
          });

        }).catch((error) => {
          userStore.setLoadingActivity(false);
          console.log('error', error)
        });
    }

    return (
      <ModelBoxV2
        key={i}
        product={product}
        onPress={() => {
          userStore.user ?
            getProductInformation()
            :
            Alert.alert(
               I18n.t('Sorry'),
               I18n.t('NotLogin'),
              [
                {
                  text: I18n.t('Login'), onPress: () =>
                    navigationRef.navigate('LoginScreen')
                }, { text: I18n.t('Continue'), onPress: () => navigationRef.goBack, style: 'cancel' }],
              { cancelable: false }
            );
        }}
      />
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      // Yeni ürünleri getir
      const newQuerySnapshot = await getDocs(query(collection(db, "products"), where("isProductNew", "==", true)));
      const newImages = [];
      newQuerySnapshot.forEach((doc) => {
        newImages.push({ ...doc.data(), id: doc.id });
      });
      setNewImageList(newImages);

      // Popüler ürünleri getir
      const popularQuerySnapshot = await getDocs(query(collection(db, "products"), where("isProductPopular", "==", true)));
      const popularImages = [];
      popularQuerySnapshot.forEach((doc) => {
        popularImages.push({ ...doc.data(), id: doc.id });
      });
      setPopularImageList(popularImages);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getAndSaveFCMToken = async () => {
      try {
        // Kullanıcının cihazından FCM token'ını al
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          // FCM token'ı başarıyla alındı, Firestore veya Realtime Database'e kaydet
          await firestore().collection('users').doc(userStore.user.email).update({
            fcmToken: fcmToken,
          });
          console.log('FCM token başarıyla Firestore\'a kaydedildi:', fcmToken);
        } else {
          console.log('Kullanıcının FCM token\'ı yok.');
        }
      } catch (error) {
        console.error('FCM token alınamadı veya kaydedilemedi:', error);
      }
    };

    // Kullanıcının FCM token'ını al ve Firebase'e kaydet
    getAndSaveFCMToken();

    // Clean up effect
    return () => {
      // Gerekirse event listenerları temizle
    };
  }, []);


  const width = Dimensions.get('window').width;
  const [imgUri, setImgUri] = useState(false);
  const [imgArr, setImgArr] = useState([]);
  const [productCode, setProductCode] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  async function selectImage() {
    // You can also use as a promise without 'callback':
    const reference = storage().ref(productCode);
    const result = await launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response.assets[0].uri;
        console.log(source);
        setImage(source);
      }
    });
  }
  const selectImage1 = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log(response);
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    const filename = image.substring(image.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;

    //await reference.putFile(uploadUri);

    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Resim Yüklendi!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    setImage(null);
  };
  const DATA1 = [
    {
      image: require('../assets/auth/women-bg.jpeg'),
      image2: require('../assets/auth/women-bg1.jpeg')
    },
    {
      image: require('../assets/auth/welcome-img.jpeg'),
      image2: require('../assets/auth/welcome2.jpeg')
    },
  ]
  const DATA = [
    { title: 'gomlek', image: require('../assets/clothicons/gomlek.png') },
    { title: 'mont', image: require('../assets/clothicons/jacket.png') },
    { title: 'bluz', image: require('../assets/clothicons/blouse.png') },
    { title: 'etek', image: require('../assets/clothicons/skiirt.png') },
    { title: 'sweatshirt', image: require('../assets/clothicons/hoodie.png') },
    { title: 'tshirt', image: require('../assets/clothicons/shirt.png') },
    { title: 'elbise', image: require('../assets/clothicons/dress.png') },
    { title: 'pantolon', image: require('../assets/clothicons/trousers.png') },
    { title: 'esofman', image: require('../assets/clothicons/pants.png') },
  ];

  const Item = ({ image, title }) => (
    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
      <TouchableOpacity style={{ alignItems: 'center', width: '100%', height: '100%', marginLeft: 10 }}
        onPress={() => {
          userStore.user ?
            navigationRef.navigate('Urunler', {
              parametreVar: true,
              parametre: { title },
            }) :
            Alert.alert(
              I18n.t('Sorry'),
               I18n.t('NotLogin'),
              [
                {
                  text: I18n.t('Login'), onPress: () =>
                    navigationRef.navigate('LoginScreen')
                }, { text: I18n.t('Continue'), onPress: () => navigationRef.goBack, style: 'cancel' }],
              { cancelable: false }
            );
        }}>
        <Avatar
          rounded
          source={image}
          size={65}
          imageProps={{ resizeMode: 'contain', resizeMethod: 'scale' }}
          containerStyle={{ padding: 10, backgroundColor: '#f0f0f0' }}
        />
        <Text style={{ fontSize: 12 }}>{I18n.t(title)}</Text>
      </TouchableOpacity>
    </View>
  );
  const numColumns = Math.ceil(DATA.length / 1);

  return (

    <View style={styles.container}>
      <ScrollView >
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
                  userStore.user ?
                    navigationRef.navigate('MyBag')
                    :
                    Alert.alert(
                      I18n.t('Sorry'),
                       I18n.t('NotLogin'),
                      [
                        {
                          text: I18n.t('Login'), onPress: () =>
                            navigationRef.navigate('LoginScreen')
                        }, { text: I18n.t('Continue'), onPress: () => navigationRef.goBack, style: 'cancel' }],
                      { cancelable: false }
                    );

                }}>
                <Ionicons name="cart-outline" size={26} color='#000' />
              </TouchableOpacity>
            </View>
          }
        />
        {userStore.triggerLangRender}
        <ScrollView horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: '5%', marginRight: '1%', marginLeft: '1%', marginBottom: '5%' }}>
          <FlatList
            scrollEnabled={false}
            data={DATA}
            renderItem={({ item }) => <Item image={item.image} title={item.title} />}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        </ScrollView>
        <View style={{}}>

          <Carousel
            loop
            width={width}
            height={width * 0.75}
            data={DATA1}
            autoPlay={true}
            scrollAnimationDuration={1000}
            autoPlayInterval={10000}
            renderItem={({ item }) => (
              <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{ flex: 0.5 }}>
                  <Image source={item.image} resizeMethod='scale' resizeMode='contain' style={{ height: '100%', width: '100%', position: 'absolute' }} />
                </View>
                <View style={{ flex: 0.5 }}>
                  <Image source={item.image2} resizeMethod='scale' resizeMode='contain' style={{ height: '100%', width: '100%', position: 'absolute' }} />
                </View>
              </View>
            )}
          />
        </View>
        <View style={{ marginTop: '10%' }}>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, alignItems: 'center', marginLeft: '3%', flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="new-box" size={26} color='#30D5C8' />
              <Text style={{ fontSize: 16, color: '#000', textAlign: 'center' }}>{I18n.t('NewProducts')}</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}
              onPress={() => {
                userStore.user ?
                  navigationRef.navigate('Urunler', { parametreVar: false })
                  :
                  Alert.alert(
                    I18n.t('Sorry'),
                     I18n.t('NotLogin'),
                    [
                      {
                        text: I18n.t('Login'), onPress: () =>
                          navigationRef.navigate('LoginScreen')
                      }, { text: I18n.t('Continue'), onPress: () => navigationRef.goBack, style: 'cancel' }],
                    { cancelable: false }
                  );
              }}>
              <Text style={{ fontSize: 16, color: '#000', opacity: 0.6 }}>{I18n.t('More')} </Text>
              <FontAwesome name="angle-right" size={24} color="#000" style={{ marginLeft: '3%', opacity: 0.6 }} />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{ marginTop: '3%' }}
            data={newImageList}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={0}
            renderItem={renderItem}
            keyExtractor={(item, i) => i}
          />
        </View>
        <View style={{ marginTop: '5%' }}>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, alignItems: 'center', marginLeft: '3%', flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="heart-box" size={26} color='red' />
              <Text style={{ fontSize: 16, color: '#000', textAlign: 'center' }}>{I18n.t('PopularProducts')}</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}
              onPress={() => {
                userStore.user ?
                  navigationRef.navigate('Urunler', { parametreVar: false })
                  :
                  Alert.alert(
                    I18n.t('Sorry'),
                     I18n.t('NotLogin'),
                    [
                      {
                        text: I18n.t('Login'), onPress: () =>
                          navigationRef.navigate('LoginScreen')
                      }, { text: I18n.t('Continue'), onPress: () => navigationRef.goBack, style: 'cancel' }],
                    { cancelable: false }
                  );
              }}>
              <Text style={{ fontSize: 16, color: '#000', opacity: 0.6 }}>{I18n.t('More')} </Text>
              <FontAwesome name="angle-right" size={24} color="#000" style={{ marginLeft: '3%', opacity: 0.6 }} />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{ marginTop: '3%', marginBottom: '8%' }}
            data={popularImageList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, i) => i}
          />
        </View>
      </ScrollView>
      <Modal
        visible={userStore.loadingActivity}
        transparent={true}
        animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '25%', height: '25%', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../assets/auth/loading.png')}
              resizeMethod='resize'
              resizeMode='contain'
              style={{ height: '100%', width: '100%' }}
            />
            <ActivityIndicator size='small' color='#fff' style={{ zIndex: 1, position: 'absolute', bottom: '30%' }}></ActivityIndicator>
          </View>
        </View>
      </Modal>
    </View>
  )
})
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  header: {
    width: '100%',
    marginTop: '6%',
    height: '7%'
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    width: '80%',
    borderRadius: 10,
    marginLeft: 15,
    height: 45,
    color: 'black',
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: 200,
    height: 250,
    aspectRatio: 1
  }
});