import React, { Component } from 'react';
import { View, Text, AsyncStorage, FlatList, TouchableOpacity, TouchableHighlight,Image, ScrollView } from 'react-native';
import styles from '../styles/resourceStyle';

export default class Resources extends Component {
    static navigationOptions = {
        title: 'Resources',
    };

    async componentDidMount(): Promise<void> {
        const url = this.state.url + "api/resource/";
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

        let resource = await r.json();
        this.setState({ data: resource});
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

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>THIS WEEK'S BEST ACADEMIC PICKS</Text>
                <ScrollView>
                    <FlatList
                        pagingEnabled={true}
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                        <View style={styles.content}>
                            <Image style={styles.imageView } source={{ uri: this.state.url + "resource_photo/" + item.id + "/" }} />
                                <View style={styles.textContent}>
                                    <Text style={styles.teaser}>{item.teaser}</Text>
                                    <Text style={styles.title}>{item.name}</Text>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('PdfScreen', { item })}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>LEARN MORE</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>


                        </View>

                        
                        }
                    />
                </ScrollView>
            </View>
        )
    }
}
