import React, { Component } from 'react';
import {
    View,
    Text,
    AsyncStorage,
    ScrollView,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Alert, YellowBox, RefreshControl, Platform, ActivityIndicator,

} from 'react-native';
import YouTube from 'react-native-youtube';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Toast, { DURATION } from 'react-native-easy-toast'
import WebView from 'react-native-android-fullscreen-webview-video';
import Emoji from "react-native-emoji";
import { Icon } from "react-native-elements";
import styles from '../styles/styles';


YellowBox.ignoreWarnings(['VirtualizedList:']);

export default class Favorites extends Component {
    static navigationOptions = {
        title: 'Favourite',
        headerLeft: null,
    };

    componentDidMount() {
        this.fetchData().done()
    }

    async fetchData() {
        this.setState({ loading: true });
        let child = '';
        let value = '';
        await AsyncStorage.getItem('data').then((res) => {
            child = JSON.parse(res);
            this.setState({ child: JSON.parse(res) })
        });

        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res })
        });

        console.log(child);
        let r = await fetch(this.state.url + "api/bookmarked_videos/" + `?child=${encodeURIComponent(child.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            },
        });

        let assigned_videos = await r.json();
        console.log(assigned_videos);
        let platform = Platform.OS;

        this.setState({ data: assigned_videos, platform: platform, loading: false });
    }


    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().done();
        this.setState({ refreshing: false });
    }

    unbookmarkVideo(item) {
        const child = this.state.child;
        const key = this.state.auth_token;
        const new_bookmark = 'false';
        console.log(item);
        StatusBar.setNetworkActivityIndicatorVisible(true);
        const data = new FormData();
        data.append('child', child);
        data.append('assigned_video', item);
        data.append('new_bookmark', new_bookmark);
        console.log(item.id);

        fetch(this.state.url + "api/assigned_videos/" + item.id + `/?lesson=${encodeURIComponent(item.assigned_lesson)}` + `&child=${encodeURIComponent(child.id)}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + key,
            },
            body: JSON.stringify(data)
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson)
            let x = responseJson;
            if (x.bookmark === true) {
                this.refs.toast.show('Favorited!');
            } else {
                this.refs.toast.show('Un-favorited!');

            }
        }).catch((error) => {
            // Error in Form
            console.log(error);
            alert('Error in favoriting.')
        });

        StatusBar.setNetworkActivityIndicatorVisible(false);
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            auth_token: '',
            id: '',
            child: '',
            loading: true,
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
        let platform = this.state.platform;
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Loading Favourites...</Text>
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
                    <View style={{ flex: 1 }}>
                        <ScrollView refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />}>
                            <SwiperFlatList
                                data={this.state.data}
                                showPagination
                                paginationActiveColor={'black'}
                                paginationStyle={styles.pagination}
                                renderItem={({ item }) =>
                                    <View style={styles.swipe}>
                                        {console.log('swiping item:', item)}
                                        {console.log('watched', item.watched)}
                                        <View style={[styles.child, { backgroundColor: 'tomato' }]}>
                                            <Text style={[styles.lessonHeading,{fontWeight:'bold',color: 'white'}]}>{item.video.lesson.lesson_name}</Text>
                                            {platform === 'ios' &&
                                            <YouTube
                                                apiKey={"AIzaSyBq3AUXUWnzciujATp_oTh_bV5Qurg1ZcI"}
                                                videoId={item.video.youtube_id}
                                                play={false}             // control playback of video with true/false
                                                fullscreen={true}       // control whether the video should play in fullscreen or inline
                                                loop={false}             // control whether the video should loop when ended

                                                onReady={e => this.setState({ isReady: true })}
                                                onChangeState={e => this.setState({ status: e.state })}
                                                onChangeQuality={e => this.setState({ quality: e.quality })}
                                                onError={e => this.setState({ error: e.error })}
                                                onProgress={(e) => this.onProgress(e)}
                                                onChangeFullscreen={(e) => {
                                                    this.iOScompletedVideoWatch(item, e);
                                                }
                                                }
                                                style={{ alignSelf: 'stretch', flex: 1 }}
                                            />}
                                            {platform === 'android' &&
                                            <WebView
                                                style={{ alignSelf: 'stretch', flex: 1 }}
                                                source={{ uri: `https://www.youtube.com/embed/${item.video.youtube_id}` }}
                                                mediaPlaybackRequiresUserAction={true}
                                            />}

                                        </View>
                                        <Text style={[styles.lessonHeading,{marginTop:25}]}>{item.video.video_name}</Text>
                                        <Text style={styles.description}>{item.video.description}</Text>
                                        <View style={{
                                            alignSelf: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {item.bookmark === false &&
                                            <Icon
                                                raised
                                                name='heart-outlined'
                                                type='entypo'
                                                color='#D50000'
                                                onPress={() => this.unbookmarkVideo(item)}/>
                                            }
                                            {item.bookmark === true &&
                                            <Icon
                                                raised
                                                name='heart'
                                                type='entypo'
                                                color='#D50000'
                                                onPress={() => this.unbookmarkVideo(item)}/>
                                            }
                                        </View>
                                        
                                    </View>
                                }
                            >
                            </SwiperFlatList>
                        </ScrollView>
                        <Toast ref="toast"/>
                    </View>
                </View>
            )
        }
    }
}

