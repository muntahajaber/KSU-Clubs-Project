import 'react-native-gesture-handler';
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { HeaderBackButton } from 'react-navigation-stack';
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  LinearGradient,
  ImageBackground,
  Button
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';


import login from './screens/login';
import register from './screens/register';
import welcomeScreen from './screens/welcomeScreen';
 
/////////////////student pages
import studentNavigator from './Student/studentNavigator';

/////////////////////club pages
import clubNavigator from './Club/clubNavigator';

///////////////////admin pages
import TabNavigator from './Admin/AdminNavigator';



const IoniconsHeaderButton = (props) => (
  <HeaderButton IconComponent={Entypo} iconSize={23} color="red" {...props} />
);

const navigator = createStackNavigator(
  {
    Login: {
      screen: login,
      navigationOptions: ({ navigation }) => ({
        title: "Login",
        headerLeft: null
      }),
    },
    register: register,
    studentNavigator: {
      screen: studentNavigator,
      navigationOptions: ({ navigation }) => {

        switch ((navigation.state.routes[navigation.state.index]["routes"])[(navigation.state.routes[navigation.state.index]["index"])].routeName) {
          case "studentHomePage":
            return {
              title: "Home",

            }
          case "studentClubsPage":
            return {
              title: "Search",

            }
          case "My Calendar":
            return {
              title: "My Calendar",
              headerLeft: (<HeaderBackButton title="return" onPress={() => { navigation.navigate('studentHomePage') }} />),
            }

          case "Calendar":
            return {
              title: "Calendar",
              headerLeft: (<HeaderBackButton title="return" onPress={() => { navigation.navigate('studentHomePage') }} />),
            }
          

          case "Map":
            return {
              title: "Club Location",
              headerLeft: (<HeaderBackButton title="return" onPress={() => { navigation.navigate('clubHomePageBrowse') }} />),
            }

          case "clubHomePageBrowse":
            return {
              title: "Club Browse",
              headerLeft: (<HeaderBackButton title="return" onPress={() => { navigation.navigate('studentClubsPage') }} />),
            }

          case "studentAnnouncementsPage":
            return {
              title: "Announcements",
            }
          case "studentProfile":
            return {
              title: "My Profile",
              headerRight: props => (<HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                <Item title="log-out" iconName="log-out" onPress={() => { navigation.replace('Login') }} />
              </HeaderButtons>),
            }
          case "studentEditProfile":
            return {
              title: "Edit Profile",
              headerLeft: props => (

                <HeaderBackButton title="return" onPress={() => { navigation.navigate('studentProfile') }} />),
            }

          case "studentResetPassword":
            return {
              title: "Reset Password",
              headerLeft: (<HeaderBackButton
                headerTruncatedBackTitle="change" headerBackTitle="return" onPress={() => { navigation.navigate('studentProfile') }} />),
            }

          case "followedClubs":
            return {
              title: "Followed Clubs",
              headerLeft: props => (
                <HeaderBackButton title="return" onPress={() => { navigation.navigate('studentHomePage') }} />),
            }



          default:
            return { title: (navigation.state.routes[navigation.state.index]["routes"])[(navigation.state.routes[navigation.state.index]["index"])].routeName }
        }
      }


    },
    ClubNavigator: {
      screen: clubNavigator,
      navigationOptions: ({ navigation }) => {
        switch ((navigation.state.routes[navigation.state.index]["routes"])[(navigation.state.routes[navigation.state.index]["index"])].routeName) {
          case "Home":
            return {
              title: "Home",
            }

          case "clubPostPage":
            return {
              title: "Post",
            }

          case "clubProfile":
            return {
              title: "My Profile",
              headerRight: props => (<HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                <Item title="log-out" iconName="log-out" onPress={() => { navigation.replace('Login') }} />
              </HeaderButtons>),
            }

          case "clubEditProfile":
            return {
              title: "Edit Profile",
              headerLeft: props => (
                <HeaderBackButton title="return" onPress={() => { navigation.navigate('clubProfile') }} />),
            }

          case "clubResetPassword":
            return {
              title: "Reset Password",
              headerLeft: props => (
                <HeaderBackButton title="return" onPress={() => { navigation.navigate('clubProfile') }} />),
            }

          case "addClublocation":
            return {
              title: "Club Location",
              headerLeft: props => (
                <HeaderBackButton title="return" onPress={() => { navigation.navigate('clubProfile') }} />),
            }
        }
      }
    },
    TabNavigator: {
      screen: TabNavigator,
      navigationOptions: ({ navigation }) => {
        switch ((navigation.state.routes[navigation.state.index]["routes"])[(navigation.state.routes[navigation.state.index]["index"])].routeName) {
          case "AdminPage2":
            return {
              title: "Home",
            }

          case "adminRegisterClub":
            return {
              title: "Add Club",
            }

          case "AdminProfile":
            return {
              title: "My Profile",
              headerRight: props => (<HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
                <Item title="log-out" iconName="log-out" onPress={() => { navigation.replace('Login') }} />
              </HeaderButtons>),
            }

          case "adminEditProfile":
            return {
              title: "Edit Profile",
              headerLeft: props => (
                <HeaderBackButton title="return" onPress={() => { navigation.navigate('AdminProfile') }} />),
            }

          case "adminResetPassword":
            return {
              title: "Reset Password",
              headerLeft: props => (
                <HeaderBackButton title="return" onPress={() => { navigation.navigate('AdminProfile') }} />),
            }

        }
      }
    },

  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      title: "KSUClubs",
      headerLeft: null
    }
  }
);


export default createAppContainer(navigator);
