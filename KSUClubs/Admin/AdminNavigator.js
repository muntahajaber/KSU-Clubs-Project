import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from 'react-navigation-stack';

import adminPage from './adminPage'
import adminRegisterClub from './adminRegisterClub'
import AdminProfile from './AdminProfile'
import AdminPage2 from './adminPage2'
import adminResetPassword from './adminResetPassword'
import adminEditProfile from './adminEditProfile'

const AdminHomeNavigator = createStackNavigator({
  AdminPage2: {
    screen: AdminPage2,
    navigationOptions: ({ navigation }) => ({
      title: "Home",
    }),
  },

});

const AdminclubRegesterNavigator = createStackNavigator({
  adminRegisterClub: { screen: adminRegisterClub },

});



const AdminprofileNavigator = createStackNavigator({
  AdminProfile: { screen: AdminProfile },
  adminEditProfile: { screen: adminEditProfile },
  adminResetPassword: { screen: adminResetPassword },

});


const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: AdminHomeNavigator,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-home'} />
          </View>
        ),
      },
    },


    Add: {
      screen: AdminclubRegesterNavigator,
      navigationOptions: {
        tabBarLabel: 'Add',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]} size={25} name={'ios-add-circle'} />
          </View>
        ),

      },
    },


    Profile: {
      screen: AdminprofileNavigator,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]} size={25} name={'ios-person'} />
          </View>
        ),

      },
    },


  },


  {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: 'f0edf6',
    barStyle: { backgroundColor: '#0C7B93' },
  }
);

export default createAppContainer(TabNavigator);