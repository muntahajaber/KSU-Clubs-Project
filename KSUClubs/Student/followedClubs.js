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
  Alert
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import firebase from '../src/firebase/config';
import Icon from 'react-native-vector-icons/Ionicons';

const formatData = (categories, numColumns) => {
  const numberOfFullRows = Math.floor(categories.length / numColumns);

  let numberOfElementsLastRow = categories.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    categories.push({ key: 'blank', empty: true });
    numberOfElementsLastRow++;
  }

  return categories;
};

const numColumns = 2;

const {width, height} = Dimensions.get('window');

export default class followedClubs extends Component {
  constructor() {
    super();
    this.state = {
      query: null,
      dataSource: [],
      dataBackup: [],
      categories: [],
      uid: firebase.auth().currentUser.uid,
      id: "",
      name: "",
      email: "",
      image: "",
      back: "",
      reRender: false,
      tryId:""
    };
  }

   componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    this.getClubs()
    
  }

  getClubs() {
    firebase.database().ref(`/users/club/`).on('value', (snapshot) =>{
        var li = []
            if (snapshot.val()!== null){
                snapshot.forEach((child)=>{
                    if (this.isFollowed(child.key)){
                   li.push({
                    id: child.key,
                    name:child.val().name,
                    email: child.val().email,
                    image:child.val().image,
                    bio:child.val().description,
                    back:child.val().backgroundImage,
                  })
                  
                }
              })  
            }
            this.setState({dataSource: li})
    })
  }
////////////////////////////////////////////////////////

  isFollowed(id) {
      var flag = false
    firebase.database().ref(`/users/student/${this.state.uid}/following`).on('value', (snapshot) =>{
        if (snapshot.val()!== null){
            snapshot.forEach((child)=>{
                if (id === child.val().id){
                    flag = true
            }
          })  
        }
       
    })
    return flag
}

////////////////////////////////////////////////////

  
  unFollow = (id) => {
     firebase
      .database()
      .ref("/users/student/" + this.state.uid +"/following")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val() !== null){
        snapshot.forEach((child)=>{
          if (child.val().id === id){
            firebase.database().ref(`/users/student/${this.state.uid}/following/${child.key}`).remove()
          }
       
   })
  }
      });
     
  }
  
  follow =(id,followed) => {
  
  if (!followed){
    firebase.database().ref(`/users/student/${this.state.uid}/following`).push({"id":id})
    
  } else if (followed) { 
    this.unFollow(id) 
   
   }
   
  }
  
  

  separator = () => {
    return (
      <View style={{height: 10, width: '100%', backgroundColor: '#e5e5e5'}} />
    );
  };
   GetGridViewItem(item) {
  
    Alert.alert(item);
  }

  renderItem=({item,index})=>{
    let{itemStyle,itemText}=styles
    if(item.empty){
      return <View style={[itemStyle]}/>
    }
    return(
      <View style={itemStyle}>
      <Text style={itemText}>{item.key}</Text>
      </View>
    )
  }

  render() {
    console.disableYellowBox = true;
    return (
      <View style={styles.container}>
         <Icon name="ios-arrow-back"  size='50%' color="#0C7B93" 
       style={{
            marginTop: 10,
            marginLeft:10,
            left:"1%",
            backgroundColor: "#fffff",
            
            
          }}
                 onPress={() => this.props.navigation.navigate('studentNavigator')}
        />
        <View style={styles.pageTitleView}><Text style={styles.pageTitle}>Followed Clubs</Text></View>
       
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
                  <Text numberOfLines={5} style={styles.description}>
                    {item.email} 
                    
                  </Text>
                 
                   
                   {
                   this.isFollowed(item.id) ? <View style={styles.unFollowButton}>
                  <TouchableOpacity onPress={() => { this.follow(item.id,this.isFollowed(item.id)) }}>  
                    <Text style={styles.buttonText}>UnFollow</Text> 
                   </TouchableOpacity>
                  </View> 

                  :

                   <View style={styles.followButton}>
                  <TouchableOpacity onPress={() => { this.follow(item.id,this.isFollowed(item.id)) }}>  
                    <Text style={styles.buttonText}>Follow</Text>
                    </TouchableOpacity>
                          
                  </View>
    
                  }
                          
                 
                  

                </View>
                
              </View>
            );
          }}
          
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  input: {
    height: 34,
    width: '80%',
    //backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    paddingLeft: 10,
    borderColor:"#0C7B93",
   backgroundColor: '#e5e5e5',



  },
  bookContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  image: {
    height: 100,
    width: 100,
     paddingTop: 10
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
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#0C7B93",
     padding:3,
     marginBottom:"3%"
     

  },
  pageTitleView:{
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: 'gray',
    padding:3
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
  unFollowButton: {
      margin:3,
     marginBottom:-0.08,

      width: 80,
      height: 25,
      backgroundColor: "grey",
      color: 'white',
      justifyContent: 'center',
      alignContent:"center",
      alignItems:"center",
      borderRadius: 50
    },
    followButton: {
      margin:3,
      marginBottom:-0.08,
 
       width: 80,
     height: 25,
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
    unFollowButton: {
        margin:3,
       marginBottom:-0.08,
  
        width: 80,
        height: 25,
        backgroundColor: "grey",
        color: 'white',
        justifyContent: 'center',
        alignContent:"center",
        alignItems:"center",
        borderRadius: 50
      },
      followButton: {
        margin:3,
        marginBottom:-0.08,
         width: 80,
        height: 25,
         backgroundColor: "#0C7B93",
         color: 'white',
         justifyContent: 'center',
         alignContent:"center",
         alignItems:"center",
         borderRadius: 50
      },
});