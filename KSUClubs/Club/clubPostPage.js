import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from "react-native";
//import {createStackNavigator } from 'react-navigation-stacknew';
import firebase from '../src/firebase/config';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
// import all the components we are going to use
import { SafeAreaView } from 'react-native';

//import DatePicker from the package we installed
import DatePicker from 'react-native-datepicker';

export default class clubPostPage extends Component {

  constructor() {
    super();
    this.state = {
      announcement: '',
      'startDate': '',
      'endDate': '',
      'uid': firebase.auth().currentUser.uid,
      'title': '',
      'postDay': new Date().getDate(),
      'postMonth': new Date().getMonth() + 1,
      'postYear': new Date().getFullYear(),
      "clubName": "",
      'clubImage': "",
      'clubBack': "",
      dataSource: [],
      iDfollowingclubs: [],
      notification: {},
      isFollowClub: true,
      currClubName: "",
      currClubtitle: ""


    }

  }

  componentDidMount() {
    //  this.registerForPushNotificationsAsync();

    firebase.database().ref(`/users/student`).on('value', (snapshot) => {
      var li = []
      var follow = []
      snapshot.forEach((child) => {
        if (child.val().token !== undefined && child.val().following !== undefined) {
          li.push({
            id: child.key,
            name: child.val().name,
            Token: child.val().token
          })
        }
      })

      for (var i = 0; i <= this.state.dataSource.length; i++) {
        if (li.length !== 0 && li != undefined && li[i] != undefined && li[i] != '' && li[i].id != undefined) {
          if (firebase.database().ref(`/users/student/${li[i].id}/following`) !== undefined) {
            firebase.database().ref(`/users/student/${li[i].id}/following`).on('value', (snapshot) => {
              var follow = []
              snapshot.forEach((child) => {
                follow.push({
                  followID: child.val().id,
                  id: child.key,
                  studentID: li[i].id
                })

              })
              //alert("here");

              console.log(follow[0])

              this.setState({ iDfollowingclubs: follow })

            })


          }
        }
      }

      //console.log(li[0])

      this.setState({ categories: li, dataSource: li })
    })


    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  };

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  sendPushNotification = async () => {
    for (var i = 0; i < this.state.dataSource.length; i++) {//student
      //console.log(this.state.dataSource[i])
      // console.log(this.state.iDfollowingclubs.length)

      for (var x = 0; x < this.state.iDfollowingclubs.length; x++) {// student's following clubs
        //console.log(this.state.iDfollowingclubs[x])

        if (this.state.iDfollowingclubs[x].studentID === this.state.dataSource[i].id && this.state.iDfollowingclubs[x].followID === this.state.uid) {
          // console.log(this.state.iDfollowingclubs[x])
          console.log(this.state.currClubName + " none")
          console.log(this.state.currClubtitle + " none2")
          console.log(this.state.dataSource[i].Token + " token")



          const message = {
            to: this.state.dataSource[i].Token,
            sound: 'default',
            title: `New Notificatuin from ${this.state.currClubName}`,
            body: this.state.currClubtitle,
            data: { data: 'goes here' },
          };
          const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
          const data = response._bodyInit;
          console.log(`Status & Response ID-> ${data}`);
          alert("inside")
        } else {
          alert("no match id club")
        }
      }

    }
  };





  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  Post = (ann) => {
    var clubName = ""
    var clubImage = ""
    /////////////////////////
    firebase.database().ref(`/users/club/${this.state.uid}`).on('value', (snapshot) => {
      clubName = snapshot.val().name
      clubImage = snapshot.val().image

      this.setState({ currClubName: clubName })

    }
    )
    /////////////////////////

    ///////////////////////////////////////////////////////////

    firebase.database().ref(`/users/club/Announcements`)
      .push({
        "text": ann, "title": this.state.title, "startDate": this.state.startDate, "endDate": this.state.endDate,
        "postDate": this.state.postDay + "/" + this.state.postMonth + "/" + this.state.postYear, "clubId": this.state.uid, "clubName": clubName, "clubImage": clubImage
      });
    ////////////////////////////////////////////////////////////
    Alert.alert("The announcement has been posted successfully!")
    this.setState({ currClubtitle: this.state.title })

    this.setState({
      announcement: '',
      'startDate': '',
      'endDate': '',
      'title': '',

    });
    this.sendPushNotification()



  }

