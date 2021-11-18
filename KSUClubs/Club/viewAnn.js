/* only test class */
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

export default class viewAnn extends Component {

  constructor() {
    super();
    this.state = {
      query: null,
      dataSource: [],
      dataBackup: [],
      categories: [],
      ui: firebase.auth().currentUser.uid,
      time: Date.now(),
      firstTime: true,
      lastTime: false,

    };
  }

  s = (key, keyList) => {
    var notnew = true;
    console.log(keyList)
    for (var i = 0 ; i<keyList.length ; i++){
       if(keyList[i]!=key){
        notnew = false
       }
    }

        return notnew
  }

 componentDidMount() {
    var li = []
    var keyList = []
    firebase.database().ref(`/users/club/`).on('value', (snapshot) =>{
        snapshot.forEach((child)=>{
       if (child.val().Announcements !== undefined){
        let Keys = Object.keys(child.val().Announcements);
        
       for (var i = 0 ; i<Keys.length ;i++) {
        if (this.state.firstTime) {
            li.push({ 
                title: child.val().Announcements[Keys[i]].title,
                text: child.val().Announcements[Keys[i]].text,
                startDate:child.val().Announcements[Keys[i]].startDate,
                endDate: child.val().Announcements[Keys[i]].endDate,
                

                id: child.key, 
                name:child.val().name,
                image:child.val().image, 

            
        })    
        keyList.push(Keys[i]) 
    } 
    else if (this.state.lastTime && i === Keys.length-1 &&  this.s(Keys[i],keyList)){
        console.log("inside not fisrt time")
        li.push({ 
            title: child.val().Announcements[Keys[i]].title,
            text: child.val().Announcements[Keys[i]].text, 
            startDate:child.val().Announcements[Keys[i]].startDate,
            endDate: child.val().Announcements[Keys[i]].endDate,
            key:Keys[i], 
 
            id: child.key,  
            name:child.val().name,
            image:child.val().image, 

         
    })   
    keyList.push(Keys[i])   
  }
   
}
        this.setState({firstTime:false})
        this.setState({lastTime:true})
       }// end if  
 }) // end for each child
      
    })  
   // this.interval = setInterval(() => this.setState({ time: Date.now() }), 10000);
    this.setState({categories:li, dataBackup: li,dataSource: li})
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
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />
        <View style={styles.header}>
        <Text>{ this.state.time }</Text>
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
          ItemSeparatorComponent={() => this.separator()}
          renderItem={({item, index}) => {
            return (
              <View style={styles.bookContainer} onPress={() => this.props.navigation.navigate('ClubNavigator')}>
                <Image style={styles.image} 
                    source={{ uri: (item.image) }}
                   />
               
                <View style={styles.dataContainer}>
                  <Text numberOfLines={4} style={styles.title}  onPress={() => this.props.navigation.navigate('clubHomePage',{uid:item.id,name:item.name,email:item.email,image:item.image})}>
                    {item.name}
                  </Text>

                  <Text numberOfLines={5} style={styles.annTitle}>
                    {item.title}
                  </Text>

                  <Text numberOfLines={5} style={styles.description}>
                    {item.text}
                  </Text>
            
                   <View style={styles.button}>
                  <TouchableOpacity onPress={() => Alert.alert("Start Date: "+item.startDate +"     End Date: "+item.endDate)}>
                  
                 <Text style={styles.buttonText}>Add it to my calender</Text>
                </TouchableOpacity>

                  </View>
                 

                </View>
                
              </View>
            
            );
          }//end render item2
          }//end render item1
        /> 
      </View> //end of big view
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
     padding:3

  },
  description: {
    fontSize: 16,
    color: 'gray',
    padding:3,
    left: "5%"
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
        color: 'black',
        padding:3,
        left:"5%"
    }
});