import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity ,TextInput, Button, ImageBackground,Alert, ActivityIndicator } from 'react-native';
import firebase from '../src/firebase/config';


export default class login extends Component {
  
  constructor() {
    super();
    this.state = { 
      email: '', 
      password: '',
      isLoading: false
    }
  }
  forgotPassword = (Email) => {
    firebase.auth().sendPasswordResetEmail(Email)
      .then(function (user) {
        alert('Please check your email...')
      }).catch(function (e) {
        console.log(e)
        if (e="[Error: The email address is badly formatted.]")
        alert('Please Enter your email in the email field')
        else
        alert(e)
      })
  }
  updateInputVal = (val, prop) => {

    const state = this.state;
    state[prop] = val;
    this.setState(state);

  }

  userLogin = () => {
    if(this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        console.log(res)
        console.log('User logged-in successfully!')
        this.setState({
          isLoading: false,
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('home')
      })
      
      .catch(error => {
        alert(error)
        this.setState({
            isLoading: false,
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
      <Text style={styles.text}>Hello there,</Text>
      <Text style={styles.text}>   welcome back </Text>
      <View style={styles.square}>  

        <TextInput style = {styles.textInput} placeholder = 'Email' value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}/>
        <TextInput style = {styles.textInput} placeholder = 'Password' value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}/>
    <TouchableOpacity 
        style={styles.button}
		onPress = {() => {}} 
        onPress={() => this.userLogin()}>
     <Text style={styles.buttonText}>Log in</Text>
     </TouchableOpacity>
      </View>
      <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('register')}>
          Don't have account? Click here to <Text style={{fontWeight:'bold'}}>register</Text>
        </Text>   
        <Text 
          style={styles.loginText}
          onPress={() => this.forgotPassword(this.state.email)}>
          Forgot password? <Text style={{fontWeight:'bold'}}>click here</Text>
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
        height: 290,
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
        marginTop: 10,
        textAlign: 'center',
        top: "25%"
      },
    
  });
  
  