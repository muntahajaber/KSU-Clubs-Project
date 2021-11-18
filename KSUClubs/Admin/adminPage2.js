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

export default class adminPage2 extends Component {
  constructor() {
    super();
    this.state = {
      query: null,
      dataSource: [],
      dataBackup: [],
      categories: []
    };
  }

  componentDidMount() {
    firebase.database().ref(`/users/club`).on('value', (snapshot) =>{
        var li = []
        snapshot.forEach((child)=>{
          if(child.key !=="Announcements"){
         li.push({
          id: child.key,
          name:child.val().name,
          email: child.val().email,
          image:child.val().image
        })
      }
      })
     this.setState({categories:li, dataBackup: li,dataSource: li})
    })
  
  }


  filterItem = event => {
    var query = event.nativeEvent.text;
    this.setState({
      query: query,
    });
    if (query == '') {
      this.setState({
        dataSource: this.state.dataBackup,
      });
    } else {
      var data = this.state.dataBackup;
      query = query.toLowerCase();
      data = data.filter(l => l.name.toLowerCase().match(query));

      this.setState({
        dataSource: data,
      });
    }
  };

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
            <View style={styles.square}>
          </View>
             <View style={styles.circle} >
                    <Image style={styles.image2} source={require('../images/logo.png')} resizeMode="contain"/>
            </View> 

            <Text style={styles.title2}>Clubs Management</Text>
    
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
                  <Text numberOfLines={4} style={styles.title}  onPress={() => this.props.navigation.navigate('ClubNavigator')} >
                    {item.name}
                   
                  </Text>
                  <Text numberOfLines={5} style={styles.description}>
                    {item.email}
                    
                  </Text>
                   <View style={styles.button}>
                  <TouchableOpacity onPress = {() => { 
             Alert.alert(
              "Alert",
              `Are you sure you want to delete ${item.name}?`,
            [
            {
              text: "Yes",
              onPress: () =>  {
                firebase.database().ref(`/users/club/${item.id}`).remove()
                console.log("Yes Pressed")
                },
            },
            { text: "No", onPress: () => console.log("No Pressed") }
            ],
            { cancelable: false }
          );

            console.log("club removed")
          }}>
                                   <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                  </View>
                 

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
    //backgroundColor:"black"
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
     padding:3

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
      borderRadius: 50

  
    },
    buttonText: {
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
  
  
    },
    ///////////////////////////
    text2: {
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
  
  
      button2: {
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
        image2: {
          alignSelf:"center", 
          aspectRatio: 1,
          height: undefined, 
          width:undefined,
          top:"10%",
          flex:0.80
        },
        title2: {
            fontSize: 20,
            fontWeight:"bold",
            color: "#0C7B93",
            justifyContent: 'center',
            alignContent:"center",
            alignItems:"center",
            top: -55,
            left: "26%"
    
          },
    ///////////////////////////
});