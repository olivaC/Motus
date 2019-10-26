import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    AsyncStorage,
    Image,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    FlatList,
    YellowBox
} from 'react-native';
import { Thumbnail, } from 'native-base';
import styles from '../styles/styles';

YellowBox.ignoreWarnings(['Require cycle:', 'VirtualizedList']);

/**
 * This class is the Mental health professionals profile page.
 */
export default class ClientProfile extends Component {
    static navigationOptions = {
        title: 'Client',
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
            children: '',
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            url: "http://204.209.76.235/"
        };
    }

    componentDidMount() {
        this.fetchData().done()
    }


    fetchData = async () => {
        const url = this.state.url + "api/parent/";
        const client = this.props.navigation.state.params.client;
        let value = '';

        await AsyncStorage.getItem('key').then((res) => {
            value = res
        });
        let r = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let clients = await r.json();
        // let client = clients[0];
        let info = client.profile;
        console.log("YOOOOOOOOOOO", client);
        console.log("List of clients", clients);
        console.log("yar", client);
        console.log("Information", info);
        this.setState({
            email: info.username,
            data: client,
            first_name: info.first_name,
            last_name: info.last_name,
            id: client.id,
        });

        let r2 = await fetch(this.state.url + "api/children_parent/" + `?parent=${encodeURIComponent(client.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let children = await r2.json();
        console.log(children);
        this.setState({ children: children });

        StatusBar.setNetworkActivityIndicatorVisible(false);
        return Promise.resolve();
    }

    clearAsyncStorage = async () => {
        AsyncStorage.clear();
        this.props.navigation.navigate('LoginScreen')
    };

    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData();
        this.setState({ refreshing: false });
    }

    onPress(item) {
        console.log("CLIENT", item);
        this.props.navigation.navigate('ChildProfileScreen', { child: item })
    }

    render() {
        // console.log(this.state.data);
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />}>
                    <View style={{ flex: 1, padding: 20, }}>
                        <View style={styles.content}>
                            <Image style={styles.imageContainer} source={{ uri: this.state.url + "parent_photo/" + this.state.id + "/" }}/>
                            <Text style={styles.header}>{this.state.first_name} {this.state.last_name}</Text>
                            <Text style={{ alignSelf: 'center', }}>PARENT</Text>
                            <Text style={styles.infoHeader}>Email</Text>
                            <Text>{this.state.email} </Text>
                            <Text style={styles.infoHeader}>Phone Number</Text>
                            <Text>{this.state.data.phone_number} </Text>
                            <Text style={styles.infoHeader}>Emergency Phone Number</Text>
                            <Text>{this.state.data.emergency_phone_number} </Text>
                            <Text style={styles.infoHeader}>Health Care Number</Text>
                            <Text>{this.state.data.health_care_number} </Text>
                        </View>

                        <View style={styles.content}>
                            <ScrollView>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.children}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => this.onPress(item)}>
                                            <View style={{ padding: 15, alignItems: 'center' }}>
                                                <Thumbnail source={{ uri: this.state.url + "child_photo/" + item.id + "/" }}/>
                                                <Text
                                                    style={styles.name}>{item.first_name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                />
                            </ScrollView>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate('CreateChildScreen', {parent: this.state.data})}>
                                <Text> Add Child </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate('ActivityLogScreen', {parent: this.state.data})}>
                                <Text> Activity Log </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}



