import React from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, Alert, TouchableOpacity } from 'react-native'
import { Button } from '@rneui/base'
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';

const NewUserLine = ({ item }) => {
  return (
    <View style={{ flexDirection: 'row', width: '100%', borderColor: 'grey', borderBottomWidth: 1, marginTop: 5, flex: 5 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="id-card-sharp" size={40} color={'black'} />
      </View>
      <View style={{ flexDirection: 'column', flex: 2.5, width: '100%', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 20 }}>{item.nameSurname}</Text>
        <Text style={{ marginBottom: 5, fontSize: 10 }}> {item.email}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text><Ionicons name="call-sharp" size={20} color={'black'} /></Text>
          <Text style={{ marginLeft: 2, fontFamily: 'Roboto-Medium' }}>{item.phone}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              firestore()
                .collection('users')
                .doc(item.id)
                .update({
                  isUserApproved: true,
                })
                .then(() => {
                  Alert.alert('Başarılı', 'Kullanıcı onaylandı.', [{ text: 'TAMAM' }], { cancelable: false })
                });
                const orderID = `${item.email}_${'order'}`;
                firestore()
                .collection('orders')
                .doc(orderID)
                .set({})

            }}
            style={styles.opacity} >
            <Ionicons name="checkbox-sharp" size={40} color={'green'} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Kullanıcıyı silmek istediğine emin misin Murat abi ?',
                'Kullanıcı tamamen silinir!',
                [
                  {
                    text: 'Evet', onPress: () =>
                      firestore()
                        .collection('users')
                        .doc(item.id)
                        .delete()
                        .then(() => {
                          Alert.alert('Başarılı', 'Kullanıcı silindi.', [{ text: 'TAMAM' }], { cancelable: false })
                        })
                  }, { text: 'Hayır', onPress: () => navigationRef.goBack, style: 'cancel' }],
                { cancelable: false }
              );
            }}
            style={styles.opacity}>
            <Ionicons name="remove-circle-sharp" size={40} color={'red'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
export default NewUserLine


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    right: 0,
    width: 100,
    marginBottom: 15,
    borderColor: '#040D12',
    borderWidth: 0.6,
    opacity: 1,

  },
  input: {
    backgroundColor: 'red'

  },
  opacity: {
    width: '100%',


  }
});