//import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {observable, action, configure, makeObservable, toJS} from 'mobx';

configure({
  enforceActions: 'observed',
});
// Derin karşılaştırma fonksiyonu
function deepEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === 'object' && typeof val2 === 'object') {
      if (!deepEqual(val1, val2)) {
        return false;
      }
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
}


class userStore {
  @observable car;
  @observable user;
  @observable lang;
  @observable country = 'Türkçe';
  @observable UserCart = [];
  @observable selectedProduct;
  @observable selectedProductsImages = [];
  @observable allProducts = [];
  @observable triggerCartRender = false;
  @observable productQuantityInCart = 0;
  @observable triggerLangRender = false;
  @observable loadingActivity = false;
  constructor() {
    makeObservable(this);
  }

  @action setLoadingActivity = (activity) => {
    this.loadingActivity = activity
  }
  @action setUserCart = async CART => {
    this.UserCart = CART;
  };
  @action setUsersLang = async lang => {
    this.lang = lang;
    this.setUsersCountryByLocale(lang)
  };
  @action setUserCountry = async country => {
    this.country = country;
  };
  @action setUser= async data => {
    this.user = data;
  };
  @action increaseProductQuantity = async item => {
    this.UserCart[index].quantity += 1 ; // 2nd parameter means remove one item only
  };
  @action decreaseProductQuantity = async UserCart => {
    const index = this.UserCart.indexOf(UserCart);
    if (index > -1) { // only splice array when item is found
      this.UserCart[index].quantity -= 1 ; // 2nd parameter means remove one item only

    }
    console.log(this.UserCart);
  };
  @action deleteProductFromCart = async (product) => {
    const productIndex = this.findProductIndex(product);

    if (productIndex !== -1) {
        this.UserCart.splice(productIndex, 1);
  
    }
    this.setTriggerRender();
  };
  @action deleteFromCart = async (product) => {
    const productIndex = this.findProductIndex(product);
    if (productIndex !== -1) {
        const item = this.UserCart[productIndex];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            this.UserCart.splice(productIndex, 1);
        }
  
    }
    this.setTriggerRender();
  };
  @action clearCart = () => {
    this.UserCart = [];
    this.setTriggerRender();
  };
  @action setSelectedProduct = async product => {
    this.selectedProduct = product;
  };
  @action setSelectedProductsImages = async images => {
    this.selectedProductsImages = images
  };
  @action setAllProducts = async products => {
    this.allProducts = products
  };
  @action findProductIndex = (product) => {
    return this.UserCart.findIndex(item => deepEqual(item.productInfo, product));
  };
  @action addToCart = async (product) => {
    const productIndex = this.findProductIndex(product);

    if (productIndex !== -1) {
        this.UserCart[productIndex].quantity += 1;
    } else {
        this.UserCart.push({ productInfo: product, quantity: 1 });
    }
    this.setTriggerRender();
  };
  @action setTriggerRender = () => {
    this.triggerCartRender = !this.triggerCartRender
  } 
  @action getProductQuantityInCart = (product) => {
    const productIndex = this.findProductIndex(product);
    if (productIndex !== -1) {
        const item = this.UserCart[productIndex];
        return item.quantity
    }else{
      return 0;
    }
  };
  @action setTriggerLangRender = () => {
    this.triggerLangRender = !this.triggerLangRender; 
  }
  @action setUsersCountryByLocale = (locale) => {
    console.log('LOCAAAALEEEE',locale);
    switch (String(locale)) {
      case "ro":
        this.country = 'Română'
        break;
      case "bg":
        this.country = 'български'
        break;
      case "pl":
        this.country = 'Dialekt'
        break;
      case "ar":
        this.country = 'عربي'
        break;
      case "en":
        this.country = 'English'
        break;
      case "tr":
        this.country = 'Türkçe'
        break;
      case "ru":
        this.country = 'Русский'
        break;
    }
  }
}
export default new userStore();