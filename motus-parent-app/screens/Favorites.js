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
    YellowBox, Dimensions, Platform
} from 'react-native';
import styles from '../styles/styles';
import { Thumbnail } from "native-base";
import SwiperFlatList from 'react-native-swiper-flatlist';
import YouTube from 'react-native-youtube';
import WebView from 'react-native-android-fullscreen-webview-video';


YellowBox.ignoreWarnings(['Require cycle:', 'VirtualizedList']);


export default class Favorites extends Component {
    static navigationOptions = {
        title: 'Favorites',
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            auth_token: '',
            id: '',
            loading: false,
            data: [],
            unassignedLessons: [],
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            selectedLessons: [],
            parent: '',
            children: '',
            favourites: '',
            platform: '',
            url: "http://204.209.76.235/"
        };
    }

    componentDidMount() {
        this.fetchData().done()
    }

    fetchData = async () => {
        const url = this.state.url + "api/parent/";
        let value = '';
        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res })
        });

        console.log('auth token: ', value);
        let par = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            },
        });

        let parent = await par.json();
        console.log(parent);

        let chi = await fetch(this.state.url + "api/children_parent/" + `?parent=${encodeURIComponent(parent[0].id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let children = await chi.json();
        console.log(children);
        let platform = Platform.OS;
        this.setState({ children: children, platform: platform, parent: parent[0] });

    };

    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().done();
        this.setState({ refreshing: false });
    }

    async onPress(item) {
        console.log("CLIENT", item);
        let r = await fetch(this.state.url + "api/bookmarked_videos/" + `?child=${encodeURIComponent(item.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.auth_token,
            },
        });

        let assigned_videos = await r.json();
        console.log(assigned_videos);
        this.setState({ data: assigned_videos });
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
        const favourites = this.state.data;
        let platform = this.state.platform;
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />}>

                    <View style={styles.content}>
                    {favourites.length === 0 &&
                        <Text style={[styles.text,{fontSize: 12}]}>Choose child to view their favourite videos.</Text>}
                        <ScrollView>
                            <FlatList
                                numColumns={3}
                                data={this.state.children}
                                renderItem={({ item }) =>
                                    <TouchableOpacity onPress={() => this.onPress(item)}>
                                        <View style={{ padding: 15, alignItems: 'center' }}>
                                            <Thumbnail
                                                source={{ uri: this.state.url + "child_photo/" + item.id + "/" }}/>
                                            <Text
                                                style={styles.name}>{item.first_name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                            />
                        </ScrollView>
                    </View>
                    <View style={styles.container2}>
                        {favourites.length > 0 &&
                        <SwiperFlatList
                            data={this.state.data}
                            showPagination
                            paginationActiveColor={'black'}
                            paginationStyle={{ position: 'absolute', bottom: 5 }}
                            renderItem={({ item }) =>
                                <View style={{
                                    width,
                                    paddingBottom: 20,
                                }}>
                                    <View style={[styles.child, { backgroundColor: '#CBD4E7' }]}>
                                        <Text style={styles.text}>{item.video.lesson.lesson_name}</Text>
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
                                            style={{ alignSelf: 'stretch', flex: 1 }}
                                        />}
                                        {platform === 'android' &&
                                        <WebView
                                            style={{ alignSelf: 'stretch', flex: 1 }}
                                            source={{ uri: `https://www.youtube.com/embed/${item.video.youtube_id}` }}
                                            mediaPlaybackRequiresUserAction={true}
                                        />}
                                        <Text style={styles.text}>{item.video.video_name}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.text2}>{item.video.description}</Text>
                                    </View>

                                </View>

                            }
                        >
                        </SwiperFlatList>}
                        
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export const { width, height } = Dimensions.get('window');
