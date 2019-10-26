import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    YellowBox,
    TextInput,
} from 'react-native';
import styles from '../styles/mainStyles';
import { Thumbnail } from "native-base";
import { Agenda } from 'react-native-calendars';
import Modal from "react-native-modal";
import Emoji from 'react-native-emoji';

const emojiDict = {
    'love': 'heart_eyes',
    'sad': 'cry',
    'relaxed': 'relaxed',
    'angry': 'rage',
    'surprised': 'hushed',
};

YellowBox.ignoreWarnings(['Require cycle:', 'VirtualizedList']);

console._errorOriginal = console.error.bind(console);
console.error = () => {};


export default class Log extends Component {
    static navigationOptions = {
        title: 'Child Log',
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
            error: null,
            refreshing: false,
            biometryType: null,
            accessControl: null,
            items: {},
            month: '',
            isModalVisible: false,
            text: '',
            diary_item: '',
            url: "http://204.209.76.235/"
        };
        this.onDayPress = this.onDayPress.bind(this);
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    openModalWithItem = async (item) => {

        this.setState({ diary_item: item })
        console.log('diary', item)
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.setState({ text: item.entry })
    }


    componentDidMount()  {
        this.fetchData().done()
    }

    fetchData = async () => {
        const url = this.state.url + "api/parent/";
        let value = '';
        const today = new Date();
        const mm = today.getMonth() + 1; //January is 0!

        if (mm < 10) {
            mm = '0' + mm
        }

        this.getMonthName(mm);

        await AsyncStorage.getItem('key').then((res) => {
            value = res;
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

        let chi = await fetch(this.state.url + "api/parent_log/" + `?parent=${encodeURIComponent(parent[0].id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let children = await chi.json();
        console.log('log videos', children);
        this.setState({ children: children, parent: parent[0], auth_token: value });

    };

    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().done();
        this.setState({ refreshing: false });
    }

    onDayPress(day) {
        this.getMonthName(day.month);
        this.setState({
            selected: day.dateString
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ alignSelf: 'center', padding: 5 }}>{this.state.month}</Text>
                <Agenda
                    pastScrollRange={12}
                    futureScrollRange={12}
                    theme={{
                        textSectionTitleColor: 'black',
                        selectedDayBackgroundColor: '#00adf5',
                        todayTextColor: '#2196F3',
                        arrowColor: '#2196F3',
                        dotColor: '#00adf5',
                    }}
                    onDayPress={this.onDayPress}
                    hideExtraDays
                    onRefresh={() => console.log('refreshing...')}
                    // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
                    refreshControl={null}
                    markedDates={this.state.marked}
                    // callback that gets called when items for a certain month should be loaded (month became visible)
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    renderEmptyData={() => this.renderEmptyDate()}
                    onDayChange={(date) => {
                        this.getMonthName(date.month);
                    }}
                />
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            <Text style={{ alignSelf: 'center', padding: 10 }}>Add Note</Text>
                            <TextInput
                                style={{ borderWidth: 1, height: 250, borderColor: 'grey', padding: 5 }}
                                editable={true}
                                multiline={true}
                                numberOfLines={10}
                                maxLength={100}
                                placeholder="max 100 characters"
                                onChangeText={(text) => this.setState({ text })}
                                value={this.state.text}
                            />
                            <TouchableOpacity
                                style={{ alignItems: 'center', margin: 5, padding: 5 }}
                                onPress={() => this.onCreate(this.state.diary_item)}>
                                <Text style={styles.greenButton}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={this._toggleModal}>
                                <Text style={[styles.greenButton, { backgroundColor: 'grey' }]}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        )
    }

    loadItems(day) {
        console.log("WORK WITH ", this.state.children)
        if(this.state.children != null){
        setTimeout(() => {
            console.log("WORK WITH YARRR", this.state.children)
            let dict = []
            console.log("not here")
            for (let i = 0; i < this.state.children.length; i++) {
                let obj = this.state.children[i];
                let reaction = ""

                if (obj.reaction != null) {
                    reaction = obj.reaction
                }

                if (obj.date_completed != null) {
                    //console.log("Completed date", i , obj.date_completed)
                    let d = obj.date_completed;
                    d = d.split('T')[0];
                    if (!this.state.items[d]) {
                        this.state.items[d] = [];
                        this.state.items[d].push({
                            id: obj.id,
                            date: d,
                            bookmark: false,
                            video: obj.video.video_name,
                            reaction: reaction,
                            child_name: obj.child.first_name,
                            image: obj.child.picture,
                            type: "Video Completed",
                            lesson_id: obj.assigned_lesson,
                            child: obj.child.id,
                            entry: obj.diary_entry,
                        });
                    } else {

                        x = this.state.items[d];
                        append = true

                        //check if start date exists
                        for (let j = 0; j < x.length; j++) {
                            // console.log(j, x[j].start);
                            if (obj.id == x[j].id) {
                                // console.log("MATCH", obj.start_time);
                                append = false;
                            }
                        }

                        if (append) {
                            this.state.items[d].push({
                                id: obj.id,
                                date: d,
                                bookmark: false,
                                video: obj.video.video_name,
                                reaction: '',
                                child_name: obj.child.first_name,
                                image: obj.child.picture,
                                type: "Video Completed",
                                lesson_id: obj.assigned_lesson,
                                child: obj.child.id,
                                entry: obj.diary_entry,
                            });
                        }
                    }
                }

                if (obj.reaction_date != null) {
                    let d = obj.reaction_date;
                    d = d.split('T')[0];
                    console.log(i, "REACTION Date", d)
                    if (!this.state.items[d]) {
                        this.state.items[d] = [];
                        this.state.items[d].push({
                            id: obj.id,
                            date: d,
                            bookmark: false,
                            video: obj.video.video_name,
                            reaction: reaction,
                            child_name: obj.child.first_name,
                            image: obj.child.picture,
                            type: "Reaction Added",
                            lesson_id: obj.assigned_lesson,
                            child: obj.child.id,
                            entry: obj.diary_entry,
                        });
                    } else {
                        x = this.state.items[d];
                        append = true

                        //check if start date exists
                        for (let j = 0; j < x.length; j++) {
                            // console.log(j, x[j].start);
                            if (obj.id == x[j].id) {
                                // console.log("MATCH", obj.start_time);
                                append = false;
                            }
                        }
                        if (append) {
                            this.state.items[d].push({
                                id: obj.id,
                                date: d,
                                bookmark: false,
                                video: obj.video.video_name,
                                reaction: reaction,
                                child_name: obj.child.first_name,
                                image: obj.child.picture,
                                type: "Reaction Added",
                                lesson_id: obj.assigned_lesson,
                                child: obj.child.id,
                                entry: obj.diary_entry,
                            });
                        }

                    }
                }

                if (obj.bookmark_date != null) {
                    let d = obj.bookmark_date;
                    d = d.split('T')[0];
                    console.log(i, "BOOK Date", d)
                    if (!this.state.items[d]) {
                        this.state.items[d] = [];
                        this.state.items[d].push({
                            id: obj.id,
                            date: d,
                            bookmark: obj.bookmark,
                            video: obj.video.video_name,
                            reaction: '',
                            child_name: obj.child.first_name,
                            image: obj.child.picture,
                            type: "Video favorited",
                            lesson_id: obj.assigned_lesson,
                            child: obj.child.id,
                            entry: obj.diary_entry,
                        });
                    } else {
                        x = this.state.items[d];
                        append = true

                        //check if start date exists
                        for (let j = 0; j < x.length; j++) {
                            // console.log(j, x[j].start);
                            if (obj.id == x[j].id) {
                                // console.log("MATCH", obj.start_time);
                                append = false;
                            }
                        }
                        if (append) {
                            this.state.items[d].push({
                                id: obj.id,
                                date: d,
                                bookmark: obj.bookmark,
                                video: obj.video.video_name,
                                reaction: '',
                                child_name: obj.child.first_name,
                                image: obj.child.picture,
                                type: "Video favorited",
                                lesson_id: obj.assigned_lesson,
                                child: obj.child.id,
                                entry: obj.diary_entry,
                            });
                        }

                    }
                }
            }

            console.log("DISPLAY", this.state.items)
            const newItems = {};
            Object.keys(this.state.items).forEach(key => {
                newItems[key] = this.state.items[key];
            });
            this.setState({
                items: newItems
            });

        }, 1000);
    }
    }

    renderItem(item) {
        return (
            <View style={{ padding: 10, backgroundColor: 'white', margin: 10, height: 170 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: "flex-start", padding: 5 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ letterSpacing: 1, textTransform: 'uppercase' }}>{item.type}</Text>
                        <Text style={{ paddingBottom: 5, letterSpacing: 1, }}>{item.child_name}</Text>

                        <Text style={{ fontSize: 13 }}>Video name: {item.video}</Text>
                        <View style={{flexDirection:'row'}}>
                            {item.reaction !== "" && <Emoji name={emojiDict[item.reaction]} style={{ fontSize: 20 }}
                            />}
                            {item.bookmark  && <Emoji name={"heart"} style={{ fontSize: 20 }}
                            />}
                        </View>
                        
                        {item.entry.length > 0 &&
                        <TouchableOpacity
                            style={{ justifyContent: 'flex-end', flex: 1, alignSelf: 'baseline' }}
                            onPress={() => this.openModalWithItem(item)}>
                            <Text style={styles.greenButton}>Edit Note</Text>
                        </TouchableOpacity>
                        }
                        {item.entry.length == 0 &&
                        <TouchableOpacity
                            style={{ justifyContent: 'flex-end', flex: 1, alignSelf: 'baseline' }}
                            onPress={() => this.openModalWithItem(item)}>
                            <Text style={styles.greenButton}>Add Note</Text>
                        </TouchableOpacity>
                        }

                    </View>
                    <View style={[styles.rightContainer, { flex: 0 }]}>
                        <Thumbnail source={{ uri: this.state.url + "child_photo/" + item.child + "/" }}/>
                    </View>
                </View>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={{ padding: 10, alignItems: 'center' }}><Text>No activity on this date</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    getMonthName(date) {
        const month = date - 1;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        this.setState({ month: monthNames[month], showMonth: true });
    }

    onCreate = async (item) => {

        // const url = this.state.url + "api/appointment/" + booking.app_id + "/";
        // let value = '';
        console.log('diary_item', this.state.diary_item)

        const key = this.state.auth_token;
        const text = this.state.text;
        const data = new FormData();
        data.append('diary_entry', text);
        fetch(this.state.url + "api/diary_entry/" + item.id + `/?lesson=${encodeURIComponent(item.lesson_id)}` + `&child=${encodeURIComponent(item.child)}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + key,
            },
            body: JSON.stringify(data)
        }).then((response) => response.text()).then((responseJson) => {
            console.log('reaction:', responseJson);
            let x = responseJson;
            this._toggleModal()
        }).catch((error) => {
            // Error in Form
            console.log(error);
            alert('Error in sending reaction.')
        });
    };
}