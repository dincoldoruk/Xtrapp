import { View, StyleSheet, TouchableOpacity, Image, Alert, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Text, Header, Input, Button } from '@rneui/base'
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import firestore from '@react-native-firebase/firestore';
import { getDownloadURL } from "firebase/storage";
import { db } from '../../App';
import { addDoc, collection } from 'firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import I18n from '../localization/i18n/i18n';


const NewModelScreen = () => {
  const productCategory = ['ustgiyim', 'altgiyim']
  const productModelTop = ['gomlek', 'mont',  'bluz','sweatshirt','tshirt','elbise',]
  const productModelBottom = ['pantolon', 'esofman','etek']
  const [productCode, setProductCode] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [label, setLabel] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(productCategory[0]);
  const [selectedModel, setSelectedModel] = useState(productModelTop[0]);
  const [productModel, setProductModel] = useState(productModelTop);
  const [showroomImage, setShowroomImage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [isProductNew, setProductNew] = useState(false);
  const [isProductPopular, setProductPopular] = useState(false);

  const handleToggleProductNew = () => {
    // Mevcut durumu tersine çevirin
    setProductNew(!isProductNew);
  };
  const handleToggleProductPopular = () => {
    // Mevcut durumu tersine çevirin
    setProductPopular(!isProductPopular);
  };


  async function selectImage() {
    // You can also use as a promise without 'callback':
    const reference = storage().ref(productCode);
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const imagesFilePaths = [];
        response.assets.forEach((file) => {
          imagesFilePaths.push(file.uri);
        })
        console.log(imagesFilePaths);
        setImages(imagesFilePaths);
      }
    });
  }
  async function uploadProduct() {
    const showroomFileName = images[showroomImage].substring(images[showroomImage].lastIndexOf('/') + 1)
    const showroomImgUploadUri = Platform.OS === 'ios' ? images[showroomImage].replace('file://', '') : images[showroomImage];
    console.log('showroomFileName', showroomFileName);
    const now = new Date().getTime();
    storage()
      .ref(selectedModel + productCode + now + '/' + showroomFileName)
      .putFile(showroomImgUploadUri).then(async () => {
        const mainImageDownURL = await storage().ref(selectedModel + productCode + now + '/' + showroomFileName).getDownloadURL();
        var promises = images.map(async (image) => {
          const filename = image.substring(image.lastIndexOf('/') + 1);
          const uploadUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
          if (uploadUri == showroomImgUploadUri) return;

          setUploading(true);
          setTransferred(0);
          const task = storage()
            .ref(selectedModel + productCode + now + '/' + filename)
            .putFile(uploadUri)
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
        })
        const docRef = await addDoc(collection(db, "products"), {
          title,
          label,
          fbStoragePath: '/' + selectedModel + productCode + now,
          productCode:productCode,
          showroomImage: mainImageDownURL,
          category: selectedCategory,
          model: selectedModel,
          price: price,
          isProductNew,
          isProductPopular,
        });
        console.log("Document written with ID: ", docRef.id);

        Promise.all(promises).then(() => {
          setUploading(false);
          setImages([])
          Alert.alert(
            'Tüm Resimler Yüklendi!',
            'Your photo has been uploaded to Firebase Cloud Storage!'
          );
        })
      })

  }
  return (
    <View style={styles.container}>
      <Header
        backgroundColor={'#000000'}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.dispatch(DrawerActions.toggleDrawer())
              }}>
              <Ionicons name="menu" color={'white'} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text h4 h4Style={{ fontSize: 15, alignSelf: 'center', fontWeight: '400', fontStyle: 'italic', color: '#fff', marginTop: 5 }} >Yeni Model</Text>
          </View>
        }
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.rows}>
            <Text style={{ color: '#fff' }}>Kategori Seçin</Text>
            <SelectDropdown
              data={productCategory}
              onSelect={(selectedItem, index) => {
                switch (selectedItem) {
                  case 'ustgiyim':
                    setProductModel(productModelTop)
                    setSelectedModel(productModelTop[0])
                    break;
                  case 'altgiyim':
                    setProductModel(productModelBottom)
                    setSelectedModel(productModelBottom[0])
                    break;
                  case 'Cart Giyim':
                    setProductModel(productModelTop)
                    setSelectedModel(productModelTop[0])
                    break;
                  case 'Curt Giyim':
                    setProductModel(productModelTop)
                    setSelectedModel(productModelTop[0])
                    break;
                  default:
                    setProductModel(productModelTop)
                    setSelectedModel(productModelTop[0])
                    break;
                }
                setSelectedCategory(selectedItem)
              }}
              buttonStyle={{ width: '50%', backgroundColor: '#000' }}
              defaultValue={productCategory[0]}
              rowTextStyle={{ fontSize: 14, color: '#fff' }}
              rowStyle={{ backgroundColor: '#7D7C7C' }}
              text
              buttonTextStyle={{ fontSize: 14, color: '#fff' }}
              buttonTextAfterSelection={(selectedItem, index) => {
                console.log(selectedItem)
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return I18n.t(item);
              }}
              renderCustomizedButtonChild={(text) => {
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#fff' }}>{I18n.t(text)}</Text>
                    <Ionicons name="arrow-down-circle-outline" color={'#fff'} size={26} />
                  </View>
                )
              }
              }
            />
          </View>
          <View style={styles.rows}>
            <Text style={{ color: '#fff' }}>Model Seçin</Text>
            <SelectDropdown
              data={productModel}
              onSelect={(selectedItem, index) => {
                setSelectedModel(selectedItem)
              }}
              buttonStyle={{ width: '50%', backgroundColor: '#000' }}
              defaultValue={productModelTop[0]}
              rowTextStyle={{ fontSize: 14, color: '#fff' }}
              rowStyle={{ backgroundColor: '#7D7C7C' }}
              buttonTextStyle={{ fontSize: 14, color: '#fff' }}
              buttonTextAfterSelection={(selectedItem, index) => {
                console.log(selectedItem)
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                return I18n.t(item);
              }}
              renderCustomizedButtonChild={(text) => {
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#fff' }}>{I18n.t(text)}</Text>
                    <Ionicons name="arrow-down-circle-outline" color={'#fff'} size={26} />
                  </View>
                )
              }
              }
            />
          </View>
          <View style={styles.rows}>
            <Text style={{ color: '#fff' }}>Ürün Kodu:</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.inputs}
              placeholder={'Ürün kodu girin'}
              placeholderTextColor={'gray'}
              value={productCode}
              onChangeText={code => {
                setProductCode(code)
              }}
            />
          </View>
          <View style={styles.rows}>
            <Text style={{ color: '#fff' }}>Ürün başlığı:</Text>
            <TextInput
              autoCapitalize="none"
              style={[styles.inputs, { width: '50%' }]}
              placeholder={'Ürün kodu girin'}
              placeholderTextColor={'gray'}
              value={title}
              onChangeText={title =>
                setTitle(title)
              }
            />
          </View>
          <View style={styles.rows}>
            <Text style={{ color: '#fff' }}>Ürün Durumu:</Text>
            <View style={{ width: '20%', flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity style={[styles.buttonContainer,]}
                onPress={() =>{handleToggleProductNew()}}>
                <FontAwesome name='circle' size={25} style={[styles.buttonContainer,isProductNew ? styles.buttonActive : styles.buttonInactive]}/>
              </TouchableOpacity>
              <Text style={{ color: '#fff' }}>New</Text>
            </View>
            <View style={{ width: '20%', flexDirection: 'row', alignItems: 'center',marginRight:10 }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                 handleToggleProductPopular()}}>
                <FontAwesome name='circle' size={25} color='black' style={[styles.buttonContainer,isProductPopular ? styles.buttonActive : styles.buttonInactive]}>
                  <Text></Text>
                </FontAwesome>
              </TouchableOpacity>
              <Text style={{ color: '#fff' }}>Popular</Text>
            </View>
          </View>
          <View style={styles.rows}>
            <Text style={{ color: '#fff' }}>Ürün etiketi:</Text>
            <TextInput
              autoCapitalize="none"
              style={[styles.inputs, { width: '50%' }]}
              placeholder={'Etiket girin'}
              placeholderTextColor={'gray'}
              value={label}
              onChangeText={label =>
                setLabel(label)
              }
            />
          </View>
          <View style={styles.rows}>
            <Text style={{ color: '#fff' }}>Seri Adedi:</Text>
            <TextInput
              autoCapitalize="none"
              style={[styles.inputs, { width: '40%' }]}
              placeholder={'Seri Adedi'}
              placeholderTextColor={'gray'}
              keyboardType='number-pad'
              value={price}
              onChangeText={title =>
                setPrice(title)
              }
            />
          </View>
          <View style={[styles.rows, { borderBottomWidth: 0.1 }]}>
            <Text style={{ color: '#fff' }}>Resim Ekle</Text>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={selectImage}>
              <Text style={{ color: '#fff', alignSelf: 'center', marginRight: 10 }}>Ekle</Text>
              <Ionicons name="add-circle-outline" color={'#fff'} size={30} />
            </TouchableOpacity>
          </View>
          <View style={[styles.rows, { minHeight: '15%' }]}>
            <Text style={{ color: '#fff', flex: 1 }}>Resimler</Text>
            <View style={{ flex: 3, height: '100%', backgroundColor: '#7D7C7C', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {
                images.map((img, i) => {
                  return (
                    <TouchableOpacity key={i} onPress={() => { setShowroomImage(i) }} style={[styles.imageBox, { borderWidth: showroomImage == i ? 4 : 0, borderColor: 'green' }]}>
                      <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          </View>
          <View style={styles.imageContainer}>

            {uploading ? (
              <View style={styles.progressBarContainer}>
                <Progress.Bar progress={transferred} width={300} />
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={uploadProduct}>
                <Text style={styles.buttonText}> Ürünü Yayınla ! </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default NewModelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#040D12',
  },
  header: {
    width: '100%',
    backgroundColor: 'red',
    marginTop: '6%',
    height: '7%'
  },
  button: {
    marginLeft: 10,
    backgroundColor: 'black',
    right: 0,
    width: 150,
    marginBottom: 30,
    borderColor: '#040D12',
    borderWidth: 0.6,
    opacity: 1
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#fff',

    padding: 10,
    width: '50%',
    borderRadius: 3,
    marginLeft: 0,
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
    backgroundColor: '#F1EFEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500'
  },
  imageContainer: {
    alignItems: 'center'
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: '30%',
    height: '100%',
    aspectRatio: .8,
    marginHorizontal: 2
  },
  rows: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#434242',
    borderBottomWidth: .5,
    borderBottomColor: '#fff',
  },
  buttonContainer: {
    marginRight:5,
  },
  buttonActive: {
    color: 'green', // True olduğunda yeşil
  },
  buttonInactive: {
    color: 'red', // False olduğunda kırmızı
  },

});