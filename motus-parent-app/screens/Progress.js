import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    AsyncStorage,
    Button,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    YellowBox, Dimensions, Platform
} from 'react-native';
import styles from '../styles/styles';
import { Thumbnail } from "native-base";
import * as ProgressLib from 'react-native-progress';
import Modal from "react-native-modal";
import Emoji from 'react-native-emoji';


YellowBox.ignoreWarnings(['Require cycle:', 'VirtualizedList']);
const emojiDict = {
    'love': 'heart_eyes',
    'sad': 'cry',
    'relaxed': 'relaxed',
    'angry': 'rage',
    'surprised': 'hushed',
};


export default class Progress extends Component {
    static navigationOptions = {
        title: 'Progress',
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
            videos: [],
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
            current_child: '',
            isModalVisible: false,
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
        let child = item;
        let r = await fetch(this.state.url + "api/assigned_lesson_get/" + `?child=${encodeURIComponent(child.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.auth_token,
            }
        });

        let lessons = await r.json();
        console.log(lessons);

        for (let i = 0; i < lessons.length; i++) {
            let r3 = await fetch(this.state.url + 'lesson_count/' + lessons[i].id + "/" + child.id + "/", {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/text',
                    'Authorization': 'Token ' + this.state.auth_token,
                },
            });

            let x = await r3.text();
            lessons[i]['count'] = parseFloat(x);
        }
        this.setState({ data: lessons, current_child: child });
    }

    openModalWithItem = async (item) => {
        console.log(item);
        const child = this.state.current_child;
        let r = await fetch(this.state.url + "api/assigned_videos/" + `?lesson=${encodeURIComponent(item.id)}` + `&child=${encodeURIComponent(child.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.auth_token,
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
        this.setState({ videos: assigned_videos, loading: false, progress: prog });

        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

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
        const data = this.state.data;
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
                        <ScrollView>
                            <FlatList
                                horizontal={true}
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
                    <View style={styles.content}>
                        <Text style={styles.text}>Assigned Lessons</Text>
                        <View style={{ flex: 1 }}>
                            {data.length > 0 &&
                            <ScrollView refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />}>
                                <FlatList
                                    data={this.state.data}
                                    renderItem={({ item }) =>
                                        <View style={styles.content}>
                                            {console.log("item in list", item)}
                                            <TouchableOpacity

                                                onPress={() => this.openModalWithItem(item)}>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <Text style={styles.textView}>
                                                        {item.lesson.lesson_name} - {Math.trunc(item.count * 100)}%</Text>
                                                </View>
                                                <ProgressLib.Bar progress={item.count} height={15} width={null}/>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                />
                                <Modal isVisible={this.state.isModalVisible}>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.header}>Lesson Progress</Text>
                                        <ScrollView>
                                            <FlatList
                                                data={this.state.videos}
                                                renderItem={({ item }) =>
                                                    <View
                                                        style={[!item.watched ? styles.contentNotComplete : styles.contentComplete]}>
                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            <Text style={[styles.text,{fontWeight:'bold', textAlign: 'left',padding: 0}]}>
                                                                {item.video.video_name}</Text>

                                                            <View style={styles.rightContainer}>
                                                                {item.reaction &&
                                                                <TouchableOpacity
                                                                    onPress={() => this.showToast(item.reaction)}>
                                                                    <Emoji name={emojiDict[item.reaction]} style={{ fontSize: 25 }}/>

                                                                </TouchableOpacity>
                                                                }
                                                                {item.bookmark &&
                                                                <Emoji name={'heart'} style={{ fontSize: 25 }}/>}
                                                            </View>
                                                        </View>
                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            {item.watched &&
                                                            <Text>Completed
                                                                on: {Date(item.date_completed).toString()}</Text>}
                                                                {!item.watched &&
                                                            <Text style={{color:'grey'}}>Not Completed</Text>}
                                                        </View>
                                                        <View style={{ flex: 1, flexDirection: 'row' , alignItems: 'center'}}>
                                                            {item.bookmark &&
                                                            <Text>Favourited!</Text>}
                                                        </View>
                                                    </View>
                                                }
                                            />
                                        </ScrollView>
                                        <Text
                                            style={styles.text}>Complete: {Math.trunc(this.state.progress * 100)}%</Text>
                                        <ProgressLib.Bar progress={parseFloat(this.state.progress)} height={20}
                                                         width={null}/>
                                        <Button buttonStyle={styles.button} onPress={this._toggleModal}
                                                title={"Close"}/>
                                    </View>
                                </Modal>
                            </ScrollView>}
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

export const { width, height } = Dimensions.get('window');
