/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import OneSignal from 'react-native-onesignal'; // Import package from node modules


import Login from './screens/Login';
import Home from './screens/Home';
import Statistics from './screens/Statistics';
import Favorites from './screens/Favorites';
import Resources from './screens/Resources';
import Contact from './screens/Contact';
import Profile from './screens/Profile';
import Support from './screens/Support';
import EditProfile from './screens/EditProfile';
import PdfScreen from './screens/Pdf';
import Log from './screens/Log';
import Progress from './screens/Progress';
import { Icon } from 'react-native-elements';


const Bottom = createStackNavigator({
    HomeScreen: { screen: Home },
    StatisticsScreen: { screen: Statistics },
    FavoritesScreen: { screen: Favorites },
    ResourcesScreen: { screen: Resources },
    PdfScreen: { screen: PdfScreen },
    ContactScreen: { screen: Contact },
    ProgressScreen: { screen: Progress },

});

const Bottom2 = createStackNavigator({
    ProfileScreen: { screen: Profile },
    EditProfileScreen: { screen: EditProfile },

});

const Bottom3 = createStackNavigator({
    LogScreen: { screen: Log }
});

const Bottom4 = createStackNavigator({
    SupportScreen: { screen: Support },
});

const TabStack = createBottomTabNavigator(
    {
        Home: {
            screen: Bottom,
            navigationOptions: {
                tabBarLabel: 'Home',
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name={'home'}
                        size={17}
                        color={tintColor}
                    />
                ),
            },
        },
        Profile: {
            screen: Bottom2,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name={'person'}
                        size={17}
                        color={tintColor}
                    />
                ),
            },
        },
        Log: {
            screen: Bottom3,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name={'book'}
                        size={17}
                        color={tintColor}
                    />
                ),
            },
        },
        Support: {
            screen: Bottom4,
            navigationOptions: {
                tabBarLabel: 'Contact',
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name={'help'}
                        size={17}
                        color={tintColor}
                    />
                ),
            },
        },
    }
);

TabStack.navigationOptions = {
    // Hide the header from root stack
    header: null,
};

const RootStack = createStackNavigator({
    LoginScreen: { screen: Login },
    Tabs: TabStack,
})


export default class App extends Component {

    constructor(properties) {
        super(properties);
        OneSignal.init("5c019fbb-2060-4db4-ae94-61cacdca49da");

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
    }

    onIds(device) {
        console.log('Device info: ', device);
    }


    render() {
        return (
            <RootStack/>
        );
    }
}

