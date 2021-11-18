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
  ScrollView,
  ImageBackground,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from '../src/firebase/config';
import Iconi from "react-native-vector-icons/FontAwesome5";
import { Rating, AirbnbRating } from 'react-native-elements';

const numColumns = 2;
const { width, height } = Dimensions.get('window');
var user_id = ""
export default class clubHomePageBrowse extends Component {

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
      clubId: user_id,
      followed: false,
      ratingAvg: 0,
      ratedOnce: true


    }
    this.componentDidMount();

  }

  componentDidMount() {
    firebase.database().ref(`/users/club/Announcements`).on('value', (snapshot) => {
      var li = []
      snapshot.forEach((child) => {
        if (child.val().clubId === user_id)
          li.push({
            title: child.val().title,
            text: child.val().text,
            startDate: child.val().startDate,
            endDate: child.val().endDate,
            postDate: child.val().postDate,

            id: child.key,
            clubId: child.val().clubId,
            name: child.val().clubName,
            image: child.val().clubImage,
            followed: this.isFollowed(child.val().clubId)


          })

      })
      this.setState({ dataSource: li })
    })
    ////////////////////////////////////////////
    this.updateClub()
    this.calculateRatingsAvg(user_id)
    this.rateOnce(user_id)
  }

  isFollowed(id) {
    var flag = false
    firebase.database().ref(`/users/student/${this.state.uid}/following`).on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        snapshot.forEach((child) => {
          if (child.val().id === id) {
            flag = true
          }

        })
      }
    }) // End firebase  
    console.log(flag)
    return flag
  }


  unFollow = (id) => {
    firebase
      .database()
      .ref("/users/student/" + this.state.uid + "/following")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() !== null) {
          snapshot.forEach((child) => {
            if (child.val().id === id) {
              firebase.database().ref(`/users/student/${this.state.uid}/following/${child.key}`).remove().then(this.updateClub())
            }

          })
        }
      });

  }
  updateClub() {
    firebase.database().ref(`/users/club/Announcements`).on('value', (snapshot) => {
      var li = []
      snapshot.forEach((child) => {
        if (child.val().clubId === user_id)
          li.push({
            title: child.val().title,
            text: child.val().text,
            startDate: child.val().startDate,
            endDate: child.val().endDate,
            postDate: child.val().postDate,

            id: child.key,
            clubId: child.val().clubId,
            name: child.val().clubName,
            image: child.val().clubImage,
            followed: this.isFollowed(child.val().clubId)


          })

      })
      this.setState({ dataSource: li })
    })
  }

  follow = (id, followed) => {

    if (!followed) {
      firebase.database().ref(`/users/student/${this.state.uid}/following`).push({ "id": id }).then(this.updateClub())

    } else if (followed) {
      this.unFollow(id)

    }
    this.updateClub()
  }


  separator = () => {
    return (
      <View style={{ height: 10, width: '100%', backgroundColor: '#e5e5e5' }} />
    );
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  getAnn = (user_id) => {

  }

  handleEmail = (clubEmail) => {

    const to = [clubEmail]  // string or array of email addresses
    email(to, {
      // Optional additional arguments
      subject: 'Write subject',
      body: `Write your email here`
    }).catch(console.error)
  }

  calculateRatingsAvg(user_id) {
    var total = 0
    var numberOfRatings = 0
    var average = 0
    firebase.database().ref(`/users/club/${user_id}/totalOfRatings`).on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        total = snapshot.val().total
      }
    })


    firebase.database().ref(`/users/club/${user_id}/numberOfRatings`).on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        numberOfRatings = snapshot.val().numberOfRatings
      }
    })
    if (numberOfRatings != 0) {
      average = total / numberOfRatings
    }

    this.setState({ ratingAvg: average, numberOfRatings: numberOfRatings });



  }

  rateOnce(user_id) {
    firebase.database().ref(`/users/student/${this.state.uid}/ratedClubs`).on('value', (snapshot) => {
      if (snapshot.val() !== null) {

        snapshot.forEach((child) => {
          if (child.val().id === user_id) {
            this.setState({ ratedOnce: false });
            this.calculateRatingsAvg(user_id)
          }
        })
      }
    })
  }
  render() {
    const { navigation } = this.props;
    user_id = navigation.getParam('uid');
    const user_name = navigation.getParam('name');
    const user_bio = navigation.getParam('bio');
    const user_image = navigation.getParam('image');
    const user_back = navigation.getParam('back');
    const user_email = navigation.getParam('email');
    const user_lat = navigation.getParam('lat');
    const user_lon = navigation.getParam('lon');
    const club_locDes = navigation.getParam('des');
    console.log(user_back)
    const _goBack = () => console.log('Went back');
    const { rating } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.clubInfoContainer}>
          <ImageBackground
            source={{ uri: user_back }}
            style={{ width: "100%", height: 150, alignItems: "center" }}
            resizeMode="cover"
          >

            {
              this.isFollowed(user_id) ? <View style={styles.unFollowButton}>
                <TouchableOpacity onPress={() => { this.follow(user_id, this.isFollowed(user_id)) }}>
                  <Text style={styles.buttonText}>UnFollow</Text>
                </TouchableOpacity>
              </View>

                :

                <View style={styles.followButton}>
                  <TouchableOpacity onPress={() => { this.follow(user_id, this.isFollowed(user_id)) }}>
                    <Text style={styles.buttonText}>Follow</Text>
                  </TouchableOpacity>

                </View>

            }
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
                  source={{ uri: ((user_image)) }}
                  style={{ width: 100, height: 100, borderRadius: 200 / 2 }}
                />

              </View>
            </View>
            <View style={styles.name1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Map',
                    { uid: user_id, name: user_name, bio: user_bio, image: user_image, lat: user_lat, lon: user_lon, des: club_locDes })
                }}>
                <Iconi name="map-marker-alt" size='50%'
                  style={{
                    marginTop: 5,
                    marginLeft: 10,
                    left: "-70%",

                  }} />
                <Text>map</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{user_name}</Text>

            <Rating imageSize={20} readonly startingValue={this.state.ratingAvg} style={styles.rating} />
            <Text style={styles.totalRatings} >{this.state.numberOfRatings} Ratings</Text>


            {
              this.state.ratedOnce ? <View style={styles.rateButton}>
                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate('rateUs',
                    { uid: user_id, clubName: user_name })
                }}>
                  <Text style={styles.buttonText}>Rate Us!</Text>
                </TouchableOpacity>
              </View>
                :
                <View>

                </View>
            }
          </View>
          <View style={styles.bioView}>
            <Text style={styles.bio}>{user_bio}</Text>
          </View>

          {/* <Text style={styles.followersAll} >{this.state.numOfFollowers} <Text style={styles.followers}>Followers</Text></Text> */}

        </View>


        <FlatList
          data={this.state.dataSource}
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

                  <TouchableOpacity>

                  </TouchableOpacity>

                  <Text numberOfLines={5} style={styles.annTitle}>
                    {item.title + ":"}
                  </Text>
                  <ScrollView style={styles.scroll}>
                    <Text style={styles.description}>
                      {item.text}
                    </Text>
                  </ScrollView>


                  <Text style={styles.postDate}>{item.postDate}</Text>


                </View>

              </View>

            );
          }//end render item2
          }//end render item1
        />


        <TouchableOpacity activeOpacity={0.5} style={styles.TouchableOpacityStyle}>
          <Image source={{ uri: 'https://www.pngrepo.com/png/271154/512/google-maps.png' }}
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
  clubInfoContainer: {
    borderWidth: 0.25,
    borderColor: "grey",
    padding: 0

  },

  name: {
    fontWeight: "bold",
    fontSize: 16
    // top:"-15%",
    // left:"6%"

  },
  name1: {
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: 300,

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
    borderRadius: 90 / 2
  },
  dataContainer: {
    paddingLeft: 20,
    paddingTop: 10,
    width: width - 80,
    padding: 7,
    backgroundColor: "#ffffff"

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
    width: "80%"
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
    width: 80,
    height: 25,
    backgroundColor: "#0C7B93",
    color: 'white',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50,
    left: "70%",
    top: "-70%"


  },
  buttonText: {
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
    left: "80%"
  },

  MainContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor : '#F5F5F5'
  },
  TouchableOpacityStyle: {

    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    top: 650,
    marginVertical: 70
  },

  FloatingButtonStyle: {

    resizeMode: 'contain',
    width: 70,
    height: 70,
    shadowRadius: 6
  },
  unFollowButton: {
    margin: 3,
    marginBottom: -0.08,

    width: 80,
    height: 25,
    left: "35%",
    top: "85%",
    backgroundColor: "grey",
    color: 'white',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50
  },
  followButton: {
    margin: 3,
    marginBottom: -0.08,
    width: 80,
    height: 25,
    left: "35%",
    top: "85%",
    backgroundColor: "#0C7B93",
    color: 'white',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50
  },
  rateButton: {
    margin: 3,
    marginBottom: -0.08,

    width: 80,
    height: 25,
    backgroundColor: "#0C7B93",
    color: 'white',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50
  },
  totalRatings: {
    left: "22%",
    top: "-10%"
  }
});
