import * as React from 'react';
import { View, Text, Alert, Modal, Image, ImageBackground } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import ListCard from "./ListCard";
import { ScrollView } from "react-native-gesture-handler";
import firebase from '../src/firebase/config';

export default class Detail extends React.Component {

  constructor() {
    super();
    
    this.state={
       name:'',
       email:'',
       bio:'',
       photoUrl:'', 
       uid:'',
       image:'',
       categories: []
         

    }
 
    this.componentDidMount();

  }

  componentDidMount() {
    

var uid = firebase.auth().currentUser.uid;
var name, email, photoUrl, uid, emailVerified;

if (uid != null) {
  this.setState({uid:uid})
  firebase.database().ref(`/users/club/${this.state.uid}`).on('value', (snapshot) =>{
//     li.push({ 
     
//       id: snapshot.val().id,  
//       name: snapshot.val().name,
//       image:snapshot.val().image, 
//       back: snapshot.val().backgroundImage,
//       description: snapshot.val().description,

  
// })   

  })
    
 }

 }
 
  
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
     const { navigation } = this.props;  
    const user_id= navigation.getParam('uid'); 
    const user_name= navigation.getParam('name'); 
    const user_email= navigation.getParam('email');
    const user_image= navigation.getParam('image');  
    const _goBack = () => console.log('Went back');

    
  //  const { modalVisible } = this.state;
    return (
      <ImageBackground
        source={require("../images/bak4.png")}
        style={{ height: "100%", width: "100%" }}
      >  

      <Icon name="ios-arrow-back"  size='50%' color="#ffffff"
       style={{
            marginTop: 10,
            marginLeft:10,
            backgroundColor: "#fffff",
            
          }}
                 onPress={() => this.props.navigation.goBack()}
/>
     

        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
         
        </View>

        <View
          style={{
            width: "100%",
            marginTop: 5,
            marginBottom: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 50,
              backgroundColor: "#5facdb",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

          <Image
              source={{ uri: ((this.state.image))}}
               
              style={{width: 80, height: 80, borderRadius: 100/ 2}}
            />
            
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center=",
            paddingHorizontal: 40,
             justifyContent: "center"
          }}
        >
          <Text
            style={{
              fontSize: 20,
              //fontFamily: "RobotoBold",
              color: "#ffffff"
            }}
          >
            {(this.state.name)}
          </Text>

        </View>

       <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 40,
             justifyContent: "center"
          }}
        >
        <Text
            style={{
              fontSize: 15,
              //fontFamily: "RobotoBold",
              color: "#ffffff",
              paddingTop:9,
              paddingRight:-15
            }}
          >
          
           {(user_email)}
          
                    </Text>
           </View>


        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 40,
            marginTop: 60,
            marginLeft: 228
          }}
        >
         
        </View>
        
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginVertical: 10,
          }}
        >

          <ListCard
            
          />
          <ListCard
           
          />
          
         
        </ScrollView>
      </View>
      </ImageBackground>
     
    );
  }
}