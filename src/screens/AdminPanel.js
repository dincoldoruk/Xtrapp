import { Image, ScrollView, StyleSheet,TouchableOpacity, View, ImageBackground, Dimensions } from 'react-native';
import React from 'react'
import { Button, Header, Text } from '@rneui/base';
import { navigationRef } from '../navigation/navigationRef';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
const AdminPanel = () => {
  const windowHeight = Dimensions.get('window').height/2.5
  return (
    <View style={styles.container}>
      <Image source={require('../assets/auth/bg.jpeg')} style={{height:'100%', width:'100%',flex:1,position:'absolute',zIndex:0, opacity:0.2,marginTop:'16%'}}/>
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
      <View style={{ flex: 1, marginTop: 20,alignItems:'center',justifyContent:'center' }}>
        <Ionicons name='logo-ionitron' color='black' size={windowHeight} style={{}}></Ionicons>
      </View>
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', zIndex: 3 }}>
        <View style={{ flexDirection: 'row' }}>
          <Button
            title={'Yeni Kullanıcı Onaylama'}
            onPress={() => {
              navigationRef.navigate('UserApproveScreen')
            }}
            buttonStyle={styles.button}
            titleStyle={{ fontSize: 16, color: 'white' }}
          >
          </Button>
          <Button
            title={'Yeni Model Ekleme'}
            onPress={() => {
              navigationRef.navigate('NewModelScreen')
            }}
            buttonStyle={styles.button}
            titleStyle={{ fontSize: 16, color: 'white' }}
          >
          </Button>
        </View>
        <View style={{flexDirection:'row'}}>
        <Button
          title={'Geri Bildirimlere Bak'}
          onPress={() => {
            navigationRef.navigate( 'Problems' )
          }}
          titleStyle={{ fontSize: 16, color: 'white' }}
          buttonStyle={styles.button}
        >
        </Button>
        <Button
          title={'Kullanıcı Siparişleri'}
          onPress={() => {
            navigationRef.navigate('OrderAdmin')
          }}
          titleStyle={{ fontSize: 16, color: 'white' }}
          buttonStyle={styles.button}
        >
        </Button>
        </View>
      </View>
    </View>
  )
}
export default AdminPanel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
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
  }
});
