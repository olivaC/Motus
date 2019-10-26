import React, { Component } from 'react';
import {
    View,
    Text,
    AsyncStorage,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Dimensions,
    YellowBox, Platform, ActivityIndicator,
} from 'react-native';
import YouTube from 'react-native-youtube';
import { Icon } from 'react-native-elements'
import SwiperFlatList from 'react-native-swiper-flatlist';
import Toast, { DURATION } from 'react-native-easy-toast'
import WebView from 'react-native-android-fullscreen-webview-video';
import Emoji from 'react-native-emoji';
import * as Progress from 'react-native-progress';
import styles from '../styles/styles';


YellowBox.ignoreWarnings(['VirtualizedList:']);


export default class Videos extends Component {
    static navigationOptions = {
        title: 'Lesson',
    };

    async fetchData() {
        const lesson = this.props.navigation.getParam('lesson');
        const child = this.props.navigation.getParam('child');
        let value = '';

        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res })
        });

        let r = await fetch(this.state.url + "api/assigned_videos/" + `?lesson=${encodeURIComponent(lesson.id)}` + `&child=${encodeURIComponent(child.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            },
        });

        let assigned_videos = await r.json();
        console.log(assigned_videos);

        let count = 0;
        let vid_len = assigned_videos.length;

        for (let i = 0; i < assigned_videos.length; i++) {
            if (assigned_videos[i].watched === true) {
                count++
            }
        }

        let prog = count / vid_len;
        let platform = Platform.OS;
        this.setState({ data: assigned_videos, platform: platform, loading: false, progress: prog });
    }

    componentDidMount() {
        this.fetchData().done()
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().done();
        this.setState({ refreshing: false, sending: false });
    }

    bookmarkVideo(item) {
        // this.setState({sending: true});
        const child = this.props.navigation.getParam('child');
        const key = this.state.auth_token;
        let new_bookmark = '';
        if (item.bookmark === true) {
            new_bookmark = 'false'
        } else {
            new_bookmark = 'true'
        }
        const data = new FormData();
        const j = this.state.data;
        this.setState({ oldData: j });
        data.append('child', child);
        data.append('assigned_video', item);
        data.append('new_bookmark', new_bookmark);
        fetch(this.state.url + "api/assigned_videos/" + item.id + `/?lesson=${encodeURIComponent(item.assigned_lesson)}` + `&child=${encodeURIComponent(child.id)}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + key,
            },
            body: JSON.stringify(data)
        }).then((response) => response.json()).then((responseJson) => {
            console.log('fav resp:', responseJson);
            this._onRefresh();
            let x = responseJson;
            this.setState({ sending: false, });
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
    };

    addReaction(item, reaction) {
        this.setState({ sending: true });
        const child = this.props.navigation.getParam('child');
        const key = this.state.auth_token;
        const data = new FormData();
        data.append('child', child);
        data.append('assigned_video', item);
        data.append('reaction', reaction);
        console.log(item.id);
        console.log('assigned id: ', item.assigned_lesson);
        console.log(data);
        fetch(this.state.url + "api/assigned_videos_reaction/" + item.id + `/?lesson=${encodeURIComponent(item.assigned_lesson)}` + `&child=${encodeURIComponent(child.id)}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + key,
            },
            body: JSON.stringify(data)
        }).then((response) => response.json()).then((responseJson) => {
            console.log('reaction:', responseJson);
            this._onRefresh();
            let x = responseJson;
            if (x.reaction === '') {
                this.refs.toast.show('Removed reaction');
            } else {
                this.refs.toast.show('Added ' + x.reaction + ' reaction');

            }
        }).catch((error) => {
            // Error in Form
            console.log(error);
            alert('Error in sending reaction.')
        });
    };

    iOScompletedVideoWatch(item, e) {
        const child = this.props.navigation.getParam('child');
        const key = this.state.auth_token;
        let time_diff = this.state.duration - this.state.current_time;
        console.log('watched video', this.state.target);

        if (!e.isFullscreen && e.target === this.state.target && time_diff < 1) {
            const data = new FormData();
            data.append('child', child.id);
            data.append('lesson', item.assigned_lesson);
            fetch(this.state.url + "api/assigned_videos_time/" + item.id + `/?lesson=${encodeURIComponent(item.assigned_lesson)}` + `&child=${encodeURIComponent(child.id)}`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + key,
                },
                body: JSON.stringify(data)
            }).then((response) => response.json()).then((responseJson) => {
                console.log('completed response:', responseJson);
                this._onRefresh();
            }).catch((error) => {
                // Error in Form
                console.log(error);
            });
        }
    };

    androidCompletedVideoWatch(item) {
        const child = this.props.navigation.getParam('child');
        const key = this.state.auth_token;
        const data = new FormData();
        data.append('child', child.id);
        data.append('lesson', item.assigned_lesson);
        fetch(this.state.url + "api/assigned_videos_time/" + item.id + `/?lesson=${encodeURIComponent(item.assigned_lesson)}` + `&child=${encodeURIComponent(child.id)}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + key,
            },
            body: JSON.stringify(data)
        }).then((response) => response.json()).then((responseJson) => {
            console.log('completed response:', responseJson);
            this._onRefresh();
            this.refs.toast.show('Video watched');
        }).catch((error) => {
            // Error in Form
            console.log(error);
        });

    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            auth_token: '',
            id: '',
            loading: true,
            data: [],
            oldDData: [],
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            url: "http://204.209.76.235/",
            platform: '',
            tags: [],
            duration: '',
            current_time: '',
            target: '',
            watched_id: '',
            sending: false,
            progress: 0
        };
    }

    onChange(e, _id) {
        let newArray = this.state.tags.slice();
        let x = { "id": _id, "target": e.target };
        newArray.push(x);
        this.setState({ tags: newArray })
    }

    onProgress(e) {
        this.setState({ duration: e.duration, current_time: e.currentTime, target: e.target })
    }

    render() {
        let platform = this.state.platform;
        const lesson = this.props.navigation.getParam('lesson');
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Text style={styles.lessonHeading}>Loading lesson: {lesson.lesson.lesson_name}...</Text>
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
                    <ScrollView>
                        <SwiperFlatList
                            data={this.state.data}
                            showPagination
                            paginationActiveColor={'black'}
                            paginationStyle={styles.pagination}
                            renderItem={({ item }) =>
                                <View style={styles.swipe}>
                                    <View style={[styles.child, { backgroundColor: '#96A8CE' }]}>
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
                                            onChangeFullscreen={(e) => {this.iOScompletedVideoWatch(item, e);}
                                            }
                                            style={{ alignSelf: 'stretch', flex: 1 }}
                                        />}
                                        {platform === 'android' &&
                                        <WebView
                                            style={{ alignSelf: 'stretch', flex: 1 }}
                                            source={{ uri: `https://www.youtube.com/embed/${item.video.youtube_id}` }}
                                            mediaPlaybackRequiresUserAction={true}
                                            onLoad={(e) => this.onChange(e, item.video.youtube_id)}
                                            onChangeFullscreen={(e) => console.log('yarrrrrr')}
                                            onMessage={(event) => console.log(event.nativeEvent.data)}
                                        />}
                                        

                                    </View>
                                    
                                    
                                    <View style={{
                                        flexDirection: 'row',
                                        padding: 20,
                                        alignSelf: 'center',
                                        width: "100%",
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop:20,
                                        
                                    }}>
                                        {item.reaction === 'love' &&
                                        <TouchableOpacity style={styles.love}
                                                          onPress={() => this.addReaction(item, '')}>
                                            <Emoji name="heart_eyes" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction !== 'love' &&
                                        <TouchableOpacity style={styles.unselected}
                                                          onPress={() => this.addReaction(item, 'love')}>
                                            <Emoji name="heart_eyes" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction === 'sad' &&
                                        <TouchableOpacity style={styles.cry} onPress={() => this.addReaction(item, '')}>
                                            <Emoji name="cry" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction !== 'sad' &&
                                        <TouchableOpacity style={styles.unselected}
                                                          onPress={() => this.addReaction(item, 'sad')}>
                                            <Emoji name="cry" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction === 'relaxed' &&
                                        <TouchableOpacity style={styles.relaxed}
                                                          onPress={() => this.addReaction(item, '')}>
                                            <Emoji name="relaxed" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction !== 'relaxed' &&
                                        <TouchableOpacity style={styles.unselected}
                                                          onPress={() => this.addReaction(item, 'relaxed')}>
                                            <Emoji name="relaxed" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction === 'angry' &&
                                        <TouchableOpacity style={styles.angry}
                                                          onPress={() => this.addReaction(item, '')}>
                                            <Emoji name="rage" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction !== 'angry' &&
                                        <TouchableOpacity style={styles.unselected}
                                                          onPress={() => this.addReaction(item, 'angry')}>
                                            <Emoji name="rage" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction === 'surprised' &&
                                        <TouchableOpacity style={styles.surprised}
                                                          onPress={() => this.addReaction(item, '')}>
                                            <Emoji name="hushed" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                        {item.reaction !== 'surprised' &&
                                        <TouchableOpacity style={styles.unselected}
                                                          onPress={() => this.addReaction(item, 'surprised')}>
                                            <Emoji name="hushed" style={{ fontSize: 25 }}/>
                                        </TouchableOpacity>}
                                    </View>
                                    <View style={{
                                        flexDirection: 'row-reverse',
                                        width: "100%",
                                        alignSelf: 'flex-end',
                                        position:'absolute',
                                    }}>
                                        {item.bookmark === false &&
                                        <Icon
                                            raised
                                            name='heart-outlined'
                                            type='entypo'
                                            color='#D50000'
                                            onPress={() => this.bookmarkVideo(item)}/>
                                        }
                                        {item.bookmark === true &&
                                        <Icon
                                            raised
                                            name='heart'
                                            type='entypo'
                                            color='#D50000'
                                            onPress={() => this.bookmarkVideo(item)}/>
                                        }
                                    </View>
                                    <Text style={styles.lessonHeading}>{item.video.video_name}</Text>
                                    <Text style={styles.description}>{item.video.description}</Text>
                                    {platform === 'android' && !item.watched &&
                                    <TouchableOpacity
                                        style={{alignSelf:'center'}}
                                        onPress={() => this.androidCompletedVideoWatch(item)}>
                                        <Text style={[styles.buttonBorder,{alignSelf:'baseline'}]}>Press if video watched</Text>
                                    </TouchableOpacity>
                                    }
                                </View>
                            }
                        >
                        </SwiperFlatList>
                    </ScrollView>
                    <Text style={[styles.lessonHeading,{fontSize: 12,color:'grey'}]}>Complete: {Math.trunc(this.state.progress * 100)}%</Text>
                    <Progress.Bar progress={this.state.progress} height={20} width={null}/>
                    <Toast ref="toast"/>
                    {this.state.sending &&
                    <View style={styles.loading}>
                        <ActivityIndicator size='large'/>
                    </View>
                    }
                </View>

            )
        }
    }
}
