import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { AsyncStorage } from "react-native"


var tform = require('tcomb-form-native');
var Forms = tform.form.Form;

const User = tform.struct({
    first_name: tform.String,
    last_name: tform.String,
    email: tform.String,
    phone_number: tform.Number,
    emergency_phone_number: tform.Number,
    health_care_number: tform.Number,
});

const options = {
    fields: {
        first_name: {
            error: 'This is required',
            autoCorrect: false,
            returnKeyType: 'done',
        },
        last_name: {
            error: 'This is required',
            autoCorrect: false,
            returnKeyType: 'done',
        },
        email: {
            error: 'This is required',
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'done',
        },
        phone_number: {
            error: 'This is required',
            returnKeyType: 'done',
        },
        emergency_phone_number: {
            error: 'This is required',returnKeyType: 'done',
        },
        health_care_number: {
            error: 'This is required',
            returnKeyType: 'done',
        },
    },
};

export default class CreateClient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            auth_token: '',
            loading: false,
            data: [],
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            url: "http://204.209.76.235/"
        };
    }

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        AsyncStorage.getItem('key')
            .then((e) => {
                this.setState({ auth_token: e, loading: true })
                console.log('TOKEEEENNNNN');
                console.log(this.state)
            });
    }

    fetchDataFromApi = () => {
        const url = this.state.url + "api/parent/";
        const user = this._form.getValue();
        if (user) {
            console.log('all user');
            this.setState({
                loading: true
            });
            const data = new FormData();
            data.append('profile.username', user.email);
            data.append('profile.password', "ualberta123");
            data.append('profile.first_name', user.first_name);
            data.append('profile.last_name', user.last_name);
            data.append('phone_number', user.phone_number);
            data.append("emergency_phone_number", user.emergency_phone_number);
            data.append("health_care_number", user.health_care_number);
            data.append("phone_number", user.phone_number);

            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + this.state.auth_token,
                },
                body: data
            }).then((response) => response.json()).then((responseJson) => {
                Alert.alert(
                    'Motus Professional',
                    'Client registration successful!',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.navigate('HomeScreen') },
                    ],
                    { cancelable: false }
                );
            }).catch((error) => {
                // Error in Form
                alert('Error in creating client.')
            })
        } else {
            console.log('ERRROS')
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.header}>Create Client </Text>
                    <Forms ref={c => this._form = c} type={User} options={options}/>
                    <Button buttonStyle={styles.button} onPress={this.fetchDataFromApi} title='Create'/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        flex: 1,
    },
    button: {
        backgroundColor: '#00aeef',
        borderRadius: 15,
        margin: 10,
    },
    header: {
        fontSize: 20,
        alignSelf: 'center',
        paddingBottom: 10,
    },
});

