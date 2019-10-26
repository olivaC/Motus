import React, { Component } from 'react';
import { View, Text, ScrollView, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

/**
 * This class is the Mental health professionals profile page.
 */
export default class Profile extends Component {
    static navigationOptions = {
        title: 'Profile',
    };

    async componentDidMount(): Promise<void> {
        const url = this.state.url + "api/professional/";
        let value = '';

        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res });
        });

        // console.log(value);

        let r1 = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let prof = await r1.json();
        // console.log(prof);
        let p = prof[0];
        let p2 = prof[0].profile;
        this.setState({
            email: p2.username,
            data: p,
            first_name: p2.first_name,
            last_name: p2.last_name,
            id: p.id,
        });

        await AsyncStorage.setItem('first_name', p2.first_name).done();
        await AsyncStorage.setItem('last_name', p2.last_name).done();

    }

    clearAsyncStorage = async () => {
        AsyncStorage.clear();
        this.props.navigation.navigate('LoginScreen')
    };


    constructor(props) {
        super(props);

        this.state = {
            email: '',
            auth_token: '',
            id: '',
            first_name: '',
            last_name: '',
            loading: false,
            data: '',
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            url: "http://204.209.76.235/"
        };
    }

    render() {
        console.log(this.state.data);
        return (
            <View style={styles.container}>
                <ScrollView style={{ flex: 1, padding: 20 }}>
                    <View style={styles.content}>
                        <Image style={styles.imageContainer} source={{ uri: this.state.url + "professional_photo/" + this.state.id + "/" }}/>
                        <Text style={styles.header}>{this.state.first_name} {this.state.last_name}</Text>
                        <Text style={{ fontSize: 12, color: '#606060' }}>Email</Text>
                        <Text>{this.state.email} </Text>
                        <Text style={styles.infoHeader}>Phone Number</Text>
                        <Text>{this.state.data.phone_number} </Text>
                        <Text style={styles.infoHeader}>Therapy Style</Text>
                        <Text>{this.state.data.therapy_style1}</Text>
                        <Text>{this.state.data.therapy_style2}</Text>
                    </View>

                    <View style={styles.content}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('EditProfileScreen', {
                                profile: this.state.data,
                                key: this.state.auth_token
                            })}>
                            <Text>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.clearAsyncStorage}>
                            <Text>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}



