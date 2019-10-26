import React, { Component } from 'react';
import { View, Text, AsyncStorage, ScrollView, Alert, Button, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/mainStyles';

const tform = require('tcomb-form-native');
const Forms = tform.form.Form;

const User = tform.struct({
    message: tform.String,

});

const options = {
    fields: {
        message: {
            multiline: true,
            error: 'This is required'
        }
    }
};

export default class Support extends Component {

    static navigationOptions = {
        title: 'Email your Mental Health Professional',
        headerLeft: null,
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
            text: '',
            parent: '',
            url: "http://204.209.76.235/"
        };
    }

    componentDidMount() {
        this.fetchData().done()
    }

    fetchData = async () => {
        const url = this.state.url + "api/parent/";
        let value = '';
        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res })
        });

        console.log('auth token: ', value);
        let par = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            },
        });

        let parent = await par.json();
        console.log(parent);
        this.setState({ parent: parent[0] });
    };

    contactProfessional = () => {
        const url = this.state.url + "api/contact_professional/";
        console.log("text",this.state.text)
        let pass = true
        if(this.state.text.length == 0){
            pass = false
            alert('Message Required.')
        }

        if (pass) {
            this.setState({
                loading: true
            });
            const data = new FormData();
            data.append('message', this.state.text);
            data.append('parent', this.state.parent);
            data.append('prof', this.state.parent.professional);
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + this.state.auth_token,
                },
                body: data
            }).then((response) => response.text()).then((responseJson) => {
                console.log(responseJson);
                this.setState({ text: '' })
                Alert.alert(
                    'Motus Parent',
                    'Email sent!',
                    [
                        {
                            text: 'OK',
                            onPress: () => this.props.navigation.navigate('HomeScreen')
                        },
                    ],
                    { cancelable: false }
                );
            }).catch((error) => {
                // Error in Form
                alert('Error in sending email.')
            })
        } else {
            console.log('ERRROS')
        }
    };

    render() {
        return (
            <View style={[styles.container,{backgroundColor: '#E0E0E0'}]}>
                <ScrollView style={{padding: 20}}>
                    <Text style={[styles.header, {fontSize: 16}]}>LEAVE A MESSAGE</Text>
                    <TextInput
                    style={styles.form}
                    editable = {true}
                    multiline = {true}
                    numberOfLines = {10}
                    maxLength = {100}
                    placeholder="Message"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    />
                    
                    <TouchableOpacity
                        style={{ alignItems: 'center', margin: 10,}}
                        onPress={this.contactProfessional} >
                        <Text style={[styles.greenButton, {backgroundColor: '#757575'}]}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}