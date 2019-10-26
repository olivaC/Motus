import React, { Component } from 'react';
import { View, Text, AsyncStorage, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import styles from '../styles/resourceStyle';

export default class Lessons extends Component {
    static navigationOptions = {
        title: 'Lessons',
    };

    async componentDidMount(): Promise<void> {
        const url = this.state.url + "api/lessons/";
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

        let lessons = await r.json();
        this.setState({ data: lessons });
        console.log(lessons)

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
            videos: [],
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            lesson: [],
            url: "http://204.209.76.235/"
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>ALL LESSONS</Text>
                <ScrollView>
                    <FlatList
                        pagingEnabled={true}
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <View style={styles.content}>
                            <Image style={styles.imageView}
                                source={{ uri: this.state.url + "lesson_photo/" + item.id + "/" }}/>
                            <View style={{ flexDirection: 'row', width: "50%", alignSelf:'center'}}>
                                <View style={{alignItems:'center', flex: 1}}>
                                    <Text style={[styles.title,{padding:5}]}>Lesson</Text>
                                    <Text style={styles.title}>{item.lesson_name}</Text>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('VideosScreen', { lesson: item })}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>View Videos</Text>
                                    </View>
                                </TouchableOpacity>
                                </View>
                                
                            </View>
                        </View>
                        }
                    />
                </ScrollView>
            </View>
        )
    }
}