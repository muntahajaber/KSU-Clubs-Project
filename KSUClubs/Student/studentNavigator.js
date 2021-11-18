import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';


import studentClubsPage from './studentClubsPage';
import studentHomePage from './studentHomePage';
import calendar from './AddToCalender';
import studentAnnouncementsPage from './studentAnnouncementsPage';
import calendarView from './calenderView';
import newcalendar from './calenderView';
import clubHomePageBrowse from '../Club/clubHomePageBrowse';
import followedClubs from './followedClubs';
import studentProfile from './studentProfile';
import studentEditProfile from './studentEditProfile';
import studentResetPassword from './studentResetPassword';
import stuentViewMap from './newButtonMap';//////////////////////Add
import rateUs from './rateUs'



const StudenHomeNavigator = createStackNavigator({
  studentHomePage: { screen: studentHomePage }, ///Home
  "My Calendar": { screen: calendarView },
  "Calendar": { screen: calendar },
  newcalendar: { screen: newcalendar },
  followedClubs: { screen: followedClubs },
});

const StudenclubSearchNavigator = createStackNavigator({
  studentClubsPage: { screen: studentClubsPage }, ///screen
  clubHomePageBrowse: { screen: clubHomePageBrowse },
  Map: { screen: stuentViewMap },
  rateUs: { screen: rateUs },


});

const StudenAnnouncmentNavigator = createStackNavigator({
  studentAnnouncementsPage: { screen: studentAnnouncementsPage },///announcmnt
  "My Calendar": { screen: calendarView },
  "Calendar": { screen: calendar },
  newcalendar: { screen: newcalendar },
  clubHomePageBrowse: { screen: clubHomePageBrowse }



});

const StudentprofileNavigator = createStackNavigator({
  studentProfile: { screen: studentProfile },////StudentProfile
  studentEditProfile: { screen: studentEditProfile },
  studentResetPassword: { screen: studentResetPassword },
});


const TabNavigator = createMaterialBottomTabNavigator(
  {

    Home: {
      screen: StudenHomeNavigator,
      navigationOptions: {

        headerTitle: "home",
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-home'} />
          </View>
        ),
      },
    },


    Clubs: {
      screen: StudenclubSearchNavigator,
      navigationOptions: {

        tabBarLabel: 'clubs',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-search'} />
          </View>
        ),
      },
    },

    Announcments: {
      screen: StudenAnnouncmentNavigator,
      navigationOptions: {

        tabBarLabel: 'Announcements',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]} size={25} name={'ios-megaphone'} />
          </View>
        ),

      },
    },


    Profile: {
      screen: StudentprofileNavigator,
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
    inactiveColor: '#d4d4d4',
    barStyle: { backgroundColor: '#ffff' },
  }
);

export default createAppContainer(TabNavigator);





