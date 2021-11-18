import { TextInput } from "react-native";
import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Mci from "react-native-vector-icons/MaterialCommunityIcons";


import firebase from "../src/firebase/config";


const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

export default class studentResetPassword extends Component {
  constructor() {
    super();
    (this.state = {
      id: "",
      name: "",
      currentPassword: "",
      newPassword: "",
      confirmPass: "",
    }),
      (this.user = firebase.auth().currentUser);
  }
  // // Reauthenticates the current user and returns a promise...
  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };

  isStrongPass = (password) => {
    var isLetter = require("is-letter");
    var letter = false;
    var number = false;
    var symbol = false;
    console.log(password.length);
    console.log(password);
    for (var index = 0; index < password.length; index++) {
      console.log("enter loop");
      const element = password[index];
      if (isLetter(element)) {
        letter = true;
        console.log("find letter");
      } else if (!isNaN(element)) {
        console.log("find number");
        var number = true;
      } else if (!(!isNaN(element) || isLetter(element))) {
        console.log("find symbol");
        var symbol = true;
      }
    }
    console.log("exit loop ");
    return letter && number && symbol;
  };

  // Changes user's password...
  onChangePasswordPress = () => {
    const { currentPassword, newPassword, confirmPassword } = this.state;
    if (currentPassword == "" || newPassword == "" || confirmPassword == "") {
      alert("Please fill all empty fields!");
      return;
    }
    if (newPassword != confirmPassword) {
      alert("Confirm password doesnt match!");
      return;
    }

    if (!this.isStrongPass(newPassword)) {
      Alert.alert("Weak password format");
      return;
    }
    this.reauthenticate(currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        console.log(user);
        user
          .updatePassword(newPassword)
          .then(() => {
            Alert.alert("Password has been changed successfully");
          })
          .catch((error) => {
            console.log(error.message);
            alert(error.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
        alert("Wrong Password");
      });
  };

  componentDidMount() {
    firebase
      .database()
      .ref("/users/student/" + this.user.uid)
      .once("value")
      .then((snapshot) => {
        // var id = snapshot.val().id;
        // var name = snapshot.val().displayName;
        // var email = snapshot.val().email;
        // var image = snapshot.val().image;
        console.log(this.user.uid);
        // this.setState({
        //   id: id,
        //   name: name,
        //   email: email,
        //   image: image
        // })
      });
  }

  render() {
    const lang = this.props.locale;
    var img_url = "";

    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("studentNavigator")}
          >
            <Mci name="keyboard-backspace" color={"#000000"} size={28} />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 25, marginTop: 50 }}>RESET PASSWORD</Text>
        </View>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <TextInput
            style={styles.textInput}
            placeholder="Current Password"
            value={this.state.currentPassword}
            onChangeText={(val) => this.setState({ currentPassword: val })}
            maxLength={15}
            secureTextEntry={true}
          ></TextInput>

          <TextInput
            style={styles.textInput}
            placeholder="New Password"
            value={this.state.newPassword}
            onChangeText={(val) => this.setState({ newPassword: val })}
            maxLength={15}
            secureTextEntry={true}
          ></TextInput>

          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            value={this.state.confirmPassword}
            onChangeText={(val) => this.setState({ confirmPassword: val })}
            maxLength={15}
            secureTextEntry={true}
          ></TextInput>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onChangePasswordPress()}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  main: {
    height: 0.9 * DEVICE_HEIGHT,
    marginTop: 0.05 * DEVICE_HEIGHT,
    backgroundColor: "#F7F7F7",
    marginLeft: 0.05 * DEVICE_WIDTH,
    marginRight: 0.05 * DEVICE_WIDTH,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  linear: {
    height: 200,
    paddingTop: 15,
    paddingRight: 15,
  },
  textInput: {
    margin: 10,
    height: 40,
    width: 250,
    borderColor: "#707070",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
  },

  button: {
    margin: 10,
    width: 170,
    height: 40,
    backgroundColor: "#0C7B93",
    color: "white",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  background: {
    flex: 1,
    width: null,
    height: null,
  },
  loginText: {
    color: "white",
    marginTop: 15,
    textAlign: "center",
    top: "25%",
  },
});
