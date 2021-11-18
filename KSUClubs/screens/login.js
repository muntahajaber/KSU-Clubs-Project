import React, { Component } from 'react';
import { StyleSheet, Text, View,TouchableOpacity,Actions ,TextInput,deepDiffer,Button, ImageBackground,Alert, ActivityIndicator, ActionSheetIOS} from 'react-native';
import firebase from '../src/firebase/config';
import _ from 'lodash';
import isEqual from 'lodash/isEqual';
//import firestore from 'firebase/firestore'

export default class login extends Component {
  
  constructor() {
    super();
     
    this.state = { 
      email: '', 
      password: '',
      isLoading: false,
      type: '',
      id: "",
      flag:false
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
  typeCheck = (id)=> {
   
   var type = 'disabled club'
    console.log("inside typecheck")
    console.log(id)

      firebase.database().ref(`/users/club/${id}`).on('value', (snapshot) =>{
        console.log("firebase club")
        
        if (snapshot.val()!==null){
          
            type = 'club'
         
        }
    })

     console.log("out typeCheck")
     return type

  }

  homeNavigate =(type) => {
    if (type=== 'student') {
      this.props.navigation.navigate('studentNavigator')
     }else if (type === 'Admin') {
      this.props.navigation.navigate('TabNavigator')
     }else if (type === 'club'){
          this.props.navigation.navigate('clubNavigator')
        }else if (type === 'disabled club') {
      this.props.navigation.navigate('Login')
      Alert.alert("You are no longer able to log in, please contact KSUClubs management for more information.")

     }
  }
    
  



  userLogin = () => {
    var type =''
    this.state.email = this.state.email.trim()
    this.state.password = this.state.password.trim()
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Please enter your information to login')
    } else if (this.state.email === ''){
      Alert.alert('Please enter your email')
    } else if (this.state.password === ''){
      Alert.alert('Please enter your password')
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
        
        type = res.user.displayName
        console.log(type)
        if (type ==='club') {
         type = this.typeCheck(res.user.uid)
        }
         console.log(type)
           this.homeNavigate(type)
          
        this.setState({
          isLoading: false,
          email: '', 
          password: '',
          id: res.user.uid
        })
        
         //this.props.navigation.navigate('adminPage')
        
      })
      
      .catch(error => {
       // alert(error)
        console.log(error)
        var e = error+""
        var errorType1 = "Error: The password is invalid or the user does not have a password."
        var errorType2 = "Error: There is no user record corresponding to this identifier. The user may have been deleted."
        if (_.isEqualWith(e,errorType1)) {
        alert('The password is incorrect, please try again.')
        this.setState({
          isLoading: false,
          //email: '', 
          password: ''
        })
      }else if (_.isEqualWith(e,errorType2)){
        alert('Your email is not registered yet.')
        this.setState({
          isLoading: false,
          email: '', 
          password: ''
        })
      }
        else {
          alert(error)
          this.setState({
            isLoading: false,
             email: '', 
            password: ''
          })
        }
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
  
  