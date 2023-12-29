import I18n from 'react-native-i18n';
import tr from '../tr';
import ru from '../ru';
import en from '../en';
import ar from '../ar';
import pl from '../pl';
import bg from '../bg';
import ro from '../ro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userStore from '../../mobx/userStore';
import { navigationRef } from '../../navigation/navigationRef';

I18n.defaultLocale = "tr";

I18n.locale = userStore.lang;

I18n.fallbacks = true;

I18n.locales.no = 'tr';

I18n.translations = {
  ru,
  tr,
  en,
  bg,
  pl,
  ro,
  ar,
};

AsyncStorage.getItem('selectedLocale').then(locale => {
    if (locale) {
      I18n.locale = locale;
      userStore.setUsersLang(locale);
      userStore.setUsersCountryByLocale(locale);
    }
  });

export default I18n;
export const changeLanguage = async newLocale => {
    // async-storage a ekledik
    await AsyncStorage.setItem('selectedLocale', newLocale);
    
    userStore.setUsersLang(newLocale)
    // i18n dili değişti 
    I18n.locale = newLocale;
    //lang degisikligini welcome screen de trigger etmek icin
    userStore.setTriggerLangRender()
  
  };