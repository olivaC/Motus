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
    FlatList
} from 'react-native';
import { Thumbnail, } from 'native-base';
import styles from '../styles/styles';

/**
 * This class is the Mental health professionals profile page.
 */
export default class ChildProfile extends Component {
    static navigationOptions = {
        title: 'Child',
    };

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            auth_token: '',
            id: '',
            first_name: '',
            last_name: '',
            loading: false,
            data: '',
            children: '',
            lessons: '',
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            url: "http://204.209.76.235/"
        };
    }

    async componentDidMount() {
        const child = this.props.navigation.getParam('child');

        this.setState({
            first_name: child.first_name,
            last_name: child.last_name,
            data: child,
            id: child.id,

        })

        // this.fetchData().done()
    }


    fetchData = async () => {
        const url = this.state.url + "api/child/" + this.state.id + "/";
        let value = '';
        await AsyncStorage.getItem('key').then((res) => {
            value = res
        });

        let r = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let child = await r.json();
        console.log(child);
        this.setState({ data: child });

        StatusBar.setNetworkActivityIndicatorVisible(false);
        return Promise.resolve();
    };


    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().done();
        this.setState({ refreshing: false });
    }


    onPress() {
        const child = this.props.navigation.getParam('child');
        this.props.navigation.navigate('AssignLessonsScreen', { client: child })
    }

    render() {
        // console.log(this.state.data);
        const child = this.props.navigation.getParam('child');

        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />}>
                    <View style={{ flex: 1, padding: 20, }}>
                        <View style={styles.content}>
                            <Image style={styles.imageContainer}
                                   source={{ uri: this.state.url + "child_photo/" + child.id + "/" }}/>
                            <Text style={styles.header}>{this.state.first_name} {this.state.last_name}</Text>
                            <Text style={{ alignSelf: 'center', }}>Age: {child.age}</Text>
                        </View>
                        {child.last_login_time &&
                        <View style={styles.content}>
                            <Text style={{ alignSelf: 'center', }}>Last
                                login: {Date(child.last_login_time).toString()}</Text>
                        </View>}
                        {!child.last_login_time &&
                        <View style={styles.content}>
                            <Text style={{ alignSelf: 'center', }}>
                                {child.first_name} hasn't logged into the Motus application yet.</Text>
                        </View>}

                        <View style={styles.content}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate('AssignLessonsScreen', { child: child })}>
                                <Text>Assign Lessons</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate('ChildProgressScreen', { child: child })}>
                                <Text>View Progress</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}



