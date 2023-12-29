import AsyncStorage from "@react-native-async-storage/async-storage";
import userStore from "../mobx/userStore";

export const SET_USER_TO_LOCAL_STORAGE = async userCredential => {
    // async-storage a ekledik
    await AsyncStorage.setItem('userCredential', JSON.stringify(userCredential));
  
  };

export const GET_USER_FROM_LOCAL_STORAGE = async () => {
    const USER_CREDENTIAL_STRINGIFY = await AsyncStorage.getItem('userCredential');
    const USER_CREDENTIAL = JSON.parse(USER_CREDENTIAL_STRINGIFY)

    return USER_CREDENTIAL;
  };

export const DELETE_USER_FROM_LOCAL_STORAGE = async () => {
    await AsyncStorage.removeItem('userCredential');
  };


export const GET_USERS_CART_FROM_LOCAL_STORAGE = async () => {
  const USER_CART_STRINGIFY = await AsyncStorage.getItem('USERS_CART');
  const USER_CART = JSON.parse(USER_CART_STRINGIFY)

  return USER_CART;
};