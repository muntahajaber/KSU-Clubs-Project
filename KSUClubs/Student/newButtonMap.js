import React, { Component } from 'react';
import { View, StyleSheet, LinearGradient, TouchableOpacity, Image, Text, Platform, Linking } from 'react-native';
import Constants from 'expo-constants'; // NEW WAY
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Button } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import openMap from 'react-native-open-maps';
import { createOpenLink } from 'react-native-open-maps';
import {
    Icon, Card, CardItem, Title, Left, Right, Body, Container
} from "native-base";

export default class newButtonMap extends Component {


    constructor() {
        super();
        this.state = {
            mapRegion: {
                latitude: 24.7224,
                longitude: 46.6271,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }



    _handleMapRegionChange = mapRegion => {
        this.setState({ mapRegion });
    };

    openMap(lat, lon) {
        console.log('open directions')
        let f = Platform.select({
            ios: () => {
                Linking.openURL(`http://maps.google.com/maps?daddr=${lat},${lon}`);
            },
            android: () => {
                console.log('ANDROID')
                Linking.openURL('http://maps.google.com/maps?daddr=38.7875851,-9.3906089').catch(err => console.error('An error occurred', err));
            }
        });

        f();
    }

    render() {
        const { navigation } = this.props;
        const user_id = navigation.getParam('uid');
        const user_name = navigation.getParam('name');
        const user_bio = navigation.getParam('bio');
        const user_image = navigation.getParam('image');
        const user_back = navigation.getParam('back');
        const user_lat = navigation.getParam('lat');
        const user_lon = navigation.getParam('lon');
        const club_locDes = navigation.getParam('des');

        if (user_lat != 1 && user_lon != 1) {
            return (

                <View style={styles.container}>



                    <MapView
                        style={{ alignSelf: 'stretch', height: '100%', flex: 1 }}

                        region={this.state.mapRegion}
                        onRegionChange={this._handleMapRegionChange}>
                        <MapView.Marker
                            title={user_name}
                            description={club_locDes}
                            anchor={[0, 0]}
                            coordinate={{
                                latitude: user_lat,
                                longitude: user_lon,
                            }}
                        />
                    </MapView>

                    <TouchableOpacity activeOpacity={0.5} onPress={() => this.openMap(user_lat, user_lon)} style={styles.TouchableOpacityStyle}><Text style={styles.Text}>click here to get the direction of {user_name}</Text>
                    </TouchableOpacity>



                </View>
            );
        } else {
            return (
                <View style={styles.container1}>
                    <Image source={require('./placeholder.png')} style={styles.logo} />
                    <Text style={styles.text1}> Whoops! </Text>
                    <Text style={styles.text2}> No location yet </Text>



                </View>
            );
        }


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container1: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,

    },
    button: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: "center",
        justifyContent: "space-between",
        borderWidth: 0.8,
        color: 'red',
        size: 20,
        width: 75,
        height: 75,
        borderRadius: 85 / 2,
        backgroundColor: 'rgba(252, 253, 253, 0.9)',
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: 8,
        shadowOpacity: 0.12,
        opacity: .6,
        zIndex: 10,
    },
    TouchableOpacityStyle: {

        position: 'absolute',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 30,
        Top: 300,
        flexDirection: 'row',
        alignSelf: "center",
        paddingBottom: 40,
        width: 'auto',
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 12,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 12,


    },

    Text: {
        backgroundColor: 'rgba(255,255,255,0.7)',

        size: 23,
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: "center",
        justifyContent: "center",
        borderWidth: 0.9,
        height: 40,
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,


        alignItems: 'center',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#00',
        shadowOpacity: 1,
        elevation: 30,

        width: 'auto',
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 12,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    text1: {
        color: '#7f7f7f',
        fontSize: 50,
        justifyContent: 'center',
        alignItems: 'center',

    },
    text2: {
        color: '#7f7f7f',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCallout: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        borderWidth: 0.5,
        borderRadius: 20
    },
});
