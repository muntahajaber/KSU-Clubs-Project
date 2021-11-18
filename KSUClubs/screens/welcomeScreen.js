import React from "react";
import { Text, StyleSheet,View, Button ,TouchableOpacity,Image,ImageBackground} from "react-native";

const welcomeScreen = (prop) => {
  
  return <View style={styles.background}>
     <ImageBackground source={require('../images/Screen Shot 1442-01-29 at 2.23.03 AM.png')} style={styles.background} resizeMode="stretch"> 
        <View style={styles.container}>
             <Image source={require('../images/logo.png')}  style={styles.logo} />
             
    
             <TouchableOpacity style={styles.button}
			                onPress = {() => prop.navigation.navigate("Login")}>
			                <Text style={styles.buttonText}>Log in</Text>
		         </TouchableOpacity>
                    
                    
             <TouchableOpacity style={styles.button}
			                onPress = {() => prop.navigation.navigate("register")}>
			                <Text style={styles.buttonText}>Register</Text>
		         </TouchableOpacity>
        </View>
       </ImageBackground>                 
      
  </View>
};

const styles = StyleSheet.create({
  background:{
    flex: 1,
      width: null,
      height: null,
  },
  container: {
    margin:70,
    alignItems: 'center',
    //backgroundColor: 'blue',
    
  },
  button: {
    width: 200,
    height: 40,
    backgroundColor: "#0C7B93",
    margin: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignContent:"center",
    alignItems:"center",


  },
  logo:{
    width:'80%',
    height:'50%',
    marginBottom:'20%'
  },
  buttonText:{
    color:'white',
    textAlign: 'center',
    alignItems: 'center',
    //margin:'10%',
    //backgroundColor:'blue',
    fontSize:17,
    fontStyle:'normal',
    fontWeight: "bold"

  },
  image: {
    
    
    width: '100%',
    height: '100%'
  }

});

export default welcomeScreen;