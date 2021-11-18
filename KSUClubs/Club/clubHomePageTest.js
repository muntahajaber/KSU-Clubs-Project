import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    StatusBar,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
    ImageBackground,
    FlatList
  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
//import ListCard from "./ListCard";
//import { ScrollView } from "react-native-gesture-handler";
import firebase from '../src/firebase/config';
const numColumns = 2;
const {width, height} = Dimensions.get('window');
export default class Detail extends Component {

  constructor() {
    super();
    
    this.state={
       name:'',
       bio:'',
       photoUrl:'',
       image:'',
       dataSource: [],
       uid: firebase.auth().currentUser.uid,
       background:'',
       numOfFollowers: 0
 
    }
 
    this.componentDidMount();

  }

  componentDidMount() {
    var id;
    var name;
    var image;
    var back;
    var description;

    firebase.database().ref(`/users/club/${this.state.uid}`) .once("value")
    .then((snapshot) => {
      id = snapshot.val().id;
      name = snapshot.val().name;
      image = snapshot.val().image;
      back = snapshot.val().backgroundImage;
      description= snapshot.val().description;

      this.setState({
        id: id,
        name: name,
        image: image,
        back: back,
        description: description,
    });
        console.log(this.state.back)

    }); 

    firebase.database().ref(`/users/club/Announcements`).on('value', (snapshot) =>{
        var li = []
        snapshot.forEach((child)=>{
            if (child.val().clubId === this.state.uid)
            li.push({ 
                title: child.val().title,
                text: child.val().text,
                startDate:child.val().startDate,
                endDate: child.val().endDate,
                postDate: child.val().postDate, 
   
                id: child.key,  
                clubId:child.val().clubId,
                name:child.val().clubName,
                image:child.val().clubImage, 
 
            
        })   
    
    })  
    this.setState({dataSource: li})
})

}

deleteAnnouncement(id){
    firebase.database().ref(`/users/club/Announcements/${id}`).remove()
    console.log("club removed")
}

separator = () => {
    return (
      <View style={{height: 10, width: '100%', backgroundColor: '#e5e5e5'}} />
    );
  };
  
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {

    return ( 
    <View style={{flex: 1}}>
    <View style={styles.clubInfoContainer}>
       <ImageBackground
            source={{ uri: this.state.back}}
            style={{ width: "100%", height: 150, alignItems: "center" }}
            resizeMode="cover"
          >       
        </ImageBackground>
    <View style={styles.info}>
        <View
          style={{
            width: "100%",
            marginTop: 5,
            marginBottom: 5,
            justifyContent: "center",
            alignItems: "center",
           // top:"-17%",
           // left:"5%"
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#5facdb",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

          <Image
              source={{ uri: ((this.state.image)) }}
              style={{width: 100, height: 100, borderRadius: 200/ 2}}
            />
            
          </View>
          </View>
          <Text style={styles.name}>{this.state.name}</Text>
        </View>
        <View style={styles.bioView}>
        <Text style={styles.bio}>{this.state.description}</Text>
        </View>

       
        
  </View>
  
  
  <FlatList
          data={this.state.dataSource}  
          ItemSeparatorComponent={() => this.separator()}
          renderItem={({item, index}) => {
            return (
              <View style={styles.bookContainer} onPress={() => this.props.navigation.navigate('ClubNavigator')}>
                <Image style={styles.image} 
                    source={{ uri: (item.image) }}
                   />
               
                <View style={styles.dataContainer}>
                  <Text numberOfLines={4} style={styles.title}>
                    {item.name} 
                  </Text>


                  <Text numberOfLines={5} style={styles.annTitle}>
                    {item.title+":"}
                  </Text>
                <ScrollView style={styles.scroll}> 
                  <Text style={styles.description}>
                    {item.text}
                  </Text>  
                  </ScrollView>

                  <View style={styles.button}>
                  <TouchableOpacity onPress = {() => { 
                            Alert.alert(
                            "Confirmation",
                            `Are you sure you want to delete ${item.title}?`,
                            [
                            {
                            text: "Yes",
                            onPress: () =>  {this.deleteAnnouncement(item.id)},
                            },
                            { text: "No", onPress: () => console.log("No Pressed") }
                            ],
                            { cancelable: false }
                        );

                        }}>
                             <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                  </View>
            
                  <Text style={styles.postDate}>{item.postDate}</Text>


                </View>
                
              </View>
            
            );
          }//end render item2
          }//end render item1
        /> 
    </View>
   )
  }
}

const styles = StyleSheet.create({

    square: {
        width: "100%",
        height: "30%",
        top:"0%",
    //  left:"15%",
        alignSelf:"center",
        justifyContent:'center',
        alignItems:'center',
       // borderRadius: 50
        
    },
    clubInfoContainer: {
        borderWidth:0.25,
        borderColor:"grey",
        padding:0
        
    },

    name: {
        fontWeight:"bold",
        fontSize:16
       // top:"-15%",
       // left:"6%"
  
    },
    bio:{
        alignSelf:"center",
        justifyContent:'center',
        alignItems:'center',
    },
    bioView:{
        alignSelf:"center",
        justifyContent:'center',
         alignItems:'center',
         width:"89%",
         top:"-15%"
    },
    info:{
        //backgroundColor:"black",
        alignSelf:"center",
        justifyContent:'center',
         alignItems:'center',
         top:"-20%",
        // width:"80%"
         left:"-33%",
         

    },
    followers:{
        color:"#0C7B93",
     },
     followersAll:{
        left:"8%",
        top:"-9%",
        
     },
  
    background: {
      flex: 1,
      width: null,
      height: null,
    },
    circle: {
       height: 50, 
      },
      clubImage: {
        width: 80,
        height: 80,
         borderRadius: 20,
      },
      /////////////////////////////////////
      container: {
        flex: 1,
      },
      header: {
        height: 80,
        width: '100%',
        //backgroundColor: '#0C7B93',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
       // borderColor:"gray"
      },
    
      bookContainer: {
        flexDirection: 'row',
        padding: 5,
      },
      image: {
        height: 70,
        width: 70,
        paddingTop: 10,
        borderRadius:90/2
      },
      dataContainer: {
        paddingLeft: 20,
        paddingTop: 10,
        width: width - 80,
        padding:7,
        backgroundColor:"#ffffff"
    
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
         color: '#000',
         padding:3,
    
      },
      description: {
        fontSize: 16,
        color: 'black',
        padding:3,
        left: "5%",
        width:"80%"
      },
      author: {
        fontSize: 16,
      },
      itemStyle:{
        backgroundColor:"#ffffff",
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        margin:1,
        height:width/numColumns
      },
      itemText:{
        color:"#de5900",
        fontSize:30
      },
      button: {
        margin:3,
       marginBottom:-0.08,
        width: 80,
        height: 25,
         backgroundColor: "#0C7B93",
        color: 'white',
        justifyContent: 'center',
        alignContent:"center",
        alignItems:"center",
        borderRadius: 50,
        left:"70%",
        top:"-70%"
  
    
      },
      buttonText: {
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
    
    
      },
        annTitle: {
            fontSize: 16,
            color: '#0C7B93',
            padding:3,
            left:"5%"
        },
        time: {
            opacity:0,
            fontSize:0,
            height:0,
            width:0
    
        },
        postDate: {
            fontSize:10,
            color:'grey', 
            left:"80%"
        },
      
          MainContainer: {
        flex: 1,
       // justifyContent: 'center',
       // alignItems: 'center',
       // backgroundColor : '#F5F5F5'
      },
       TouchableOpacityStyle:{
    
        position: 'absolute', 
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        top:650
      },
    
      FloatingButtonStyle: {
    
        resizeMode: 'contain',
        width: 70,
        height: 70,
        shadowRadius:6
      }
    });
   
    


