import React, { useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import I18n from '../localization/i18n/i18n';
import OrderBox from '../components/orderBox';
import userStore from '../mobx/userStore';
import { Header, Text } from '@rneui/base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';

const UserOrdersScreen = ({ route }) => {
  const windowHeight = Dimensions.get('window').height;
  const { item } = route.params;
  const [selectedFilter, setSelectedFilter] = useState('new'); // Varsayılan filtre

  const filterOrdersByStatus = (status) => {
    if (status == "all") {
      return Object.values(item.order)
    }
    return Object.values(item.order).filter((order) => order.status === status);
  };

  const renderOrder = (order, key) => {
    const productList = Object.values(order.items);
    
  const updateOrderStatus = async (newStatus) => {
      try {
        // Belirli bir siparişin durumunu güncelle
        await firestore()
          .collection('orders')
          .doc(userStore.user.email + '_order')
          .update({
            [`order.${key}.status`]: newStatus,
          });
        
        Alert.alert('Success', 'Order status updated successfully!');
      } catch (error) {
        console.error('Error updating order status:', error);
        Alert.alert('Error', 'Failed to update order status.');
      }
    };

    return (
      <View key={key} style={{ padding: 2, backgroundColor: '#f0f0f0', borderBottomWidth: 0.2 }}>
        <View style={{ height: windowHeight / 4.5 }}>
          <FlatList
            style={{}}
            data={productList}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={0}
            renderItem={({ item, index }) => <OrderBox key={index} product={item} index={index + 1}></OrderBox>}
            keyExtractor={(item, i) => i}
            extraData={userStore.user}
          />
        </View>
        <View style={{ flexDirection: 'row', flex: 1, marginBottom: 1 }}>
          <View style={{ flexDirection: 'column', flex: 3 }}>
            <Text style={styles.infotext}> {I18n.t('OrderDate')} : {order.orderDate}</Text>
            <Text style={styles.infotext}> {I18n.t('TotalSeries')} : {order.total[0].totalSeries}</Text>
            <Text style={styles.infotext}> {I18n.t('TotalPieces')} : {order.total[0].totalPieces}</Text>
          </View>
          <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ flexDirection: 'row', fontWeight: 'bold' }}> {I18n.t('Status')} </Text>
            <TouchableOpacity
              style={{
                backgroundColor:
                  order.status === 'new' ? 'green' : order.status === 'cancelled' ? 'red' : order.status === 'pending' ? '#FFD700' : order.status === 'completed' ? 'black' : 'black',
                borderRadius: 10,
                height: '50%',
                width: null,
                justifyContent: 'center',
              }}
              onPress={() => { }}
            >
              <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '500', padding: 5 }}>{I18n.t(order.status)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {userStore.triggerLangRender}
      <Header
        backgroundColor={'#fff'}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.dispatch(DrawerActions.toggleDrawer());
              }}
            >
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: selectedFilter === 'all' ? 'grey' : '#2c3e50' }]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: selectedFilter === 'new' ? '#3498db' : '#2c3e50' }]}
          onPress={() => setSelectedFilter('new')}
        >
          <Text style={styles.filterButtonText}>New</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: selectedFilter === 'cancelled' ? '#e74c3c' : '#2c3e50' }]}
          onPress={() => setSelectedFilter('cancelled')}
        >
          <Text style={styles.filterButtonText}>Cancelled</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: selectedFilter === 'pending' ? '#FFD700' : '#2c3e50' }]}
          onPress={() => setSelectedFilter('pending')}
        >
          <Text style={styles.filterButtonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: selectedFilter === 'completed' ? 'black' : '#2c3e50' }]}
          onPress={() => setSelectedFilter('completed')}
        >
          <Text style={styles.filterButtonText}>Completed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filterOrdersByStatus(selectedFilter).map((order, key) => renderOrder(order, key))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  infotext: {
    fontWeight: '600',
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default UserOrdersScreen;
