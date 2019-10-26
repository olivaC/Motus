import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, Linking } from 'react-native';
import { AsyncStorage } from "react-native";
import styles from '../styles/mainStyles';
import { YellowBox } from 'react-native';
import OneSignal from "react-native-onesignal";
import { Icon } from "react-native-elements";

YellowBox.ignoreWarnings(['Require cycle:']);

const tform = require('tcomb-form-native');
const Form = tform.form.Form;

/**
 * The user object that is used to create a tcomb form.
 */
const User = tform.struct({
    email: tform.String,
    password: tform.String,

});

/**
 * Options for the User tcomb form.
 *
 * @type {{fields: {email: {error: string, autoCapitalize: string}, password: {error: string, password: boolean, secureTextEntry: boolean}}}}
 */
const options = {
    fields: {
        email: {
            error: 'This is required',
            autoCapitalize: "none",
        },
        password: {
            error: 'This is required',
            password: true,
            secureTextEntry: true
        },
    },
};

export default class Login extends Component {
    static navigationOptions = {
        title: 'Motus',
        headerLeft: null,
    };

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        AsyncStorage.getItem('email')
            .then((e) => {
                this.setState({ email: e, loading: true })
            });
        AsyncStorage.getItem('key')
            .then((e) => {
                this.setState({ auth_token: e, loading: true })
            });
        AsyncStorage.getItem('id')
            .then((e) => {
                this.setState({ id: e, loading: true })
            });
    }

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

    /**
     * Function to fetch an authentication token from the Motus API using Parent credentials.
     * The function will first check if all the fields are not empty, then will make the api call.
     * If there are any errors (Email and password not found), from the resulting response, then alert the user.
     *
     * If successful, store the authentication token using asyncstorage, do checks that it actually stored, and
     * then navigate to the home screen.
     */
    fetchDataFromApi = () => {
        const url = this.state.url + "rest-auth/login/";
        const url2 = this.state.url + "rest-auth/user/";
        const user = this._form.getValue();
        let tempAuth = '';
        console.log(user);
        if (user) {
            this.setState({
                loading: true
            });
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.email,
                    password: user.password,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.hasOwnProperty('non_field_errors')) {
                    alert('Email/Password not found.')
                    console.log(responseJson)
                } else {
                    this.setState({ auth_token: responseJson.key, loading: false });
                    tempAuth = responseJson.key;
                    AsyncStorage.setItem('key', this.state.auth_token);
                }
            }).catch((error) => {
                console.log(error)
            }).then(() => {
                fetch(url2, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + tempAuth,
                    },
                }).then((response) => response.json()).then((r) => {
                    console.log("send tags");
                    OneSignal.sendTag("id", r.pk.toString());
                    AsyncStorage.setItem('id', r.pk.toString());
                    AsyncStorage.setItem('email', r.username);
                    AsyncStorage.setItem('first_name', r.first_name);
                    AsyncStorage.setItem('last_name', r.last_name);
                    const token_check = AsyncStorage.getItem('key');
                    if (token_check !== null) {
                        this.props.navigation.navigate('HomeScreen');
                    } else {
                        alert('Authentication could not be completed.')
                    }
                }).catch((error) => {
                    console.log(error);
                });
            })
        }
    };

    render() {
        if (this.state.auth_token) {
            this.props.navigation.navigate('HomeScreen');
        }
        return (
            <View style={styles.container}>
                <View style={{alignContent: 'center', padding: 30}}>
                <Text style={styles.header}>Welcome to Motus </Text>
                <Form ref={c => this._form = c} type={User} options={options}/>
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.fetchDataFromApi}>
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{position: "absolute", bottom: 0, right: 0, padding: 10}}
                    onPress={ ()=> Linking.openURL('http://204.209.76.235/help_parent/') }
                >
                    <Icon
                    name='question'
                    type='evilicon'
                    />
                </TouchableOpacity>
            </View>
        );
    }
}