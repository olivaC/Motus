import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    AsyncStorage,
    ScrollView,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Emoji from 'react-native-emoji';
import Toast, { DURATION } from 'react-native-easy-toast'


import styles from '../styles/styles';
import Modal from "react-native-modal";

const emojiDict = {
    'love': 'heart_eyes',
    'sad': 'cry',
    'relaxed': 'relaxed',
    'angry': 'rage',
    'surprised': 'hushed',
};

export default class ChildProgress extends Component {
    static navigationOptions = {
        title: 'Lessons',
    };

    fetchData = async () => {
        const child = this.props.navigation.getParam('child');
        let value = '';
        this.setState({ loading: true });
        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res })
        });
        let r = await fetch(this.state.url + "api/assigned_lesson_get/" + `?child=${encodeURIComponent(child.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
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
                    'Authorization': 'Token ' + value,
                },
            });

            let x = await r3.text();
            lessons[i]['count'] = parseFloat(x);
        }
        this.setState({ data: lessons });
    };


    async componentDidMount(): Promise<void> {
        this.fetchData().done()
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
            selectedLessons: [],
            isModalVisible: false,
            progress: '',
            counts: [],
            url: "http://204.209.76.235/"
        };
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().done();
        this.setState({ refreshing: false });
    }

    openModalWithItem = async (item) => {
        let value = '';
        await AsyncStorage.getItem('key').then((res) => {
            value = res;
        });
        console.log(item);
        const child = this.props.navigation.getParam('child');
        let r = await fetch(this.state.url + "api/assigned_videos/" + `?lesson=${encodeURIComponent(item.id)}` + `&child=${encodeURIComponent(child.id)}`, {
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
        this.setState({ videos: assigned_videos, loading: false, progress: prog });

        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    showToast(reaction) {
        this.refs.toast.show(reaction);
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.header}>Assigned Lessons</Text>
                    <View style={{ flex: 1 }}>
                        {this.state.data.length > 0 &&
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
                                                    {item.lesson.lesson_name} - {Math.trunc(item.count *100)}%</Text>
                                            </View>
                                            <Progress.Bar progress={item.count} height={15} width={null}/>
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
                                                        <Text style={[styles.header,{fontWeight:'bold'}]}>
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
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row' , alignItems: 'center'}}>
                                                        {item.bookmark &&
                                                        <Text>Favorited!</Text>}
                                                    </View>
                                                </View>
                                            }
                                        />
                                    </ScrollView>
                                    <Toast
                                        ref="toast"
                                        position='center'
                                    />
                                    <Text style={styles.text}>Complete: {Math.trunc(this.state.progress * 100)}%</Text>
                                    <Progress.Bar progress={parseFloat(this.state.progress)} height={20} width={null}/>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', margin: 10}}
                                        onPress={this._toggleModal}>
                                        <Text style={styles.greenButton}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </ScrollView>}
                        {this.state.data.length === 0 &&
                        <Text style={styles.header}>No lessons assigned</Text>}
                    </View>
                </View>
                
            </View>
        )
    }
}
