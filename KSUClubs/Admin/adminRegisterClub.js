import React, { Component } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity,Actions ,TextInput,deepDiffer,Button, ImageBackground,Alert, ActivityIndicator, ActionSheetIOS} from 'react-native';
import firebase from '../src/firebase/config';
import _ from 'lodash';
import email from 'react-native-email'

export default class adminRegisterClub extends Component {
     
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
      handleEmail = () => {
        const to = [this.state.email]  // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'KSUClubs Registration',
            body: `Dear ${this.state.displayName} \n We are glad to tell you that your Club now is part of KSUClubs Application \n 
            please find your login information:\n
            email: ${this.state.email}\n
            password: ${this.state.password}\n
            please note that the password is one time password, you need to reset it for security purposes` 
        }).catch(console.error)
    }
    
      updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
      }

       getRandomString(length) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?><';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
        }

        generatePassword(){
            var strong = false;
            var password = ""
            while (!strong) {
                password = this.getRandomString(8)
                if (this.isStrongPass(password)){
                    strong = true
                }
            }
            console.log(password)
            this.setState({
                password: password,
              })
            return password

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
       // this.state.confirmPassword = this.state.confirmPassword.trim()
    
        if(this.state.email === '' && this.state.password === '' && this.state.displayName=== '') {
          Alert.alert('Please enter your information to register.')
        } else if (this.state.email === '' || this.state.password === '' || this.state.displayName === ''){
          Alert.alert('Please fill the empty fields.')
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
              displayName: 'club'
            })
            console.log('User registered successfully!')
            firebase.database().ref(`/users/club/${res.user.uid}`)
            .set({"id":res.user.uid,"name":this.state.displayName,"email":res.user.email,"image":"","backgroundImage":"","description":"","numOfFollowers":0,"Announcements":""});
            this.handleEmail()
            this.setState({
              isLoading: false,
              displayName: '',
              email: '', 
              password: '',
              confirmPassword: ''
            })
            
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
        // this.state = { 
        //   displayName: firebase.auth().currentUser.displayName,
        //   uid: firebase.auth().currentUser.uid
        // }
        if(this.state.isLoading){
            return(
              <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
          }    
    
        return( 
         <View>
                       
            <View style={styles.square}>
                 <Text>  </Text>
            </View>
    
             <View style={styles.circle} >
                    <Image style={styles.image} source={require('../images/logo.png')} resizeMode="contain"/>
            </View> 
                <View>
                        <Text style={styles.title}>Club Registration</Text>
                </View>
            <View style={styles.textFieldsView}>
            <TextInput style = {styles.textInput} placeholder = 'Name' value={this.state.displayName}
           onChangeText={(val) => this.updateInputVal(val, 'displayName')}></TextInput>

      <TextInput style = {styles.textInput} placeholder = 'Email' value={this.state.email}
           onChangeText={(val) => this.updateInputVal(val, 'email')} ></TextInput>

     <TextInput style = {styles.textInput} placeholder = 'Password' value={this.state.password}
           onChangeText={(val) => this.updateInputVal(val, 'password')}
           maxLength={15}
           secureTextEntry={true}
           selectTextOnFocus={false}
           editable={false}></TextInput>

     
            <TouchableOpacity style={styles.button}
			                onPress={() => this.registerUser()}>
                <Text style={styles.buttonText}>Register</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.generateButton}
			                onPress={() => this.generatePassword()}>
                <Text style={styles.buttonText}>Generate</Text>
             </TouchableOpacity>

             
            </View> 

         </View>


       )


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
        backgroundColor: "#0C7B93",
        width: "100%",
        height: "23%",
        top:"0%",
       // left:"15%",
        alignSelf:"center",
       justifyContent:'center',
        alignItems:'center',
       // borderRadius: 50
        
    },
    textInput: {
      margin: 10,
      height: 40,
      width:200,
      borderColor: '#707070',
      borderWidth: 1,
      borderRadius: 50,
      justifyContent: 'center',
      alignContent:"center",
      alignItems:"center",
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
    circle: {
        backgroundColor: 'white',
        width: 100,
        height: 100,
        top: -70,
        color: 'green',
        alignSelf:"center",
        borderColor:"#0C7B93",
        borderWidth:1,
        // justifyContent:'center',
        //marginTop: 10,
        //textAlign: 'center',
        //top: "25%",
        borderRadius: 100/2
      },
      image: {
        alignSelf:"center", 
        aspectRatio: 1,
        height: undefined, 
        width:undefined,
        top:"10%",
        flex:0.80
      },
      textFieldsView: {
        justifyContent: 'center',
        alignContent:"center",
        alignItems:"center",
        top: -45
      },
      generateButton: {
        margin: 15,
        width: 70,
        height: 35,
        top:-133,
        left:"37%",
        backgroundColor: "#0C7B93",
        color: 'white',
        justifyContent: 'center',
       // alignContent:"center",
        //alignItems:"center",
        borderRadius: 50

      },
      title: {
            fontSize: 20,
            fontWeight:"bold",
            color: "#0C7B93",
            justifyContent: 'center',
             alignContent:"center",
            alignItems:"center",
            top: -55,
            left: "29%"
           


      }
    
  });