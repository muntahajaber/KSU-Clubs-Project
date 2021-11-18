import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import clubHomePageTest from './clubHomePageTest';
import clubPostPage from './clubPostPage';
import clubProfile from './clubProfile';
import clubEditProfile from './clubEditProfile';
import clubResetPassword from './clubResetPassword';
import addClublocation from './AddClubLocation'; ///////////////Add



const ClubHomeNavigator = createStackNavigator({
  Home: {
    screen: clubHomePageTest,
    navigationOptions: ({ navigation }) => ({
      title: "Home",
    }),
  },

});

const ClubPostNavigator = createStackNavigator({
  clubPostPage: { screen: clubPostPage },

});



const ClupprofileNavigator = createStackNavigator({
  clubProfile: { screen: clubProfile },
  clubEditProfile: { screen: clubEditProfile },
  clubResetPassword: { screen: clubResetPassword },
  addClublocation: { screen: addClublocation },

});

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: ClubHomeNavigator,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-home'} />
          </View>
        ),
      },
    },

    Post: {
      screen: ClubPostNavigator,
      navigationOptions: {
        tabBarLabel: 'Post',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]} size={25} name={'ios-add-circle'} />
          </View>
        ),

      },
    },


    Profile: {
      screen: ClupprofileNavigator,
      navigationOptions: {
        tabBarLabel: 'My Profile',
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
    activeColor: '#0C7B93',
    inactiveColor: 'gray',
    barStyle: { backgroundColor: '#ffffff' },
  }
);

export default createAppContainer(TabNavigator);





