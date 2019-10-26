import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    RefreshControl,
    FlatList,
    Button,
    YellowBox,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { AsyncStorage } from "react-native"
import styles from '../styles/styles';

YellowBox.ignoreWarnings(['VirtualizedList:']);


export default class Home extends Component {
    static navigationOptions = {
        title: 'Home',
        headerLeft: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            auth_token: '',
            loading: true,
            data: '',
            lessons: [],
            error: null,
            status: '',
            id: '',
            biometryType: null,
            accessControl: null,
            refreshing: false,
            url: "http://204.209.76.235/"
        };
    }

    async componentDidMount(): Promise<void> {
        this.setState({ loading: true });
        const key = this.props.navigation.getParam('key');
        const child = this.props.navigation.getParam('child');
        let value = '';
        let child_id = '';
        if (key && child) {
            console.log("HOME: LOGIN get key and child");
            let r = await fetch(this.state.url + "api/assigned_lesson_get/" + `?child=${encodeURIComponent(child.id)}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + key,
                }
            });

            let lessons = await r.json();
            console.log(lessons);

            this.setState({
                auth_token: key,
                data: child,
                first_name: child.first_name,
                last_name: child.last_name,
                lessons: lessons,
                id: child.id,
            })
        } else {
            console.log("HOME: refresh No key and no child")
            await AsyncStorage.getItem('key').then((res) => {
                value = res
            });
            await AsyncStorage.getItem('id').then((res) => {
                child_id = res
            });

            let r1 = await fetch(this.state.url + "api/child/" + child_id + "/", {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + value,
                }
            });
            let child = await r1.json();
            let r = await fetch(this.state.url + "api/assigned_lesson_get/" + `?child=${encodeURIComponent(child_id)}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + value,
                }
            });

            let lessons = await r.json();
            console.log(child);
            this.setState({
                data: child,
                first_name: child.first_name,
                last_name: child.last_name,
                lessons: lessons,
                id: child.id,
            });
            AsyncStorage.setItem('data', JSON.stringify(child)).done();
            AsyncStorage.setItem('first_name', child.first_name).done();
            AsyncStorage.setItem('last_name', child.last_name).done();
        }
        this.setState({ loading: false })
    }

    fetchData = async () => {
        console.log("HOME: THIS REFRESH ANY CHANGES")
        const { params } = this.props.navigation.state;
        let value = '';
        let child_id = '';
        await AsyncStorage.getItem('key').then((res) => {
            value = res
        });
        await AsyncStorage.getItem('id').then((res) => {
            child_id = res
        });
        let r1 = await fetch(this.state.url + "api/child/" + child_id + "/", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let child = await r1.json();

        let r = await fetch(this.state.url + "api/assigned_lesson_get/" + `?child=${encodeURIComponent(child_id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let lessons = await r.json();
        console.log(child);
        this.setState({
            data: child,
            first_name: child.first_name,
            last_name: child.last_name,
            lessons: lessons,
            id: child.id,
        });
        AsyncStorage.setItem('data', JSON.stringify(child)).done();
        AsyncStorage.setItem('first_name', child.first_name).done();
        AsyncStorage.setItem('last_name', child.last_name).done();
        this.forceUpdate();
    };

    /**
     * Refreshing data
     * RefreshControl from react native
     * How it works: drag the screen down to refresh screen
     */
    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().done();
        this.forceUpdate();
        this.setState({ refreshing: false });
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Loading data...</Text>
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
                    <View style={{ padding: 5, }}>
                        {/* <Text style={styles.text}>Hello, {this.state.first_name} {this.state.last_name} </Text> */}
                        <Text style={styles.lessonHeading}>LESSONS</Text>
                    </View>
                    <View style={styles.content}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />}>
                            {this.state.lessons.length > 0 &&
                            <FlatList
                                numColumns={2}
                                data={this.state.lessons}
                                renderItem={({ item }) =>
                                        
                                        <TouchableOpacity
                                            style={styles.boxContainer}
                                            onPress={() => this.props.navigation.navigate('VideosScreen', {
                                                lesson: item,
                                                child: this.state.data
                                            })}
                                            
                                        >
                                        <Image style={styles.imageSquare}
                                               source={{ uri: this.state.url + "lesson_photo/" + item.lesson.id + "/" }}/>
                                        <View style={styles.item}>
                                            <Text style={{fontWeight:'bold',textTransform: 'uppercase', fontSize: 12}}> {item.lesson.lesson_name}</Text>
                                        </View>
                                           
                                        
                                        </TouchableOpacity>
                                }
                            />
                            }
                            {this.state.lessons.length === 0 &&
                            <Text style={styles.header}>No lessons assigned</Text>}
                        </ScrollView>
                    </View>
                </View>

            );
        }
    }
}