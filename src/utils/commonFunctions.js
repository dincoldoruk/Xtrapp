import firestore from '@react-native-firebase/firestore';
import userStore from '../mobx/userStore';
import { navigationRef } from '../navigation/navigationRef';
import { Alert } from 'react-native';
import I18n from '../localization/i18n/i18n';
import { SET_USER_TO_LOCAL_STORAGE } from './storageFunctions';

export const isUserThere = async (email,password) =>{
    userStore.setLoadingActivity(true);
    if (email.trim().length<1 || password.trim().length<1 ) {
     userStore.setLoadingActivity(false);
     return Alert.alert(I18n.t('UserNotFound'), I18n.t('FieldError'), [I18n.t('Ok')], {cancelable: false})
   }
    
     const loggedInUser = await firestore().doc(`users/${email}`);
     loggedInUser
     .get()
     .then(querySnapshot => {
         if (querySnapshot.exists) {
             const response = querySnapshot.data()
             if(response.isUserDeleted === true){
               userStore.setLoadingActivity(false);
            return Alert.alert(I18n.t('UserNotFound'), I18n.t('EmailError'), [I18n.t('Ok')], {cancelable: false});
             }
             if (response.password === password ) {
                userStore.setUser(response);
               if (response.admin){
                 userStore.setLoadingActivity(false);
                 return navigationRef.navigate('AdminPanel')
                 } 
                 if (response.isUserApproved) {
                   SET_USER_TO_LOCAL_STORAGE({email,password})
                   userStore.setLoadingActivity(false);
                   navigationRef.navigate('DrawerNavigator',{screen:'HomeScreen'});
                   return true;
                 } else{
                      SET_USER_TO_LOCAL_STORAGE({email,password})
                      userStore.setLoadingActivity(false);
                     Alert.alert(I18n.t('WaitingApproval'), I18n.t('WaitingAdminApproval'), [I18n.t('Ok')], {cancelable: false});
                     navigationRef.navigate('WaitingScreen')
                 }
             }else {
                 userStore.setLoadingActivity(false);
                 Alert.alert(I18n.t('WrongPassword'), I18n.t('WrongPasswordAlert'), [I18n.t('Ok')], {cancelable: false});
             }
         } else{
             userStore.setLoadingActivity(false);
             Alert.alert(I18n.t('UserNotFound'), I18n.t('UserNotFoundAlert'), [I18n.t('Ok')], {cancelable: false})
         }

     });
 }