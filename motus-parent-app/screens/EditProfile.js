import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { View, Text, Button, ScrollView, AsyncStorage, Alert, TouchableOpacity } from 'react-native';
import ImageFactory from 'react-native-image-picker-form';
import styles from '../styles/mainStyles';


const tform = require('tcomb-form-native');
const Forms = tform.form.Form;

const options = {
    fields: {
        first_name: {
            error: 'This is required'
        },
        last_name: {
            error: 'This is required'
        },
        email: {
            error: 'This is required',
            autoCapitalize: "none",
        },
        phone_number: {
            error: 'This is required',
        },
        emergency_phone_number: {
            error: 'This is required'
        },
        health_care_number: {
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
    phone_number: tform.String,
    emergency_phone_number: tform.String,
    health_care_number: tform.Number,
    profile_picture: tform.String,

});

export default class EditProfile extends Component {
    static navigationOptions = {
        title: 'Edit Profile',
    };

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        AsyncStorage.getItem('key')
            .then((e) => {
                this.setState({ auth_token: e, loading: true })
            });
    }

    editData = () => {
        console.log("KEYYYYYYYYYYY" + this.state.key);
        const parent = this.props.navigation.getParam('parent');
        const key = this.props.navigation.getParam('key');
        const url = this.state.url + "api/parent/" + parent.id + "/";
        const user = this._form.getValue();
        if (user) {
            this.setState({
                loading: true
            });
            const cleanPicture = user.profile_picture.replace("file://", "");
            const data = new FormData();
            data.append('profile.username', user.email);
            data.append('profile.password', "ualberta123");
            data.append('profile.first_name', user.first_name);
            data.append('profile.last_name', user.last_name);
            data.append('phone_number', user.phone_number);
            data.append("emergency_phone_number", user.emergency_phone_number);
            data.append("health_care_number", user.health_care_number);
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
                AsyncStorage.setItem('email', user.email);
                AsyncStorage.setItem('first_name', user.first_name);
                AsyncStorage.setItem('last_name', user.last_name);
                Alert.alert(
                    'Motus Parent',
                    'Profile Edit Successful!',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.navigate('ProfileScreen') },
                    ],
                    { cancelable: false }
                );
            }).catch((error) => {
                // Error in Form
                console.log(error);
                alert('Error in creating client.')
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
        const parent = this.props.navigation.getParam('parent');
        console.log(parent);
        const key = this.props.navigation.getParam('key');
        console.log("keyyyy: " + key);
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ paddingHorizontal: 20 }}>
                        <Forms ref={c => this._form = c} type={User} options={options} value={
                            {
                                first_name: parent.profile.first_name,
                                last_name: parent.profile.last_name,
                                email: parent.profile.username,
                                phone_number: parent.phone_number,
                                emergency_phone_number: parent.emergency_phone_number,
                                health_care_number: parent.health_care_number,
                                profile_picture: parent.picture,
                            }
                        }/>
                        <TouchableOpacity onPress={this.editData}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        )
    }
}