  render() {

    return (

      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>
            What's new?
            </Text>

          <Text style={styles.annLabel1}>
            Title:
            </Text>

          <TextInput style={styles.annTitle} placeholder='  Write your announcement title here. . .' maxLength={40} value={this.state.title}
            onChangeText={(val) => this.updateInputVal(val, 'title')}></TextInput>

          <Text style={styles.annLabel2}>
            Announcement:
            </Text>
          <TextInput style={styles.ann} placeholder='  Write your announcement here. . .' multiline={true} numberOfLines={3} maxLength={140} value={this.state.announcement}
            onChangeText={(val) => this.updateInputVal(val, 'announcement')}></TextInput>




          <TouchableOpacity style={styles.button}
            onPress={() => {

              this.state.title = this.state.title.trim(),
                this.state.announcement = this.state.announcement.trim()

              if (this.state.startDate === '' && this.state.endDate === '') {
                this.state.startDate = null
                this.state.endDate = null
              }
              if (this.state.announcement === '' || this.state.title === '') {
                Alert.alert("Please fill empty fields")
              }
              else if (this.state.startDate === '') {
                Alert.alert("Please fill start date")
              }
              else if (this.state.endDate === '') {
                Alert.alert("Please fill end date")
              }
              else {
                Alert.alert(
                  'Confirmation',
                  'Are you sure you want to post the announcement?',
                  [

                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Yes', onPress: () => {
                        this.Post(this.state.announcement)
                        this.props.navigation.navigate("Home")
                      }
                    },
                  ],
                  { cancelable: false },
                );
              }
            }}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>



          <DatePicker
            style={styles.datePickerStyle}
            date={this.state.startDate} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            //format="DD-MM-YYYY"
            format="YYYY-MM-DD"
            minDate="01-01-2020"
            //maxDate="01-01-2019"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                //display: 'none',
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
                height: "70%",
              },
            }}
            onDateChange={(date) => {
              this.setState({
                startDate: date + " 00:00:00",
              });
            }}
          />
          <DatePicker
            style={styles.datePickerStyle}
            date={this.state.endDate} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            // format="DD-MM-YYYY"
            format="YYYY-MM-DD"
            minDate={this.state.startDate}
            //maxDate="01-01-2019"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                //display: 'none',
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
                height: "70%",
              },
            }}
            onDateChange={(date) => {
              this.setState({
                endDate: date + " 00:00:00",
              });
            }}
          />
          <View style={styles.date}>
            <Text style={styles.dateText}>Start Date: </Text>
            <Text style={styles.dateText}>End Date: </Text>
          </View>
        </View>
      </SafeAreaView>

    )
  }
}
const styles = StyleSheet.create({
  text: {
    color: "#0C7B93",
    fontSize: 28,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    top: 20

  },
  background: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%'
  },
  button: {
    margin: 15,
    width: 170,
    height: 40,
    backgroundColor: "#0C7B93",
    color: 'white',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50,
    top: "10%"
  },
  buttonText: {
    color: 'white',
    fontWeight: "bold"

  },
  view: {
    top: '20%'
  },
  ann: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: "#0C7B93",
    height: "40%",
    width: 330,
    top: "-10%"

  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    top: "5%"
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    color: "#0C7B93",
    top: "-10%"
  },
  datePickerStyle: {
    width: 130,
    // height:100,
    marginTop: 5,
    top: "-17%",
    left: "11%",

  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    color: "#0C7B93",
    top: "-13%"
  },
  attach: {
    height: "-40%",
    width: "100%"

  },
  date: {
    top: "-31.5%",
    left: "-20%"
  },
  dateText: {
    marginTop: 27,
    fontSize: 15,
    color: "#0C7B93",
    fontWeight: "bold"
  },
  annTitle: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: "#0C7B93",
    height: "5%",
    width: 330,
    top: "-14%"
  },
  annLabel1: {
    fontSize: 15,
    //fontWeight: 'bold',
    padding: 20,
    color: "#0C7B93",
    top: "-12%",
    left: "-37%"
  },
  annLabel2: {
    fontSize: 15,
    //fontWeight: 'bold',
    color: "#0C7B93",
    top: "-11%",
    left: "-27%"
  }
});