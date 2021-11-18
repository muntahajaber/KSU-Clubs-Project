import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Iconi from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "../src/firebase/config";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Permissions from "expo-permissions";
// import RNFetchBlob from 'react-native-fetch-blob'
// import ImagePicker from "react-native-image-picker";
var parse = require("url-parse");

export default class studentEditProfile extends Component {
  constructor() {
    super();
    (this.state = {
      displayName: firebase.auth().currentUser.displayName,
      id: "",
      name: "",
      email: "",
      club: "",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/ksuclubs-e58d9.appspot.com/o/images%2Fpro18422?alt=media&token=26902bf4-f317-4762-a273-6f4bfc943fc7",
      fileName: "",
      type: "",
      data: "",
      uri: "",
      back: "",
      image: "",
    }),
      (this.user = firebase.auth().currentUser);
  }

  async componentDidMount() {
    await firebase
      .database()
      .ref("/users/student/" + this.user.uid)
      .once("value")
      .then((snapshot) => {
        var id = snapshot.val().id;
        var name = snapshot.val().name;
        var email = snapshot.val().email;
        var image = snapshot.val().image;
        var backimage = snapshot.val().backgroundImage;
        if (image == "") {
          image =
            "http://www.cybecys.com/wp-content/uploads/2017/07/no-profile.png";
        }
        console.log(this.user.uid);
        this.setState({
          id: id,
          name: name,
          email: email,
          image: image,
          back: backimage,
        });
      });
  }

  updateprofile() {
    const { id, email, name, imageUrl, image, back } = this.state;
    if (name == "") {
      alert("please input name");
      return;
    }
    var proimage = "";
    var backimage = "";

    firebase.database().ref(`/users/student/${this.user.uid}`).update({
      id: id,
      image: this.state.image,
      name: name,
      email: email,
      backgroundImage: this.state.back,
    });
    //alert("update");

    this.props.navigation.goBack()

  }

