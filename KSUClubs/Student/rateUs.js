import React, { Component } from 'react';
import { Text, StyleSheet,View,TouchableOpacity,Alert} from "react-native";
import firebase from '../src/firebase/config';
import { Rating, AirbnbRating } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize'

var x = 3   // global variable for rate

export default class rateUs extends Component {

    constructor() {
        super();
        this.state = {
            rate:"",
            uid : firebase.auth().currentUser.uid

        };
      }

      ratingCompleted(rating) {
         x = rating
       // console.log("Rating is: " + x)
        //this.saveRating(rating)
      }

      saveRating(clubId){
          var numOfRatings=1
        this.setState({rate:x})

        firebase.database().ref(`/users/club/${clubId}/numberOfRatings`).on('value', (snapshot) =>{
            if (snapshot.val()!==null){
                numOfRatings = snapshot.val().numberOfRatings+1
            }
        })

        firebase.database().ref(`/users/club/${clubId}/numberOfRatings`).set({"numberOfRatings":numOfRatings})
        console.log(this.state.rate)

        this.saveTotalRatings(clubId)
        this.saveRatedClub(clubId)
      }

      saveTotalRatings(clubId){
          var total = 0
        firebase.database().ref(`/users/club/${clubId}/totalOfRatings`).on('value', (snapshot) =>{
            if (snapshot.val()!==null){
                total = snapshot.val().total
            }
        })
        
        firebase.database().ref(`/users/club/${clubId}/totalOfRatings`).set({"total":total+this.state.rate})
        console.log(this.state.rate)

      }
      saveRatedClub(clubId) {
        firebase.database().ref(`/users/student/${this.state.uid}/ratedClubs`).push({"id":clubId})
      }


    render() {
        const { navigation } = this.props;  
        const user_id= navigation.getParam('uid'); 
        const user_name= navigation.getParam('clubName'); 
        console.log(user_id)
        return (<View>
      <View style={styles.view}>
      <Text style={styles.clubNameText}> { user_name} </Text>
      <View style={styles.messageView}>
      <Text style={styles.message}> {"Your opinion matters to us!"} </Text>
      </View>
      </View>

      <View  style= {styles.ratingView}>

      <AirbnbRating 
        onFinishRating={this.ratingCompleted}
       
      />

      </View>

        <View style={styles.sendButtonView}>
      <TouchableOpacity style={styles.sendButton}
			            onPress={() => {      
                        Alert.alert(
                        'Confirmation',
                        'Are you sure you want to send rating?',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {text: 'Yes', onPress: () => {
                          this.saveRating(user_id) 
                          this.props.navigation.navigate("clubHomePageBrowse")
                          Alert.alert("Thanks for your feedback.")}},
                        ], 
                        {cancelable: false},
                      );}}>
                <Text style={styles.sendButtonText}>Send</Text>
             </TouchableOpacity>
       </View>

       
       <View style={styles.cancelButtonView}>
      <TouchableOpacity style={styles.cancelButton}
			            onPress={() => { this.props.navigation.navigate("clubHomePageBrowse")}}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
             </TouchableOpacity>
       </View>
         
      </View>
       
        )
     }}
     const styles = StyleSheet.create({
      clubNameText: {
       color:"#0C7B93",
        fontSize: normalize(25),
        alignSelf:"center",
        justifyContent:'center',
        alignItems:'center',
        fontWeight:"bold",
        top:"-50%"
        
      },
      message:{
        color:"#0C7B93",
        fontSize: normalize(24),
        alignSelf:"center",
        justifyContent:'center',
        alignItems:'center',
        //fontWeight:"bold",
        top:"-50%"
      },
      messageView:{
        alignSelf:"center",
        justifyContent:'center',
        alignItems:'center',

      },
       sendButton: {
          width: '50%',
          height: '25%',
          backgroundColor: "#0C7B93",
          //margin: 15,
          borderRadius: 50,
          alignSelf:"center",
          justifyContent:'center',
          alignItems:'center',
          left:"50%"
      
      
        },
        sendButtonText:{
          color:'white',
          fontWeight:'bold'
      
        },
        cancelButton: {
            width: '50%',
            height: '25%',
            //margin: 15,
            borderRadius: 50,
            alignSelf:"center",
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:"grey",
            left:"50%"
        
        
          },
          cancelButtonText:{
            color:'white',
            fontWeight:'bold'
        
          },
        view: {
          top: '20%'
        },
        ratingView:{
            top:"23%"
        },
        sendButtonView:{
            top:"40%",
            left:"20%",
            width:"50%",
           // backgroundColor:"black"
        },
        cancelButtonView:{
            top:"15.2%",
            right:"20%",
            width:"50%",
           // backgroundColor:"black"
        }
    });