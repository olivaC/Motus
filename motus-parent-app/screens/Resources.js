import React, { Component } from 'react';
import { View, Text, Image, AsyncStorage, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import styles from '../styles/resourceStyles';

/**
 * Display all resources, pdf file
 */
export default class Resources extends Component {
    static navigationOptions = {
        title: 'Resources',
    };

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        const url = this.state.url + "api/resource/";
        AsyncStorage.getItem('key')
            .then((e) => {
                this.setState({ auth_token: e, loading: true });
                fetch(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + this.state.auth_token,
                    },
                }).then((response) => response.json()).then((r) => {
                    console.log(r);
                    this.setState({ data: r, loading: true });
                }).catch((error) => {
                    console.log(error);
                });
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
                    backgroundColor: "#b2b2b2",
                }}
            />
        );
    };

    render() {
        return (
            <View style={styles.container}>
            <Text style={styles.header}>SEE HOW YOU CAN HELP...</Text>
                <ScrollView>
                    <FlatList
                        style={{margin: 10}}
                        numColumns={2}
                        pagingEnabled={true}
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                        <TouchableOpacity
                            style={styles.content}
                            onPress={() => this.props.navigation.navigate('PdfScreen', { item })}>
                            <Image style={styles.imageView } source={{ uri: this.state.url + "resource_photo/" + item.id + "/" }} />
                                
                            <View style={styles.textContent}>
                                <Text style={styles.title}>{item.name} </Text>
                                <Text style={styles.teaser}>{item.teaser}</Text>
                            </View> 
                            
                        </TouchableOpacity>
                        }
                    />
                </ScrollView>
            </View>
        )
    }
}