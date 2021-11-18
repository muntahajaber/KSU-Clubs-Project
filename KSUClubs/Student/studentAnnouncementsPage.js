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
  ScrollView
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

export default class test3 extends Component {

  constructor() {
    super();
    this.state = {
      query: null,
      dataSource: [],
      dataBackup: [],
      categories: [],
      ui: firebase.auth().currentUser.uid,
      firstTime: true,
      lastTime: false,

    };
  }


 componentDidMount() {
    firebase.database().ref(`/users/club/Announcements`).on('value', (snapshot) =>{
        var li = []
        snapshot.forEach((child)=>{
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
      console.log("dataBackup")
      console.log(this.state.dataBackup)
    } else {
      var data = this.state.dataBackup;
      query = query.toLowerCase();
      data = data.filter(l => l.title.toLowerCase().match(query));
     
        console.log("data source after search")
        console.log(data)
      this.setState({
        dataSource: data,
      }); 
    }  
  };

  separator = () => {
    return (
      <View style={{height: 10, width: '100%', backgroundColor: '#e5e5e5'}} />
    );
  }

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
    console.log("data source in the render")
    console.log(this.state.dataSource)
    return ( 
            <View style={styles.MainContainer}>

      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />
        <View style={styles.header}>
          <TextInput
            placeholder="Search..."  
            placeholderTextColor="gray"
            borderColor="gray"
            value={this.state.query} 
            onChange={this.filterItem.bind(this)}
            style={styles.input}
          />
        </View>
        <FlatList
          data={this.state.dataSource}  
          inverted
          ItemSeparatorComponent={() => this.separator()}
          renderItem={({item, index}) => {
            return (
              <View style={styles.bookContainer} onPress={() => this.props.navigation.navigate('ClubNavigator')}>
                <Image style={styles.image} 
                    source={{ uri: (item.image) }}
                   />
               
                <View style={styles.dataContainer}>
                  <Text numberOfLines={4} style={styles.title}  onPress={() =>{} }>
                    {item.name}  <Text style={styles.postDate}>{item.postDate}</Text>
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
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Calender',{StartDate:item.startDate,EndDate:item.endDate,title:item.title,text:item.text,id:item.id})}>
                  
                 <Text style={styles.buttonText}>Add to my calender</Text>
                </TouchableOpacity>

                  </View>
                 

                </View>
                
              </View>
            
            );
          }//end render item2
          }//end render item1
        /> 

            

      </View>

 


      </View>
         

         


    );//end return
  
 } // end render
}//end class

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
    height: 90,
    width: 90,
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

      width: 150,
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
    },
    scroll:{
       
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