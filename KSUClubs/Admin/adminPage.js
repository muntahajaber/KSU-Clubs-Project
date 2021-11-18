import React, { Component } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity,FlatList,ScrollView,deepDiffer,Button, ImageBackground,Alert, ActivityIndicator, ActionSheetIOS} from 'react-native';
import firebase from '../src/firebase/config';
import _ from 'lodash';

/* this is old page, please go to adminPage2 */

export default class adminPage extends Component {

  constructor(props){
    super(props);
    this.state={ 
    list:[],
    displayName: firebase.auth().currentUser.displayName,
    uid: firebase.auth().currentUser.uid
    } }
   
    componentDidMount(){

      firebase.database().ref(`/users/club`).on('value', (snapshot) =>{
        var li = []
        snapshot.forEach((child)=>{
         li.push({
          id: child.key,
          name:child.val().name,
          email: child.val().email
        })
      })
     this.setState({list:li})
    })
   }
   list = () => {
    return this.state.list.map(element => {
      return (
        <View style={styles.clubsView}>
          <Text style={styles.clubName}> {element.name} </Text> 
          <Text style={styles.clubEmail}> {element.email}  </Text>
           <Image style={styles.clubsImages} source={require('../images/logo.png')} resizeMode="contain"/> 
           <TouchableOpacity style={styles.button}	onPress = {() => { 
             Alert.alert(
              "Alert",
              `Are you sure you want to delete ${element.name}?`,
            [
            {
              text: "Yes",
              onPress: () =>  {
                firebase.database().ref(`/users/club/${element.id}`).remove()
                console.log("Yes Pressed")
                },
            },
            { text: "No", onPress: () => console.log("No Pressed") }
            ],
            { cancelable: false }
          );

            console.log("club removed")
          }}><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
          
        </View>
      );
    });
  };


    render() {
    
        return( 
         <View style={{height:"100%",width:"100%"}}>         
            <View style={styles.square}>
                
          </View>
             <View style={styles.circle} >
                    <Image style={styles.image} source={require('../images/logo.png')} resizeMode="contain"/>
            </View> 

            <Text style={styles.title}>Clubs Management</Text>

            {/* <ScrollView>
            <View>{this.list()}</View>
            </ScrollView> */}
    
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


    button: {
     // margin: 15,
        width: 70,
        height: 35,
        top:"-76%",
        left:"35%",
        backgroundColor: "#0C7B93",
        color: 'white',
        justifyContent: 'center',
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
        width: 110,
        height: 110,
        top: -70,
        color: 'green',
        alignSelf:"center",
        borderColor:"#0C7B93",
        borderWidth:1,
        // justifyContent:'center',
        //marginTop: 10,
        //textAlign: 'center',
        //top: "25%",
        borderRadius: 110/2
      },
      image: {
        alignSelf:"center", 
        aspectRatio: 1,
        height: undefined, 
        width:undefined,
        top:"10%",
        flex:0.80
      },
      clubsImages: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        top: "-2%",
        left:"-42%",
        color: 'green',
       // alignSelf:"center",
        borderColor:"#0C7B93",
        borderWidth:1,
        // justifyContent:'center',
        //marginTop: 10,
        //textAlign: 'center',
        //top: "25%",
        borderRadius: 50/2
      },
      clubsView:{
      
        borderWidth:2,
        borderColor:"#0C7B93",
        borderRadius: 50,
        margin:2,
        height:60,
        justifyContent: 'center',
        alignContent:"center",
        alignItems:"center",
        
      },
      title: {
        fontSize: 20,
        fontWeight:"bold",
        color: "#0C7B93",
        justifyContent: 'center',
        alignContent:"center",
        alignItems:"center",
        top: -55,
        left: "26%"

      },
      clubName: {
        fontSize: 15,
        fontWeight:"bold",
        top:"70%"
      },
      clubEmail: {
        fontSize: 15,
        top:"70%"
      },
    
  });
     








