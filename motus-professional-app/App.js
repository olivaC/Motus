/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import OneSignal from 'react-native-onesignal'; // Import package from node modules


import Login from './screens/Login';
import Home from './screens/Home';
import Signup from './screens/Signup';
import CreateClient from './screens/CreateClient';
import Clients from './screens/Clients';
import Profile from './screens/Profile';
import Support from './screens/Support';
import EditProfile from './screens/EditProfile';
import Resources from './screens/Resources';
import PdfScreen from './screens/Pdf';
import ClientProfile from './screens/ClientProfile';
import Calendar from './screens/Calendar';
import TimeSlot from './screens/TimeSlot';
import Request from './screens/Request';
import Lessons from './screens/Lessons';
import Videos from './screens/Videos';
import WatchVideo from './screens/WatchVideo';
import ChildProfile from './screens/ChildProfile';
import AssignLessons from './screens/AssignLessons';
import Createchild from './screens/CreateChild';
import ChildProgress from './screens/ChildProgress';
import ActivityLog from './screens/ActivityLog';

const NotLoggedIn = createStackNavigator({
        LoginScreen: { screen: Login },
        HomeScreen: { screen: Home },
        ProfileScreen: { screen: Profile },
        SignupScreen: { screen: Signup },
        CreateScreen: { screen: CreateClient },
        ClientsScreen: { screen: Clients },
        SupportScreen: { screen: Support },
        EditProfileScreen: { screen: EditProfile },
        ResourcesScreen: { screen: Resources },
        PdfScreen: { screen: PdfScreen },
        ClientProfileScreen: { screen: ClientProfile },
        CalendarScreen: { screen: Calendar },
        TimeSlot: { screen: TimeSlot },
        LessonsScreen: { screen: Lessons },
        VideosScreen: { screen: Videos },
        WatchVideoScreen: { screen: WatchVideo },
        ChildProfileScreen: { screen: ChildProfile },
        AssignLessonsScreen: { screen: AssignLessons },
        CreateChildScreen: { screen: Createchild },
        RequestScreen: { screen: Request },
        ChildProgressScreen: { screen: ChildProgress },
        ActivityLogScreen: {screen: ActivityLog}

    },
    {
        initialRouteName: 'LoginScreen'
    });

const LoggedIn = createStackNavigator({
        HomeScreen: { screen: Home },
        ProfileScreen: { screen: Profile },
        SignupScreen: { screen: Signup },
        CreateScreen: { screen: CreateClient },
        ClientsScreen: { screen: Clients },
        SupportScreen: { screen: Support },
        EditProfileScreen: { screen: EditProfile },
        ResourcesScreen: { screen: Resources },
        PdfScreen: { screen: PdfScreen },
        LoginScreen: { screen: Login },
        ClientProfileScreen: { screen: ClientProfile },
        CalendarScreen: { screen: Calendar },
        TimeSlot: { screen: TimeSlot },
        LessonsScreen: { screen: Lessons },
        VideosScreen: { screen: Videos },
        WatchVideoScreen: { screen: WatchVideo },
        ChildProfileScreen: { screen: ChildProfile },
        AssignLessonsScreen: { screen: AssignLessons },
        CreateChildScreen: { screen: Createchild },
        RequestScreen: { screen: Request },
        ChildProgressScreen: { screen: ChildProgress },
        ActivityLogScreen: {screen: ActivityLog},

    },
    {
        initialRouteName: 'HomeScreen'
    });


export default class App extends Component {

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        AsyncStorage.getItem('first_name')
            .then((e) => {
                this.setState({ first_name: e, })
            });
    }

    constructor(props) {
        super(props);
        OneSignal.init("8df62ee5-7042-473b-9a5e-a5856718dda5");

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);

        this.state = {
            first_name: '',
        };
    }

    render() {
        if (this.state.first_name) {
            return <LoggedIn/>;
        } else {
            return <NotLoggedIn/>;
        }

    }
}
