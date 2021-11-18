import React from "react";
import { View, Text, TouchableOpacity,Image } from "react-native";

export default class ListCard extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          paddingHorizontal: 32,
          alignSelf: "center",
          marginTop: 20,
          backgroundColor: "#FFF",
          height: 250,
          elevation: 1,
          width: 300,
          borderRadius: 20
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingTop: 30,
            alignSelf: "center"
          }}
        >
          <Text
            style={{
              //fontFamily: "RobotoBold",
              color: "#4b3ca7",
              fontSize: 15
            }}
          >
            بالإرشاد يمضي المرءٌ نحو هدفه, و بالتوجيه يتحقق الوصول :)
            تقدم الان و كن أحد الطلبة المنتفعين من مبادرة 
            #KSU_Mentorship
            #برنامج_الشراكة_الطلابية
          </Text>

        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 4,
            alignItems: "center"
          }}
        >
          <Text
            style={{
              //fontFamily: "RobotoRegular",
              color: "#a2a2db",
              fontSize: 11
            }}
          >
            https:membership_SPP_KSU/rigestration/1235....
          </Text>
          
        </View>

        <View
            style={{
              width: 80,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
            }}
          >

          <Image
          source={{
          uri: 'https://pbs.twimg.com/media/EjqNWyfXcAE7IJ6?format=jpg&name=large',
        }}
              style={{width: 200, height: 40}}
            />
            
          </View>

      
      </TouchableOpacity>
    );
  }
}