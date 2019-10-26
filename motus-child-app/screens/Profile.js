import React, { Component } from 'react';
import { Text, View, Image, Alert, TouchableOpacity, ScrollView, RefreshControl, } from 'react-native';
import styles from '../styles/styles';
import { AsyncStorage } from "react-native";


export default class Profile extends Component {
    static navigationOptions = {
        title: 'Profile',
    };

    componentDidMount() {
        this.setState({ id: '' });
        this.fetchData().done()
    }


    fetchData = async () => {
        let value = '';
        let id = '';

        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res });
        });

        await AsyncStorage.getItem('id').then((res) => {
            id = res;
            this.setState({ id: res });
        });

        let r1 = await fetch(this.state.url + "api/child/" + id + "/", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let chi = await r1.json();
        // console.log(prof);
        let p = chi;
        console.log(p);
        this.setState({
            data: p,
            first_name: p.first_name,
            last_name: p.last_name,
            id: p.id,
        });
    };

    clearAsyncStorage = async () => {
        AsyncStorage.clear();
        this.props.navigation.navigate('LoginScreen')
    };

    _onRefresh() {
        this.setState({ refreshing: true, id: '' });
        this.fetchData().done();
        this.forceUpdate();
        this.setState({ refreshing: false });
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

    render() {
        console.log(this.state.data);
        return (
            <View style={styles.container}>
                <ScrollView style={{ flex: 1, padding: 20 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />}>
                    <View style={styles.content}>
                        <Image style={styles.imageRound}
                               source={{ uri: this.state.url + "child_photo/" + this.state.id + "/" }}/>
                        <View style={{padding: 10}}>
                            <Text
                                style={styles.text}>{this.state.data.first_name} {this.state.data.last_name}</Text>
                            <Text style={styles.text}>Age: {this.state.data.age}</Text>
                        </View>
                        
                    </View>

                    <View style={styles.content}>
                        <TouchableOpacity
                            style={styles.proButton}
                            onPress={() => this.props.navigation.navigate('EditScreen', {
                                profile: this.state.data,
                                key: this.state.auth_token
                            })}>
                        
                            <Text style={[styles.buttonText,{fontSize:12, textTransform: 'uppercase'}]}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.proButton, {backgroundColor: '#c2c2c2'}]}
                            onPress={this.clearAsyncStorage}
                        >
                            <Text style={[styles.buttonText,{fontSize:12, textTransform: 'uppercase'}]}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}