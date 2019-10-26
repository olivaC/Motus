import React, { Component } from 'react';
import { View, Text, AsyncStorage, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../styles/styles';
import { Thumbnail, } from 'native-base';

export default class ChooseChild extends Component {
    static navigationOptions = {
        title: 'Choose Child',
    };

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        this.setState({ loading: true });
        const key = this.props.navigation.getParam('key');
        const url = this.state.url + "api/child/";
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + key,
            },
        }).then((response) => response.json()).then((r) => {
            console.log(r);
            this.setState({ data: r, loading: false });
        }).catch((error) => {
            console.log(error);
        });
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

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: .5,
                    width: "100%",
                    backgroundColor: "#E0E0E0",
                }}
            />
        );
    };

    last_login = (item) => {
        const key = this.props.navigation.getParam('key');

        const url = this.state.url + "api/child/" + item.id + "/";
        fetch(url, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + key,
            },
        }).then((response) => response.json()).then((r) => {
            console.log(r);
            this.props.navigation.navigate('HomeScreen', {
                child: item,
                key: this.state.auth_token
            })
        }).catch((error) => {
            console.log(error);
        });
    }


    render() {
        const key = this.props.navigation.getParam('key');
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Loading Children...</Text>
                    <ActivityIndicator
                        animating
                        color="#000000"
                        size="large"
                    />
                </View>
            )
        }
        if (!this.state.loading) {
            return (
                <View style={styles.container}>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <ScrollView>
                            <FlatList
                                data={this.state.data}
                                ItemSeparatorComponent={this.FlatListItemSeparator}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            AsyncStorage.setItem('first_name', item.first_name);
                                            AsyncStorage.setItem('last_name', item.last_name);
                                            AsyncStorage.setItem('id', item.id.toString());
                                            AsyncStorage.setItem('data', JSON.stringify(item));
                                            this.last_login(item)
                                        }
                                        }
                                    >
                                        <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                                            <View style={styles.row}>
                                                {console.log(this.state.url + "child_photo/" + item.id + "/")}
                                                <Thumbnail large
                                                           source={{ uri: this.state.url + "child_photo/" + item.id + "/" }}/>
                                                <Text style={styles.textView}>
                                                    {item.first_name} {item.last_name}</Text>
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                }
                            />
                        </ScrollView>
                    </View>
                </View>
            )
        }
    }
}