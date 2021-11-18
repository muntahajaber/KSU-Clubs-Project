import React, { Component } from 'react';
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
  FlatList,
  ScrollView,
  ImageBackground,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
//import ListCard from "./ListCard";
//import { ScrollView } from "react-native-gesture-handler";
import firebase from '../src/firebase/config';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import ReversedFlatList from 'react-native-reversed-flat-list';
const numColumns = 2;
const { width, height } = Dimensions.get('window');
export default class studentHomePage extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      bio: '',
      photoUrl: '',
      image: '',
      dataSource: [],
      uid: firebase.auth().currentUser.uid,
      background: '',
      numOfFollowers: 0,
      clubsId: [],
      hasToke: ''

    }

    this.componentDidMount();

  }



  componentDidMount() {
    var id;
    var name;
    var image;
    var back;
    var token;


    firebase.database().ref(`/users/student/${this.state.uid}`).once("value")
      .then((snapshot) => {
        id = snapshot.val().id;
        name = snapshot.val().name;
        image = snapshot.val().image;
        back = snapshot.val().backgroundImage;
        if (snapshot.val().token != undefined && snapshot.val().token != '') {
          token = snapshot.val().token;
          this.state.hasToke = true
          console.log("has token")
        } else {
          this.state.hasToke = true
          console.log("no token")
        }
        this.setState({
          id: id,
          name: name,
          image: image,
          back: back,
        });
      });


    this.displayAnnouncements()
    this.registerForPushNotificationsAsync();
  }//end did mount


  async registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }


    let uid = firebase.auth().currentUser.uid;
    if (this.state.hasToke === false) {
      firebase.database().ref(`/users/student/${uid}/token`)
        .set(token);
      return token;
    } else {
      console.log("you have token");
    }



  }

  displayAnnouncements() {

    firebase.database().ref(`/users/student/${this.state.uid}/following`).on('value', (snapshot) => {
      var newList = []
      snapshot.forEach((child) => {
        console.log("for each big")
        newList = this.getAnnouncements(child.val().id, newList)


      })
      this.setState({ dataSource: newList })
    })

  }

  getAnnouncements = (id, newList) => {
    firebase.database().ref(`/users/club/Announcements`).on('value', (snapshot) => {

      snapshot.forEach((child) => {
        console.log("for each small")
        if (child.val().clubId === id) {
          newList.push({
            title: child.val().title,
            text: child.val().text,
            startDate: child.val().startDate,
            endDate: child.val().endDate,
            postDate: child.val().postDate,
            doseHaveDate: this.hasAdate(child.key),

            id: child.key,
            clubId: child.val().clubId,
            name: child.val().clubName,
            image: child.val().clubImage,


          })
        }//end if 

      })
    })
    return newList
  }

  separator = () => {
    return (
      <View style={{ height: 10, width: '100%', backgroundColor: '#e5e5e5' }} />
    );
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  hasAdate(id) {
    console.log(id + " this is club id ")

    var startD = false
    var endD = false
    if (firebase.database().ref(`/users/club/Announcements/${id}`) != undefined) {
      firebase.database().ref(`/users/club/Announcements/${id}`).on('value', (snapshot) => {
        if (snapshot.val() !== null) {
          if (snapshot.val().startDate !== undefined && snapshot.val().endDate !== undefined) {
            startD = true
            endD = true
          } else {
            console.log("no date")
          }
        } else {
          console.log("snapshot.val() == null")
        }



      }) // End firebase  
      console.log(startD + " start " + endD + " end")

    }
    else {
      console.log("no date for this club ")
    }


    return startD
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.clubInfoContainer}>
          <ImageBackground
            source={{ uri: this.state.back }}
            style={{ width: "100%", height: 150, alignItems: "center" }}
            resizeMode="cover"
          >
          </ImageBackground>
          <View style={styles.info}>
            <View
              style={{
                width: "100%",
                marginTop: 5,
                marginBottom: 5,
                justifyContent: "center",
                alignItems: "center",
                // top:"-17%",
                // left:"5%"
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#5facdb",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >

                <Image
                  source={{ uri: ((this.state.image)) }}
                  style={{ width: 100, height: 100, borderRadius: 200 / 2 }}
                />

              </View>
            </View>
            <Text style={styles.name}>{this.state.name}</Text>
          </View>

          <TouchableOpacity style={styles.FollowedButton} onPress={() => this.props.navigation.navigate('followedClubs')}>
            <Text style={styles.FollowedButtonText}> Followed clubs </Text>
          </TouchableOpacity>
          <View style={styles.AnnouncementsTitleView}>
            <Text style={styles.Announcements}> Announcements </Text>
          </View>

        </View>


        <FlatList
          data={this.state.dataSource}
          inverted
          ItemSeparatorComponent={() => this.separator()}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.bookContainer} onPress={() => this.props.navigation.navigate('ClubNavigator')}>
                <Image style={styles.image}
                  source={{ uri: (item.image) }}
                />

                <View style={styles.dataContainer}>
                  <Text numberOfLines={4} style={styles.title}>
                    {item.name}
                  </Text>


                  <Text numberOfLines={5} style={styles.annTitle}>
                    {item.title + ":"}
                  </Text>
                  <ScrollView style={styles.scroll}>
                    <Text style={styles.description}>
                      {item.text}
                    </Text>
                  </ScrollView>


                  {
                    this.hasAdate(item.id) ?  <View style={styles.button}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Calender',{StartDate:item.startDate,EndDate:item.endDate,title:item.title,text:item.text,id:item.id})}>
                  
                 <Text style={styles.buttonText}>Add to my calender</Text>
                </TouchableOpacity>

                  </View>

                      :

                      <View style={styles.button1}>
                        <TouchableOpacity>
                          <Text style={styles.buttonText1}>no dates</Text>
                        </TouchableOpacity>

                      </View>

                  }



                  <Text style={styles.postDate}>{item.postDate}</Text>


                </View>

              </View>

            );
          }//end render item2
          }//end render item1
        />
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.navigate('My Calendar')} style={styles.TouchableOpacityStyle} >

          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Circle-icons-calendar.svg/512px-Circle-icons-calendar.svg.png' }}

            style={styles.FloatingButtonStyle} />

        </TouchableOpacity>

      </View>
    )
  }
}

