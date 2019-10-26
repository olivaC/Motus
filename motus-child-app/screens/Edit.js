import React, { Component } from 'react';
import { Text, View, Image, Alert, TouchableOpacity, ScrollView, RefreshControl, } from 'react-native';
import styles from '../styles/styles';
import { AsyncStorage } from "react-native";
import ImageFactory from 'react-native-image-picker-form';


const tform = require('tcomb-form-native');
const Forms = tform.form.Form;

const User = tform.struct({
    profile_picture: tform.String,
});

const options = {
    auto: 'none',
    fields: {
        profile_picture: {
            config: {
                title: 'Change profile picture',
                options: ['Camera', 'Select from gallery', 'Cancel'],
                // Used on Android to style BottomSheet
            },
            error: 'No image provided',
            factory: ImageFactory
        },
    },
};


export default class Edit extends Component {
    static navigationOptions = {
        title: 'Edit',
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            auth_token: '',
            loading: true,
            data: '',
            id: '',
            value: '',
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            url: "http://204.209.76.235/"
        };
    }

    editData = () => {
        const child = this.props.navigation.getParam('profile');
        const key = this.props.navigation.getParam('key');
        const url = this.state.url + "api/child/" + child.id + "/";
        const user = this._form.getValue();
        console.log("PROFILE: WAHHH changes", user)
        if (user) {
            this.setState({
                loading: true
            });
            const cleanPicture = user.profile_picture.replace("file://", "");
            const data = new FormData();
            data.append('age', child.age);
            data.append('first_name', child.first_name);
            data.append('last_name', child.last_name);
            data.append('parent', JSON.stringify(child.parent));
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
                AsyncStorage.setItem('data', JSON.stringify(responseJson));
                Alert.alert(
                    'Motus Child',
                    'Profile picture successfully updated!',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.navigate('ProfileScreen') },
                    ],
                    { cancelable: false }
                );
            }).catch((error) => {
                // Error in Form
                console.log(error);
                alert('Error updating picture.')
            })
        } else {
            console.log('ERRROS')
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
                        <Forms ref={c => this._form = c}
                               type={User} options={options}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.editData}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
        );
    }
}