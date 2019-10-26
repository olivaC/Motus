import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    AsyncStorage,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import styles from '../styles/profileStyles';

/**
 * This class is parent profile page.
 */
export default class Profile extends Component {
    static navigationOptions = {
        title: 'Profile',
        headerLeft: null,
    };

    componentWillMount() {
        this.fetchData();
    }

    /**
     * As the component is mounting, retrieve credentials from async storage and use the authentication token to retrieve
     * the professionals profile.
     */
    fetchData() {
        const url = this.state.url + "api/parent/";
        AsyncStorage.getItem('email')
            .then((e) => {
                this.setState({ email: e })
            });
        AsyncStorage.getItem('key')
            .then((e) => {
                this.setState({ auth_token: e });
                fetch(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + this.state.auth_token,
                    },
                }).then((response) => response.json()).then((r) => {
                    console.log(r);
                    this.setState({
                        data: r[0],
                        loading: false,
                        id: r[0].id,
                        first_name: r[0].profile.first_name,
                        last_name: r[0].profile.last_name
                    });
                }).catch((error) => {
                    console.log(error);
                });
            });
        this.setState({ loading: false })

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

    clearAsyncStorage = async () => {
        AsyncStorage.clear();
        this.props.navigation.navigate('LoginScreen')
    };

    /**
     * Refreshing data
     * RefreshControl from react native
     * How it works: drag the screen down to refresh screen
     */
    _onRefresh() {
        this.setState({ refreshing: true, id: '' });
        this.fetchData();
        this.setState({ refreshing: false });
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />}>
                    <View style={{ flex: 1, padding: 20 }}>
                        <Image style={styles.imageView}
                               source={{ uri: this.state.url + "parent_photo/" + this.state.id + "/" }}/>
                        <Text style={styles.header}>{this.state.first_name} {this.state.last_name}</Text>
                        <View style={styles.content}>
                            <Text style={{ fontSize: 12, color: '#606060' }}>Email</Text>
                            <Text>{this.state.email} </Text>
                            <Text style={styles.infoHeader}>Phone Number</Text>
                            <Text>{this.state.data.phone_number} </Text>
                            <Text style={styles.infoHeader}>Emergency Phone Number</Text>
                            <Text>{this.state.data.emergency_phone_number}</Text>
                            <Text style={styles.infoHeader}>Health Care Number</Text>
                            <Text>{this.state.data.health_care_number}</Text>
                        </View>
                        <View style={styles.content}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate('EditProfileScreen', {
                                    parent: this.state.data,
                                    key: this.state.auth_token
                                })}>
                                <Text>Edit Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={this.clearAsyncStorage}>
                                <Text>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}