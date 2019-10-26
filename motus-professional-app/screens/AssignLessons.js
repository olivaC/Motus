import React, { Component } from 'react';
import {
    View,
    Text,
    AsyncStorage,
    ScrollView,
    FlatList,
    TouchableOpacity, StatusBar, Alert
} from 'react-native';
import SelectMultiple from 'react-native-select-multiple'
import { Thumbnail, } from 'native-base';
import styles from '../styles/styles';

export default class AssignLessons extends Component {
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
        this.setState({ data: lessons });
        console.log(lessons);

        let r2 = await fetch(this.state.url + "api/unassigned_lesson/" + `?child=${encodeURIComponent(child.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let lessons2 = await r2.json();

        console.log("lessons2", lessons2);
        let stuff = [];
        if (lessons2.length > 0) {
            for (let i in lessons2) {
                let item = lessons2[i];
                stuff.push({
                    label: item.lesson_name,
                    value: item
                })
            }

            this.setState({ unassignedLessons: stuff, loading: false })
        }
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
            unassignedLessons: [],
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            selectedLessons: [],
            url: "http://204.209.76.235/"
        };
    }

    assignLessonPost = async () => {
        const url = this.state.url + "api/assigned_lesson_post/";
        const child = this.props.navigation.getParam('child');
        const selected = this.state.selectedLessons;
        let key = '';
        this.setState({ loading: true });
        StatusBar.setNetworkActivityIndicatorVisible(true);
        await AsyncStorage.getItem('key').then((res) => {
            key = res
        });
        if (selected.length > 0) {
            for (let i in selected) {
                let item = selected[i];
                console.log(item.value);
                const data = new FormData();
                data.append('child', child);
                data.append('lesson', item.value);
                console.log(data);
                fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + key,
                    },
                    body: JSON.stringify(data)
                }).then((response) => response.json()).then((responseJson) => {
                    console.log(responseJson);
                }).catch((error) => {
                    // Error in Form
                    console.log(error);
                    alert('Error in assigning lesson.')
                })
            }
            StatusBar.setNetworkActivityIndicatorVisible(false);
            Alert.alert(
                'Motus Professional',
                'Lessons Assigned!',
                [
                    { text: 'OK', onPress: () => this.props.navigation.navigate('ChildProfileScreen') },
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert(
                'Motus Professional',
                'No lessons selected!',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }
    };


    onSelectionsChange = (selectedLesson) => {
        // selectedLesson is array of { label, value }
        this.setState({ selectedLessons: selectedLesson });
        console.log(selectedLesson);
    };


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

        const unassigned = this.state.unassignedLessons;
        
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.header}>Assigned Lessons</Text>
                    <View style={{ flex: 1 }}>
                        {this.state.data.length > 0 &&
                        <ScrollView>
                            <FlatList
                                numColumns={3}
                                data={this.state.data}
                                renderItem={({ item }) =>
                                    <View style={{ flex: 1, margin:5 }}>
                                        <Thumbnail square large
                                            source={{ uri: this.state.url + "lesson_photo/" + item.lesson.id + "/" }}/>
                                        <Text style={{fontSize: 12, textTransform: 'uppercase', color: '#000'}}>
                                            {item.lesson.lesson_name}</Text>
                                    </View>
                                }
                            />
                        </ScrollView>}
                        {this.state.data.length === 0 &&
                        <Text style={styles.header}>No lessons assigned</Text>}


                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.header}>Unassigned Lessons</Text>
                    {unassigned.length > 0 &&
                    <SelectMultiple
                        items={unassigned}
                        selectedItems={this.state.selectedLessons}
                        onSelectionsChange={this.onSelectionsChange}/>}
                    {unassigned.length > 0 &&
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.assignLessonPost()}>
                        <Text>Assign Lessons</Text>
                    </TouchableOpacity>}
                    {unassigned.length === 0 &&
                    <Text style={styles.header}>All available lessons assigned</Text>}
                </View>
            </View>
        )
    }
}
