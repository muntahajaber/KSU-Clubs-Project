import React, { Component } from 'react';
import { Text, StyleSheet,View,TouchableOpacity,ImageBackground} from "react-native";
//import {createStackNavigator } from 'react-navigation-stack';
import firebase from '../src/firebase/config';


export default class clubHomePageD extends Component {
  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('welcomeScreen')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  
    render() {
    
        return (
       
          <View>
          <View style={styles.view}>
      <Text style={styles.text}> Home </Text>
      </View>
         
      </View>
       
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
          height: '20%',
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