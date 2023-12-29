import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { navigationRef } from './navigationRef';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import { Provider } from 'mobx-react';
import store from '../mobx/store';
import WaitingScreen from '../screens/WaitingScreen';
import AdminPanel from '../screens/AdminPanel';
import NewModelScreen from '../screens/NewModelScreen';
import UserApproveScreen from '../screens/UserApproveScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Urunler from '../screens/Urunler';
import DrawerContent from '../components/DrawerContent';
import MyBag from '../screens/MyBag';
import ContactUs from '../screens/ContactUs';
import Problems from '../screens/Problems';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SplashScreen from '../screens/SplashScreen';
import PushNotification from '../screens/PushNotification';
import Settings from '../screens/SettingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OrderScreen from '../screens/OrderScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderAdmin from '../screens/OrderAdmin';
import UserOrdersScreen from '../screens/UserOrdersScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator(); 
const DrawerNavigator=() => {
    return(
    <Drawer.Navigator 
    
    drawerContent={props=><DrawerContent {...props}/>}
    screenOptions={{headerShown:false}}>
    <Drawer.Screen name='HomeScreen' component={HomeScreen}/>
    <Drawer.Screen name='Problems' component={Problems}/>
    <Drawer.Screen name="Urunler" component={Urunler} />
    <Drawer.Screen name="MyBag" component={MyBag} />
    <Drawer.Screen name="ContactUs" component={ContactUs} />
    <Drawer.Screen name= 'AdminPanel' component={AdminPanel} /> 
    <Drawer.Screen name= 'UserApproveScreen' component={UserApproveScreen} /> 
    <Drawer.Screen name= 'NewModelScreen' component={NewModelScreen} />
    <Drawer.Screen name= 'PushNotification' component={PushNotification} />
    <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
    <Drawer.Screen name="OrderScreen" component={OrderScreen} />
    <Drawer.Screen name="OrderAdmin" component={OrderAdmin} />
    <Drawer.Screen name='OrderHistoryScreen' component={OrderHistoryScreen}/>
    <Drawer.Screen name='UserOrdersScreen' component={UserOrdersScreen}/>
    <Drawer.Screen options={{swipeEnabled:false}} name= 'ProductDetailScreen' component={ProductDetailScreen} />  
    </Drawer.Navigator>
    )
}
const Navigation = () => {
    return(
        <Provider {...store}>
        <NavigationContainer ref={navigationRef}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
            }}
            initialRouteName="SplashScreen">
                <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} options={{ headerShown: false }}/>
                <Stack.Screen name= 'WelcomeScreen' component={WelcomeScreen} />    
                <Stack.Screen name= 'LoginScreen' component={LoginScreen} />
                <Stack.Screen name= 'RegisterScreen' component={RegisterScreen} />
                <Stack.Screen name= 'WaitingScreen' component={WaitingScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        </Provider>
    )
}
export default Navigation;