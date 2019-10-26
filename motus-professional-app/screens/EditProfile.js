import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, AsyncStorage, Alert, StatusBar } from 'react-native';
import ImageFactory from 'react-native-image-picker-form'

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
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'done',
        },
        therapy_style: {
            error: 'This is required'
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
 * The user object that is used to create a tcomb form.
 */
const User = tform.struct({
    first_name: tform.String,
    last_name: tform.String,
    email: tform.String,
    phone_number: tform.Number,
    therapy_style: Style,
    additional_therapy_style: tform.maybe(Style),
    profile_picture: tform.String,
});

export default class EditProfile extends Component {
    static navigationOptions = {
        title: 'Edit Profile',
    };

    /**
     * Send an api put request to edit a mental health care professional's profile.
     */
    editData = () => {
        StatusBar.setNetworkActivityIndicatorVisible(true);
        const profile = this.props.navigation.getParam('profile');
        const key = this.props.navigation.getParam('key');
        const url = this.state.url + "api/professional/" + profile.id + "/";
        const user = this._form.getValue();
        if (user) {
            this.setState({
                loading: true
            });
            const cleanPicture = user.profile_picture.replace("file://", "");
            const data = new FormData();
            data.append('profile.username', user.email);
            data.append('profile.first_name', user.first_name);
            data.append('profile.last_name', user.last_name);
            data.append('profile.password', "ualberta123");
            data.append('phone_number', user.phone_number);
            data.append('therapy_style1', user.therapy_style);
            if (user.additional_therapy_style) {
                data.append('therapy_style2', user.additional_therapy_style)
            }
            data.append('picture_img', { uri: cleanPicture, name: 'profile_picture.jpg', type: 'image/jpg' });

            fetch(url, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data;',
                    'Authorization': 'Token ' + key,
                },
                body: data
            }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson);
                AsyncStorage.setItem('email', user.email).done();
                AsyncStorage.setItem('first_name', user.first_name).done();
                AsyncStorage.setItem('last_name', user.last_name).done();
                AsyncStorage.setItem('data', JSON.stringify(responseJson)).done();
                AsyncStorage.setItem('professional', JSON.stringify(responseJson)).done();
                StatusBar.setNetworkActivityIndicatorVisible(false);
                Alert.alert(
                    'Motus Professional',
                    'Profile Edit Successful!',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.navigate('HomeScreen') },
                    ],
                    { cancelable: false }
                );
            }).catch((error) => {
                // Error in Form
                console.log(error);
                alert('Error in editing. Changes not saved.')
            })
        } else {
            console.log('ERRROS')
        }
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
        const profile = this.props.navigation.getParam('profile');
        console.log(profile);
        const key = this.props.navigation.getParam('key');
        console.log("keyyyy: " + key);
        console.log(profile.therapy_style1);
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ paddingHorizontal: 20 }}>
                        <Text style={styles.header}>Edit Profile</Text>
                        <Forms ref={c => this._form = c} type={User} options={options} value={
                            {
                                first_name: profile.profile.first_name,
                                last_name: profile.profile.last_name,
                                email: profile.profile.username,
                                phone_number: profile.phone_number,
                                therapy_style: profile.therapy_style1,
                                additional_therapy_style: profile.therapy_style2,
                            }
                        }/>
                        <Button onPress={this.editData} title='Submit'/>
                    </ScrollView>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        fontSize: 20,
        alignSelf: 'center',
        padding: 10,
    },
    button: {
        backgroundColor: '#00aeef',
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 50,
    },
});