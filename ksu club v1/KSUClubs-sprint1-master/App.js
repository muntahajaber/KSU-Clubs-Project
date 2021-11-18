import 'react-native-gesture-handler';
//import * as React from 'react';
//import { NavigationContainer } from '@react-navigation/native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';



import login from './screens/login';
import welcomeScreen from './screens/welcomeScreen'
import register from './screens/register'
import home from './screens/home'

//import { withNavigation } from 'react-navigation';
const navigator = createStackNavigator(
  {
    Login: login,
    welcomeScreen: welcomeScreen,
    register: register,
    home: home

  },
  {
    initialRouteName: "welcomeScreen",
    defaultNavigationOptions: {
      title: "KSUClubs"
    }
  }
);

export default createAppContainer(navigator);
