import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, } from 'react-native';
import { Thumbnail, } from 'native-base';
import styles from '../styles/supportStyles';

export default class Support extends Component {
    static navigationOptions = {
        title: 'Motus Support Team',
        headerLeft: null,
    };

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        const url = this.state.url + "api/support/";
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((r) => {
            console.log(r);
            this.setState({ data: r, loading: true });
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
                    backgroundColor: "#000",
                }}
            />
        );
    };

    render() {
        return (
            <View style={styles.container}>
            <ScrollView>
                <View style={{ flex: 1}}>
                        <FlatList
                            data={this.state.data}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                                    <Thumbnail square large source={{uri: "https://i.kym-cdn.com/entries/icons/original/000/018/489/nick-young-confused-face-300x256-nqlyaa.jpg"}} />
                                    <View style= {{paddingHorizontal: 10}}>
                                    <Text style={styles.header}>{item.name}</Text>
                                    <Text>{item.position}</Text>
                                    <Text>Phone: {item.phone}</Text>
                                    <Text>Email: {item.email}</Text>

                                    </View>
                                </View>
                            }
                        />

                </View>
                </ScrollView>
            </View>
        )
    }
}