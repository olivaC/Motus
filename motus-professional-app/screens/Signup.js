/* Forms.js */

import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import ImageFactory from 'react-native-image-picker-form';
import Modal from 'react-native-modal';

const tform = require('tcomb-form-native');
const Forms = tform.form.Form;

const Style = tform.enums({
    'Cognitive Behavioural Therapy': 'Cognitive Behavioural Therapy',
    'Emotion-focused Therapy': 'Emotion-focused Therapy',
    'Integrative Therapy': 'Integrative Therapy',
    'Interpersonal Therapy': 'Interpersonal Therapy',
    'Mindfulness-based Therapy': 'Mindfulness-based Therapy',
    'Play Therapy': 'Play Therapy',
    'Psychodynamic Therapy': 'Psychodynamic Therapy',
});

const User = tform.struct({
    first_name: tform.String,
    last_name: tform.String,
    email: tform.String,
    password: tform.String,
    confirm_password: tform.String,
    phone_number: tform.Number,
    therapy_style: Style,
    additional_therapy_style: tform.maybe(Style),
    profile_picture: tform.String,
    terms: tform.Boolean
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
        password: {
            error: 'This is required',
            password: true,
            secureTextEntry: true, autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'done',
        },
        confirm_password: {
            password: true,
            secureTextEntry: true,
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'next',
        },
        phone_number: {
            error: 'This is required',
            returnKeyType: 'done',
        },
        therapy_style: {
            error: 'This is required'
        },
        terms: {
            label: 'Agree to Terms',
        },
        profile_picture: {
            config: {
                title: 'Select profile picture',
                options: ['Camera', 'Select from gallery', 'Cancel'],
                // Used on Android to style BottomSheet
            },
            error: 'No image provided',
            factory: ImageFactory
        },
    },
};

/**
 * The sign up screen for registering a new Mental health care professional.
 *
 * **/
export default class Signup extends Component {
    static navigationOptions = {
        title: 'Register',
    };

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
            isModalVisible: false,
            url: "http://204.209.76.235/"
        };
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    componentWillMount() {
        this.fetchData()
    }

    /**
     * Fetches the privacy, terms and conditions from the motus web api.
     */
    fetchData() {
        const url = this.state.url + "api/privacy/";
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((r) => {
            console.log(r);
            this.setState({ data: r[0], loading: true });
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * Creates a new professional by posting to the Motus web api.
     */
    createNewProfessional = () => {
        const url = this.state.url + "api/professional/";
        const user = this._form.getValue();
        if (user) {
            console.log('all user');
            if (user.password !== user.confirm_password) {
                alert("Passwords do not match")
            } else if (user.password.length < 8) {
                alert("Password must be over 8 characters.")
            } else if (user.password.includes(user.email)) {
                alert("Password is too similar to the email.")
            } else {
                this.setState({
                    loading: true
                });
                const cleanPicture = user.profile_picture.replace("file://", "");
                const data = new FormData();
                console.log(cleanPicture);
                data.append('picture_img', { uri: cleanPicture, name: 'profile_picture.jpg', type: 'image/jpg' });
                data.append('profile.username', user.email);
                data.append('profile.password', user.password);
                data.append('profile.first_name', user.first_name);
                data.append('profile.last_name', user.last_name);
                data.append('therapy_style1', user.therapy_style);
                data.append('phone_number', user.phone_number);
                fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data;'
                    },
                    body: data
                }).then((response) => response.json()).then((responseJson) => {
                    console.log(responseJson);
                    Alert.alert(
                        'Motus Professional',
                        'Registration successful!',
                        [
                            { text: 'OK', onPress: () => this.props.navigation.navigate('LoginScreen') },
                        ],
                        { cancelable: false }
                    );
                }).catch((error) => {
                    console.log(error);
                    alert('Error in creating account.')
                })
            }
        } else {
            console.log('ERRROS')
        }
    };


    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Forms ref={c => this._form = c} type={User} options={options}/>
                    <TouchableOpacity onPress={this._toggleModal}>
                        <Text>Terms and Conditions</Text>
                    </TouchableOpacity>
                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={styles.modalContainer}>
                            <ScrollView>
                                <Text style={styles.header}>Privacy</Text>
                                <Text>{this.state.data.privacy}</Text>
                                <Text style={styles.header2}>Terms and Conditions</Text>
                                <Text>{this.state.data.terms}</Text>
                                <Button buttonStyle={styles.button} onPress={this._toggleModal} title={"Close"}/>
                            </ScrollView>
                        </View>
                    </Modal>
                    <Button buttonStyle={styles.button} onPress={this.createNewProfessional} title={"SIGN UP"}/>
                </ScrollView>
            </View>
        );
    }
}

const
    styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#ffffff',
        },
        header: {
            fontSize: 20,
            alignSelf: 'center',
            paddingBottom: 10,
        },
        header2: {
            fontSize: 20,
            alignSelf: 'center',
            paddingBottom: 10,
            paddingTop: 10,
        },
        button: {
            backgroundColor: '#18914d',
            borderRadius: 15,
            margin: 10,
        },
        modalContainer: {
            flex: 1,
            padding: 10,
            backgroundColor: '#ffffff',
            borderRadius: 15,
        },
    });