const styles = StyleSheet.create({

  square: {
    width: "100%",
    height: "30%",
    top: "0%",
    //  left:"15%",
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 50

  },
//////////////////////////////////
button: {
  margin:3,
 marginBottom:-0.08,

  width: 150,
  height: 25,
  backgroundColor: "#0C7B93",
  color: 'white',
  justifyContent: 'center',
  alignContent:"center",
  alignItems:"center",
  borderRadius: 50,
  //top:"20%"


},
buttonText: {
      color: "white",
      textAlign: "center",
      fontWeight: "bold",


},
  /////////////////////////////
  clubInfoContainer: {
    borderWidth: 0.25,
    borderColor: "#0C7B93",
    padding: 0,
    marginBottom: 8,

  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
    top: "6%",
    // left:"6%"

  },
  bio: {
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioView: {
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    width: "89%",
    top: "-15%"
  },
  info: {
    //backgroundColor:"black",
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    top: "-20%",
    // width:"80%"
    left: "-33%",


  },
  followers: {
    color: "#0C7B93",
  },
  followersAll: {
    left: "8%",
    top: "-9%",

  },

  background: {
    flex: 1,
    width: null,
    height: null,
  },
  circle: {
    height: 50,
  },
  clubImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  AnnouncementsTitleView: {
    marginBottom: 10
  },
  /////////////////////////////////////
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    width: '100%',
    //backgroundColor: '#0C7B93',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    // borderColor:"gray"
  },

  bookContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  image: {
    height: 70,
    width: 70,
    paddingTop: 10,
    borderRadius: 90 / 2,
    
  },
  dataContainer: {
    paddingLeft: 20,
    paddingTop: 10,
    width: width - 80,
    padding: 7,
    backgroundColor: "#ffffff",

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    padding: 3,

  },
  description: {
    fontSize: 16,
    color: 'black',
    padding: 3,
    left: "5%",
    width: "80%",
  },
  author: {
    fontSize: 16,
  },
  itemStyle: {
    backgroundColor: "#ffffff",
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: width / numColumns
  },
  itemText: {
    color: "#de5900",
    fontSize: 30
  },
  button: {
    margin: 3,
    marginBottom: -0.08,
    width: 148,
    height: 25,
    backgroundColor: "#0C7B93",
    color: 'white',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50,
    left: "-1%",
    top: "10%"


  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",


  }, button1: {
    margin: 3,
    marginBottom: -0.08,
    width: 148,
    height: 1,
    backgroundColor: "white",
    color: 'white',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50,
    left: "-1%",
    top: "10%"


  },
  buttonText1: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",


  },
  annTitle: {
    fontSize: 16,
    color: '#0C7B93',
    padding: 3,
    left: "5%"
  },
  time: {
    opacity: 0,
    fontSize: 0,
    height: 0,
    width: 0

  },
  postDate: {
    fontSize: 10,
    color: 'grey',
    left: "80%",
    
  },

  MainContainer: {
    flex: 1,
  },
  TouchableOpacityStyle: {

    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    top: 650
  },

  FloatingButtonStyle: {

    resizeMode: 'contain',
    width: 70,
    height: 70,
    shadowRadius: 6
  },
  Announcements: {
    color: "#0C7B93",
    fontWeight: "bold",
    fontSize: 16,
    left: "3%",
  },
  FollowedButton: {
    margin: 3,
    marginBottom: -0.08,
    width: 115,
    height: 25,
    backgroundColor: "#0C7B93",
    color: 'white',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50,
    left: "68%",
    top: "-27%"
  },
  FollowedButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

});