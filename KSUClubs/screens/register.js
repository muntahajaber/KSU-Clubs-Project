// components/signup.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity,ImageBackground ,Button, Alert, ActivityIndicator } from 'react-native';
import firebase from '../src/firebase/config';
import _, { isSymbol } from 'lodash';
import isLetter from 'is-letter';

export default class register extends Component {
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      confirmPassword: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  isStrongPass = (password) => {

      var isLetter = require('is-letter');
      var letter = false
      var number = false
      var symbol = false
      console.log(password.length)
      console.log(password)
      for (var index = 0; index < password.length; index++) {
        console.log("enter loop")
        const element = password[index];
        if (isLetter(element)){
        letter = true
        console.log("find letter")
        }else if (!isNaN(element)){
          console.log("find number")
          var number = true
        }else if (!(!isNaN(element)||isLetter(element))){
          console.log("find symbol")
          var symbol = true
        }
      }
        console.log("exit loop ")
        return (letter&&number&&symbol)
    
  }

  registerUser = () => {
    this.state.email = this.state.email.trim()
    this.state.password = this.state.password.trim()
    this.state.displayName = this.state.displayName.trim()
    this.state.confirmPassword = this.state.confirmPassword.trim()

    if(this.state.email === '' && this.state.password === '' && this.state.displayName=== '' && this.state.confirmPassword ) {
      Alert.alert('Please enter your information to register.')
    } else if (this.state.email === '' || this.state.password === '' || this.state.displayName === '' || this.state.confirmPassword==='' ){
      Alert.alert('Please fill the empty fields.')
      this.setState({
        isLoading: false,
        //displayName: '',
        //email: '', 
        password: '',
        confirmPassword: ''
      })
    } else if (!_.isEqual(this.state.password,this.state.confirmPassword)){
      Alert.alert('Passwords don not match.')
      this.setState({
        isLoading: false,
        //displayName: '',
        //email: '', 
        password: '',
        confirmPassword: ''
      })
    } else if (!this.isStrongPass(this.state.password)){
      Alert.alert('Weak password')
    }
    else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: 'student'
        })
        console.log('User registered successfully!')
        firebase.database().ref(`/users/student/${res.user.uid}`)
        .set({"id":res.user.uid,"name":this.state.displayName,"email":res.user.email,"image":"","backgroundImage":""});
        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: '',
          confirmPassword: ''
        })
        this.props.navigation.navigate('studentNavigator')
      })
      .catch((error) => {
        alert(error)
        this.setState({
            isLoading: false,
            //displayName: '',
            //email: '', 
            password: '',
            confirmPassword: ''
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

      <TextInput style = {styles.textInput} placeholder = 'Name' value={this.state.displayName}
           onChangeText={(val) => this.updateInputVal(val, 'displayName')}></TextInput>

      <TextInput style = {styles.textInput} placeholder = 'Email' value={this.state.email}
           onChangeText={(val) => this.updateInputVal(val, 'email')} ></TextInput>

     <TextInput style = {styles.textInput} placeholder = 'Password' value={this.state.password}
           onChangeText={(val) => this.updateInputVal(val, 'password')}
           maxLength={15}
           secureTextEntry={true}></TextInput>

      <TextInput style = {styles.textInput} placeholder = 'Confirm Password' value={this.state.confirmPassword}
           onChangeText={(val) => this.updateInputVal(val, 'confirmPassword')}
           maxLength={15}
           secureTextEntry={true}></TextInput>
     
            <TouchableOpacity style={styles.button}
			                onPress={() => this.registerUser()}>
                <Text style={styles.buttonText}>Register</Text>
             </TouchableOpacity>

             <Text style = {styles.passwordRestrictions}>* Password should contain numbers, letters, and symbols</Text>
             <Text style = {styles.passwordRestrictions}>* Password should contain at least 6 characters</Text>  
                            
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
        width: 300,
        height: 370,
        top:"20%",
       // left:"15%",
        alignSelf:"center",
       justifyContent:'center',
        alignItems:'center',
        borderRadius: 50
        
    },
    textInput: {
      margin: 10,
      height: 40,
      width:250,
      borderColor: '#707070',
      borderWidth: 1,
      borderRadius: 50,
      textAlign: 'center'
  
    },
  
    button: {
      margin: 10,
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
        marginTop: 15,
        textAlign: 'center',
        top: "25%"
      },
      passwordRestrictions: {
        color: "#0C7B93",
        fontSize: 8,
       // marginTop: 15,
        textAlign: 'center',
       // top: "25%"
      }
    
  });