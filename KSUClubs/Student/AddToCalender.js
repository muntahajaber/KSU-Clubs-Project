import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity,Flatlist,Image} from 'react-native';
import {Agenda,Calendar} from 'react-native-calendars';
import firebase from '../src/firebase/config';
import Icon from 'react-native-vector-icons/Ionicons';

const testIDs = require('./testIDs');
const Jsondata = JSON.stringify( {
    '2020-10-25': [{name: 'Eid'}],
    '2020-10-20': [{name: 'Eid milaudin', height: 80}],
    '2020-10-19': [],
    '2020-10-21': [{name: 'Mohram'}, {name: 'any js object'}]
  })

export default class AddToCalender extends Component {
  constructor(props) {
    super(props);

    this.state = {
     
       items:{},items1:'',isLoading:true,
     
      'uid': firebase.auth().currentUser.uid,
      alldata:[],
      flag:"false",
      idevent:"",
      textevent:"",
      titleevent:"",
      startDateevent:"",
      endDateevent:"",
     dataSource: []
    };
  }

  componentDidMount(){
     const { navigation } = this.props;  
    const ann_title= navigation.getParam('title');
    this.createTwoButtonAlert(ann_title)
     firebase.database().ref(`/users/student/${this.state.uid}/event`).on('value', (snapshot) =>{
          var li = new Array() ;
           
               var list=[];
            snapshot.forEach((child)=>{
              var date1 = child.val().startDate;
              //alert(date1)
              var c ="2020-10-26"
           //  setTimeout(()=>{
               li={ "2020-10-26": [{title: child.val().title, id: child.key ,startDate:child.val().startDate ,text: child.val().text} ],
                         }


             // },1000)

             list.push({ 
              title: child.val().title,
              text: child.val().text,
               startDate:child.val().startDate,
               endDate: child.val().endDate,
               id: child.key
         })


            })
            //setTimeout(()=>{
                        this.setState({items1:li,isLoading:false , alldata:list})

            // },2500)
                // this.setState({items:jd,dataSource:li })
     
  
  })
  }

   Post=(id,title,text,startDate,endDate) => {
    
    if (id === ''){
        Alert.alert("id null")
    }else if(id !== '' && startDate!=='' && endDate!=='' && startDate !== undefined && endDate !== undefined ) {
    firebase.database().ref(`/users/student/${this.state.uid}/event`)
    .push({"endDate":endDate,"id":id,"startDate":startDate,"text":text,"title":title});
   

     Alert.alert("event added successfully")

    this.setState({
     idevent:id,
      textevent:text,
      titleevent:title,
      startDateevent:startDate,
      endDateevent:endDate,
      flag:"true",
    });

  }else if(startDate =='' ||  endDate==='' || startDate == undefined || endDate == undefined  ){
    Alert.alert("sorry :( can't add this event to calendar")

  }
  
}


  createTwoButtonAlert(v){
     Alert.alert(
          'Hello',
            `Do you want to add the ${v} event to your calender ?`,

          [
            {text: 'No', onPress: () => console.log('Cancel Pressed!')},
            {text: 'Yes', onPress: this.addToDatabase},
          ],
          { cancelable: false }
        )

  }


 addToDatabase = () => {
    const { navigation } = this.props;  
    const ann_id= navigation.getParam('id'); 
    const ann_title= navigation.getParam('title'); 
    const ann_text= navigation.getParam('text'); 
    const ann_startDate= navigation.getParam('StartDate'); 
    const ann_endDate= navigation.getParam('EndDate'); 
   
    
    this.Post(ann_id,ann_title,ann_text,ann_startDate,ann_endDate)
    }



 deletEvent(){

    <TouchableOpacity style={styles.button}	onPress = {() => { 
             Alert.alert(
              "Alert",
              `Are you sure you want to delete ${this.item.title}?`,
            [
            {
              text: "Yes",
              onPress: () =>  {
                firebase.database().ref(`/users/student/${this.state.uid}/event/${this.item.key}`).remove()
                console.log("Yes Pressed")
                },
            },
            { text: "No", onPress: () => console.log("No Pressed") }
            ],
            { cancelable: false }
          );

            console.log("event removed")
          }
          
          }><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>


  }
  
     render() {
       if(this.state.isLoading){
         return(
           <Text>Loading</Text>
         )
       }
       else{
    return (
       <View style={styles.MainContainer}>
        <Icon name="ios-arrow-back"  size='30%' color="#0c7b93"
       style={{
            marginTop: 10,
            marginLeft:10,
            //backgroundColor: "#fffff",
            
          }}
                 onPress={() => this.props.navigation.goBack()}
               >
               </Icon>

      <Agenda
        testID={testIDs.agenda.CONTAINER}
        items={
          this.state.items1
        }
        loadItemsForMonth={this.loadItems.bind(this)}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
       
       
      />

      </View>
    );
       }
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i =1; i <10; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <View  style={styles.MainContainer}>
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height: item.height}]} 
        
        onPress={() => Alert.alert(item.text)}
      >
        <Text>{item.title}</Text>
           
  
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.5} 
      onPress = {() => { 
             Alert.alert(
              "Ops!",
              `Are you sure you want to delete ${item.title}?`,
            [
            {
              text: "Yes",
              onPress: () =>  {
                firebase.database().ref(`/users/student/${this.state.uid}/event/${item.id}`).remove()
                console.log("Yes Pressed")
                },
            },
            { text: "No", onPress: () => console.log("No Pressed") }
            ],
            { cancelable: false }
          );

            console.log("event removed")
          }}
          
           style={styles.TouchableOpacityStyle} >

          <Image source={{uri : 'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-3/3/13-512.png'}} 
          
                 style={styles.FloatingButtonStyle} />
       
        </TouchableOpacity>


       </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  },
  TouchableOpacityStyle:{

    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 5,
    //Top:300
  },
   MainContainer: {
    flex: 1,
   // justifyContent: 'center',
   //alignItems: 'center',
   // backgroundColor : '#F5F5F5'
  },

  FloatingButtonStyle: {

    resizeMode: 'contain',
    width: 50,
    height: 50,
  }
});