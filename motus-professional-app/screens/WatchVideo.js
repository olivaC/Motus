import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage, ScrollView, FlatList } from 'react-native';
import YouTube from 'react-native-youtube';
import styles from '../styles/styles';

export default class WatchVideo extends Component {
    static navigationOptions = {
        title: '',
    };

    // async componentDidMount(): Promise<void> {
    //     const lesson = this.props.navigation.getParam('lesson');
    //     const url = this.state.url + "api/lesson_videos/";
    //     let value = '';
    //
    //     await AsyncStorage.getItem('key').then((res) => {
    //         value = res
    //     });
    //     const data = new FormData();
    //     data.append('lesson', lesson.id);
    //     let r = await fetch(this.state.url + "api/lesson_videos/" + `?lesson=${encodeURIComponent(lesson.id)}`, {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Token ' + value,
    //         },
    //     });
    //
    //     let videos = await r.json();
    //     console.log(videos);
    //     this.setState({ data: videos });
    // }

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
        const video = this.props.navigation.getParam('video');
        console.log(video);
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.header}>{video.video_name}</Text>
                </View>
                <YouTube
                    apiKey={"AIzaSyBq3AUXUWnzciujATp_oTh_bV5Qurg1ZcI"}
                    videoId={video.youtube_id}
                    play={true}             // control playback of video with true/false
                    fullscreen={true}       // control whether the video should play in fullscreen or inline
                    loop={false}             // control whether the video should loop when ended

                    onReady={e => this.setState({ isReady: true })}
                    onChangeState={e => this.setState({ status: e.state })}
                    onChangeQuality={e => this.setState({ quality: e.quality })}
                    onError={e => this.setState({ error: e.error })}

                    style={{ alignSelf: 'stretch', height: 300 }}
                />
                <View style={styles.content}>
                    <Text>{video.description}</Text>
                </View>
            </View>
        )
    }
}
