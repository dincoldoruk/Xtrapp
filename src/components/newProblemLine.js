import React,{useState} from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, Alert, TouchableOpacity, Pressable, Modal, ScrollView} from 'react-native'
import { Button } from '@rneui/base'
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';

const NewProblemLine = ({ item }) => {
    const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ flexDirection: 'row', width: '100%', borderColor: 'grey', borderBottomWidth: 1, marginTop: 5, flex: 5 }}>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Problem</Text>
            <Text style={styles.modalText1}>Yazar: {item.user}</Text>
            <Text style={styles.modalText1}>Konu: {item.problem}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Okudum</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={{flexDirection:'row'}}>
      <View style={{ flexDirection: 'column', width: '87%', alignItems: 'flex-start' }}>
      <TouchableOpacity style={{flexDirection:'row'}}  onPress={() => {setModalVisible(true)}}>
        <Ionicons name="clipboard-sharp" size={50} color={'black'} />
        <View style={{flexDirection:'column'}}>
        <Text style={{ fontSize: 15,color:'black'}}>Yazar:{item.user}</Text>
        <Text style={{ fontSize: 15,marginTop:4,color:'black'}}>Email:{item.useremail}</Text>
        </View>
        </TouchableOpacity>
      </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              firestore()
                .collection('problems')
                .doc(item.id)
                .update({
                  isFormRead: true,
                })
                .then(() => {
                  Alert.alert('Başarılı', 'Form Okundu.', [{ text: 'TAMAM' }], { cancelable: false })
                });
            }}
            style={styles.opacity} >
            <Ionicons name="checkbox-sharp" size={40} color={'green'} />
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  )
}
export default NewProblemLine


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  button: {
    right: 0,
    width: 100,
    marginBottom:15 ,
    borderColor: '#040D12',
    borderWidth: 0.6,
    opacity: 1,

  },
  input: {
    backgroundColor: 'red'

  },
  opacity: {
    width: '100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width:'80%',
    height:'35%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop:'10%'
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight:'bold',
    fontSize:20,
    color:'black'
  },
  modalText1: {
    marginBottom: 15,
    textAlign: 'left',
    fontWeight:'bold',
    fontSize:15
  },
});

