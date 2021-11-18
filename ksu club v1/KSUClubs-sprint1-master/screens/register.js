// components/signup.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity,ImageBackground ,Button, Alert, ActivityIndicator } from 'react-native';
import firebase from '../src/firebase/config';


export default class register extends Component {
  
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
    if(this.state.email === '' || this.state.password === '' || this.state.displayName === '') {
      Alert.alert('Enter details to signup!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: this.state.displayName
        })
        console.log('User registered successfully!')
        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('home')
      })
      .catch((error) => {
        alert(error)
        this.setState({
            isLoading: false,
            displayName: '',
            email: '', 
            password: ''
          })
});     
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    
    return (
        <ImageBackground
         source={require('../images/background1.png')}
        style={styles.background} resizeMode="stretch">
      <Text style={styles.text}>Get on board</Text>
        <View style={styles.square}>

      <TextInput style = {styles.textInput} placeholder = 'Username' value={this.state.displayName}
           onChangeText={(val) => this.updateInputVal(val, 'displayName')}></TextInput>

      <TextInput style = {styles.textInput} placeholder = 'Email' value={this.state.email}
           onChangeText={(val) => this.updateInputVal(val, 'email')} ></TextInput>

     <TextInput style = {styles.textInput} placeholder = 'Password' value={this.state.password}
           onChangeText={(val) => this.updateInputVal(val, 'password')}
           maxLength={15}
           secureTextEntry={true}></TextInput>

            <TouchableOpacity style={styles.button}
			                onPress={() => this.registerUser()}>
                <Text style={styles.buttonText}>Register</Text>
             </TouchableOpacity>
                            
       </View>
       <Text 
          style={styles.loginText}
           onPress={() => this.props.navigation.navigate('Login')}>
           Already Registered? Click here to <Text style={{fontWeight:'bold'}}>login</Text>
         </Text>   
       </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    text: {
      fontSize: 30,
      color: 'white',
      top: "15%",
      left: "15%",
      fontWeight: 'bold',
      fontFamily: 'Arial'
    },
    square: {
        backgroundColor: 'white',
        width: 294,
        height: 330,
        top:"20%",
       // left:"15%",
        alignSelf:"center",
       justifyContent:'center',
        alignItems:'center',
        borderRadius: 50
        
    },
    textInput: {
      margin: 15,
      height: 40,
      width:250,
      borderColor: '#707070',
      borderWidth: 1,
      borderRadius: 50,
      textAlign: 'center'
  
    },
  
    button: {
      margin: 15,
      width: 170,
    height: 40,
      backgroundColor: "#0C7B93",
      color: 'white',
      justifyContent: 'center',
      alignContent:"center",
      alignItems:"center",
      borderRadius: 50
  
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
        color: 'white',
        marginTop: 25,
        textAlign: 'center',
        top: "25%"
      },
    
  });