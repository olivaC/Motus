import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Linking, TouchableOpacity} from 'react-native';
import { Button } from 'react-native-elements';
import OneSignal from "react-native-onesignal";
import { Icon } from "react-native-elements";

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
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'done',
        },
        password: {
            error: 'This is required',
            password: true,
            secureTextEntry: true,
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'done',
        },
    },
};

/**
 * The Login screen.
 */
export default class Login extends Component {
    static navigationOptions = {
        title: 'Motus Professional',
    };

    componentWillMount() {
        this.fetchData()
    }

    /**
     * Taken from https://medium.com/@richardzhanguw/storing-and-retrieving-objects-using-asyncstorage-in-react-native-6bb1745fdcdd
     * on November 4, 2018
     * @param key of the stored string
     * @returns {Promise<any>} The parsed JSON string of the key.
     */
    static async retrieveItem(key) {
        try {
            return await AsyncStorage.getItem(key)
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * Retrieves the email, auth_token and id from asynchronous storage.
     */
    fetchData() {
        Login.retrieveItem('email').then((email) => {
            this.setState({ email: email })
        });
        Login.retrieveItem('key').then((key) => {
            this.setState({ auth_token: key })
        });
        Login.retrieveItem('id').then((id) => {
            this.setState({ id: id })
        })
    }

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            auth_token: '',
            id: '',
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
                    alert('Email/Password not found.');
                    console.log(responseJson)
                } else {
                    this.setState({ auth_token: responseJson.key, loading: false });
                    tempAuth = responseJson.key;
                    AsyncStorage.setItem('key', this.state.auth_token).done();
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
                    OneSignal.sendTag("id", r.pk.toString());
                    AsyncStorage.setItem('id', r.pk.toString()).done();
                    AsyncStorage.setItem('email', r.username).done();
                    AsyncStorage.setItem('first_name', r.first_name).done();
                    AsyncStorage.setItem('last_name', r.last_name).done();
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
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Welcome to Motus </Text>
                <Form ref={c => this._form = c} type={User} options={options}/>
                <Button buttonStyle={styles.button} onPress={this.fetchDataFromApi} title="LOGIN"/>
                <Button buttonStyle={styles.button2} onPress={() => this.props.navigation.navigate('SignupScreen')}
                        title="SIGN UP"/>
                <TouchableOpacity
                    style={{position: "absolute", bottom: 0, right: 0, padding: 10}}
                    onPress={ ()=> Linking.openURL('http://204.209.76.235/help_professional/') }
                >
                    <Icon
                    name='question'
                    type='evilicon'
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        paddingTop: 50,
        paddingHorizontal: 30,
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        fontSize: 20,
        justifyContent: 'center',
        alignContent: 'center',
        paddingBottom: 10,
    },
    button: {
        backgroundColor: '#00aeef',
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 50,
    },
    button2: {
        backgroundColor: '#18914d',
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 50,
    },
});