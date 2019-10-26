import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { AsyncStorage } from "react-native"


let tform = require('tcomb-form-native');
let Forms = tform.form.Form;

const User = tform.struct({
    first_name: tform.String,
    last_name: tform.String,
    age: tform.Number,
});

const options = {
    fields: {
        first_name: {
            error: 'This is required',
            returnKeyType: 'done',
        },
        last_name: {
            error: 'This is required',
            returnKeyType: 'done',
        },
        age: {
            error: 'This is required',
            autoCapitalize: "none",
            returnKeyType: 'done',

        },
    },
};

export default class CreateChild extends Component {
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
        this.fetchData().done()
    }

    async fetchData() {
        await AsyncStorage.getItem('key').then((res) => {
            this.setState({ auth_token: res })
        });
    }

    createChild = () => {
        const url = this.state.url + "api/child/";
        const user = this._form.getValue();
        const parent = this.props.navigation.getParam('parent');
        console.log("YAR")
        if (user) {
            this.setState({
                loading: true
            });
            const data = new FormData();
            data.append('age', user.age);
            data.append('first_name', user.first_name);
            data.append('last_name', user.last_name);
            data.append('parent', parent.id);
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + this.state.auth_token,
                },
                body: data
            }).then((response) => response.json()).then((responseJson) => {
                console.log("HUH", responseJson);
                Alert.alert(
                    'Motus Professional',
                    'Child Created!',
                    [
                        {
                            text: 'OK',
                            onPress: () => this.props.navigation.navigate('ClientProfileScreen', { client: parent })
                        },
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
                    <Text style={styles.header}>Add New Child </Text>
                    <Forms ref={c => this._form = c} type={User} options={options}/>
                    <Button buttonStyle={styles.button} onPress={this.createChild} title='Create'/>
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

