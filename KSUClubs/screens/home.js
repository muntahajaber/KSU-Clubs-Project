
import React, { Component } from 'react';
import { Text, StyleSheet,View,TouchableOpacity,ImageBackground} from "react-native";
import {createStackNavigator } from 'react-navigation-stack';
import firebase from '../src/firebase/config';

export default class home extends Component {
  static navigationOptions = {
    header: () => null  
 };
  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('welcomeScreen')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  
  render() {
    this.state = { 
      displayName: firebase.auth().currentUser.displayName,
      //uid: firebase.auth().currentUser.uid
    }
    

    return (
   <ImageBackground style={styles.background}>
    <View style={styles.view}>
        <Text style={styles.text}> Welcome to KSUClubs App! </Text>
        <TouchableOpacity style={styles.button}
			                onPress={() => this.signOut()}>
			                <Text style={styles.buttonText}>Log Out</Text>
		         </TouchableOpacity>
    </View>
    </ImageBackground>
    )
 }}

const styles = StyleSheet.create({
    text: {
     color:"#0C7B93",
      fontSize: 28,
      alignSelf:"center",
      justifyContent:'center',
      alignItems:'center',
      
    },
    background:{
        backgroundColor:'white',
        width: '100%',
       height: '100%'
     },
     button: {
        width: '30%',
        height: '13%',
        backgroundColor: "#0C7B93",
        margin: 15,
        borderRadius: 50,
        alignSelf:"center",
        justifyContent:'center',
        alignItems:'center',
    
    
      },
      buttonText:{
        color:'white',
    
      },
      view: {
        top: '20%'
      }
  });