  selectImage = async () => {
    var d = new Date();
    var pro_title = "pro" + d.getHours() + d.getMinutes() + d.getSeconds();

    const permission = await Permissions.getAsync(Permissions.CAMERA);
    if (permission.status !== "granted") {
      const newPermission = await Permissions.askAsync(Permissions.CAMERA);
      if (newPermission.status === "granted") {
        //its granted.
      }
    } else {
    }
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      this.setState({
        imageUrl: result.uri,
      });
      this.uploadImage(result.uri, pro_title);
      this.setState({ image: pro_title })
        .then(() => {
          // Alert.alert("success");
        })
        .catch((error) => {
          Alert.alert(error);
        });
    }
  };

  selectbackImage = async () => {
    var d = new Date();
    var back_title = "back" + d.getHours() + d.getMinutes() + d.getSeconds();

    const permission = await Permissions.askAsync(Permissions.CAMERA);
    if (permission.status !== "granted") {
      //   const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      //   if (newPermission.status === "granted") {
      //     //its granted.
      //   }
    }
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      this.setState({
        imageUrl: result.uri,
      });
      this.setState({ back: back_title });
      this.uploadImage1(result.uri, back_title)
        .then(() => {
          //   Alert.alert("success");
        })
        .catch((error) => {
          Alert.alert(error);
        });
    }
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName);

    ref
      .put(blob)
      .then(() => {
        return firebase
          .storage()
          .ref()
          .child("images/" + imageName)
          .getDownloadURL();
      })
      .then((uploadedFile) => {
        this.setState({
          image: uploadedFile,
        });
      });
  };

  uploadImage1 = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName);

    ref
      .put(blob)
      .then(() => {
        return firebase
          .storage()
          .ref()
          .child("images/" + imageName)
          .getDownloadURL();
      })
      .then((uploadedFile) => {
        this.setState({
          back: uploadedFile,
        });
      });
  };

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.view}>
          <View
            style={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>Edit Your Profile</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("studentNavigator")}
              style={{ position: "absolute", top: 15, left: 10 }}
            >
              <Iconi name="keyboard-backspace" color={"#000000"} size={25} />
            </TouchableOpacity>
          </View>
          {this.state.back == "" && (
            <LinearGradient
              start={{
                x: 0.79,
                y: 0.41,
              }}
              end={{
                x: -0.04,
                y: 0.62,
              }}
              locations={[0, 1]}
              colors={["#81C5FB", "#A8EAE1"]}
              style={styles.linear}
            >
              <TouchableOpacity onPress={() => this.selectImage()}>
                <Image
                  source={{ uri: this.state.image }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.selectbackImage()}
                style={{ position: "absolute", bottom: 5, left: 15 }}
              >
                <Icon name="camera" color={"#000000"} size={25} />
              </TouchableOpacity>
            </LinearGradient>
          )}

          {this.state.back != "" && (
            <ImageBackground
              source={{ uri: this.state.back }}
              style={{ width: "100%", height: 200, alignItems: "center" }}
            >
              <TouchableOpacity onPress={() => this.selectImage()}>
                <Image
                  source={{ uri: this.state.image }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    marginTop: 10,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.selectbackImage()}
                style={{ position: "absolute", bottom: 5, left: 15 }}
              >
                <Icon name="camera" color={"#000000"} size={25} />
              </TouchableOpacity>
            </ImageBackground>
          )}

          <View style={{ height: "100%", backgroundColor: "#f6f6f6" }}>
            <Text style={styles.label}>Update Student Name:</Text>
            <View style={{ margin: 10, backgroundColor: "white" }}>
              <View style={{ flexDirection: "row", padding: 10 }}>
                <Text style={{ width: "20%", marginTop: 5 }}>New Name:</Text>
                <TextInput
                  placeholder="insert name here"
                  placeholderTextColor="#ABABAB"
                  value={this.state.name}
                  onChangeText={(value) => this.setState({ name: value })}
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                  }}
                />
              </View>
              {/* <View style={{flexDirection:'row', padding:10}}>
                        <Text style={{width:'20%', marginTop:5}}>Email:</Text>
                        <TextInput
                            placeholder="Please input email"
                            placeholderTextColor="#ABABAB"
                            value = { this.state.email }
                            onChangeText={value =>
                                this.setState({email: value})
                            }
                            style={{
                                fontSize:16,
                                marginLeft:10,
                            }}
                        />
                    </View> */}
            </View>
            {/* <Text style={styles.label}>Club Info</Text>

                <View style={{margin:10, backgroundColor:'white'}}>
                    <TextInput
                        name="description"
                        placeholder="Your Descrption..."
                        placeholderTextColor="#ABABAB"
                        returnKeyType="next"
                        multiline={true}
                        numberOfLines = {5}
                        value = { this.state.club }
                        onChangeText={value =>
                            this.setState({club: value})
                        }
                        style={{
                            color:'black',
                            fontSize:16,
                            height:140,
                            marginTop:5,
                            marginLeft:10,
                            textAlignVertical:'top'

                        }}
                    />
                </View> */}

            <View
              style={{
                height: 180,
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                paddingTop: 30,
              }}
            >
              <TouchableOpacity
                onPress={() => this.updateprofile()}
                style={styles.save_btn}
              >
                <Text style={{ color: "white" }}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: "#0C7B93",
    fontSize: 28,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  button: {
    width: "30%",
    height: "13%",
    backgroundColor: "#0C7B93",
    margin: 15,
    borderRadius: 50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },

  label: {
    color: "#616568",
    paddingLeft: 10,
    marginTop: 20,
    // marginLeft:5
  },

  textInput: {
    color: "black",
    fontSize: 16,
    height: 40,
    marginTop: 5,
    marginLeft: 10,
  },
  row: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#808080",
    paddingTop: 10,
    paddingLeft: 20,
  },
  containerLoader: {
    flex: 1,
    justifyContent: "center",
  },
  upload_btn: {
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  save_btn: {
    width: "70%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0C7B93",
  },
  linear: {
    height: 200,
    paddingTop: 15,
    paddingRight: 15,
    alignItems: "center",
  },
});