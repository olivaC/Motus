import React, { Component } from 'react';
import {
    View, Text, StyleSheet, AsyncStorage, ScrollView, Dimensions, Platform
} from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import YouTube from 'react-native-youtube';
import WebView from 'react-native-android-fullscreen-webview-video';


export default class Videos extends Component {
    static navigationOptions = {
        title: 'Videos',
    };

    async componentDidMount(): Promise<void> {
        const lesson = this.props.navigation.getParam('lesson');
        const url = this.state.url + "api/lesson_videos/";
        let value = '';

        await AsyncStorage.getItem('key').then((res) => {
            value = res
        });
        const data = new FormData();
        data.append('lesson', lesson.id);
        let r = await fetch(this.state.url + "api/lesson_videos/" + `?lesson=${encodeURIComponent(lesson.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            },
        });

        let videos = await r.json();
        console.log(videos);
        let platform = Platform.OS;
        this.setState({ data: videos, platform: platform });
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
            platform: '',
            url: "http://204.209.76.235/"
        };
    }

    render() {
        let platform = this.state.platform;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <SwiperFlatList
                        data={this.state.data}
                        showPagination
                        paginationActiveColor={'black'}
                        paginationStyle={{ position: 'absolute', bottom: 5 }}
                        renderItem={({ item }) =>
                            <View style={styles.swipe}>
                                <View style={[styles.child, { backgroundColor: '#CBD4E7' }]}>
                                    <Text style={styles.text}>{item.lesson.lesson_name}</Text>
                                    {platform === 'ios' &&
                                    <YouTube
                                        apiKey={"AIzaSyBq3AUXUWnzciujATp_oTh_bV5Qurg1ZcI"}
                                        videoId={item.youtube_id}
                                        play={false}             // control playback of video with true/false
                                        fullscreen={true}       // control whether the video should play in fullscreen or inline
                                        loop={false}             // control whether the video should loop when ended

                                        onReady={e => this.setState({ isReady: true })}
                                        onChangeState={e => this.setState({ status: e.state })}
                                        onChangeQuality={e => this.setState({ quality: e.quality })}
                                        onError={e => this.setState({ error: e.error })}
                                        style={{ alignSelf: 'stretch', flex: 1 }}
                                    />}
                                    {platform === 'android' &&
                                    <WebView
                                        style={{ alignSelf: 'stretch', flex: 1 }}
                                        source={{ uri: `https://www.youtube.com/embed/${item.youtube_id}` }}
                                        mediaPlaybackRequiresUserAction={true}
                                    />}
                                    <Text style={styles.text}>{item.video_name}</Text>
                                </View>
                                <View>
                                    <Text style={styles.text2}>{item.description}</Text>
                                </View>

                            </View>

                        }
                    >
                    </SwiperFlatList>
                </ScrollView>
            </View>
        )
    }
}
export const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    text: {
        fontSize: 15,
        letterSpacing: 2,
        alignSelf: 'center',
        textTransform: 'uppercase',
        textAlign: 'center',
        padding: 10,
    },
    text2: {
        fontSize: 15,
        letterSpacing: 2,
        alignSelf: 'center',
        textAlign: 'center',
        padding: 10,
    },
    child: {
        height: height * 0.5,
        width,
        justifyContent: 'center'
    },
    swipe: {
        width,
        // backgroundColor: 'thistle' ,
        paddingBottom: 50,

    },
    header: {
        fontSize: 20,
        alignSelf: 'center',
        padding: 10,
    },
    button: {
        backgroundColor: '#00aeef',
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 50,
    },
    textView: {
        width: '75%',
        fontSize: 20,
        padding: 10,
        color: '#000'
    },
});