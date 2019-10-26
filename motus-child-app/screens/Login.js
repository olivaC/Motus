import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Linking } from 'react-native';
import { AsyncStorage } from "react-native";
import styles from '../styles/styles';
import { YellowBox } from 'react-native';
import { Icon } from "react-native-elements";
YellowBox.ignoreWarnings(['Require cycle:']);

var tform = require('tcomb-form-native');
var Form = tform.form.Form;

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

/**
 * The default component class that consists of logging in a child to the Motus application.
 */
export default class Login extends Component {
    static navigationOptions = {
        title: 'Motus',
        headerLeft: null,
    };

    componentWillMount() {
        console.log("SSS");
        this.fetchData()
    }

    fetchData() {
        console.log("THRUDD");
        AsyncStorage.getItem('key')
            .then((e) => {
                this.setState({ auth_token: e, loading: true })
            });
    }

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

    /**
     * Function to fetch an authentication token from the Motus API using Parent credentials.
     * The function will first check if all the fields are not empty, then will make the api call.
     * If there are any errors (Email and password not found), from the resulting response, then alert the user.
     *
     * If successful, store the authentication token using asyncstorage, do checks that it actually stored, and
     * then navigate to the home screen.
     */
    fetchDataFromApi = () => {
        console.log("FIRST");
        const url = this.state.url + "rest-auth/login/";
        const user = this._form.getValue();
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
                } else {
                    console.log(responseJson);
                    console.log(responseJson.key);
                    this.setState({ auth_token: responseJson.key, loading: false });
                    AsyncStorage.setItem('key', this.state.auth_token);
                    const token_check = AsyncStorage.getItem('key');
                    if (token_check !== null) {
                        this.props.navigation.navigate('ChooseChildScreen', {key: responseJson.key});
                    } else {
                        alert('Authentication could not be completed.')
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    };

    render() {
        if(this.state.first_name){
            return this.props.navigation.navigate('HomeScreen');
        }
        return (
            <View style={styles.home_container}>
                <Text style={styles.header}>Welcome to Motus </Text>
                <Form ref={c => this._form = c} type={User} options={options}/>
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.fetchDataFromApi}
                >
                    <Text style={styles.buttonText}> Log in </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{position: "absolute", bottom: 0, right: 0, padding: 10}}
                    onPress={ ()=> Linking.openURL('http://204.209.76.235/help_child/') }
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