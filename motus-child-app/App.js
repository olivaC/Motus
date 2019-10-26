/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Login from './screens/Login';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Favorites from './screens/Favorites';
import Support from './screens/Support';
import ChooseChild from './screens/ChooseChild';
import Videos from './screens/Videos';
import Edit from './screens/Edit';


// const NotLoggedIn = createStackNavigator(
//     {
//         LoginScreen: { screen: Login },
//         ChooseChildScreen: { screen: ChooseChild },
//         HomeScreen: { screen: Home },
//         ProfileScreen: { screen: Profile },
//         FavoritesScreen: { screen: Favorites },
//         SupportScreen: { screen: Support },
//     },
//     {
//         initialRouteName: 'LoginScreen',
//     }
// );

// const LoggedIn = createStackNavigator(
//     {
//         HomeScreen: { screen: Home },
//         LoginScreen: { screen: Login },
//         ChooseChildScreen: { screen: ChooseChild },
//         ProfileScreen: { screen: Profile },
//         FavoritesScreen: { screen: Favorites },
//         SupportScreen: { screen: Support },
//     },
//     {
//         initialRouteName: 'HomeScreen',
//     }
// );

const Bottom = createStackNavigator({
    HomeScreen: { screen: Home },
});

const Bottom2 = createStackNavigator({
    ProfileScreen: { screen: Profile },
});

const Bottom3 = createStackNavigator({
    FavoriteScreen: { screen: Favorites }
});

const Bottom4 = createStackNavigator({
    SupportScreen: { screen: Support },
});

const TabStack = createBottomTabNavigator(
    {
        HomeScreen: {
            screen: Bottom,
            navigationOptions: {
                tabBarLabel: 'Home',
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name={'home'}

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
                        color={tintColor}
                    />
                ),
            },
        },
        Favourite: {
            screen: Bottom3,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        name={'favorite'}
                        color={tintColor}
                    />
                ),
            },
        },
        // Support: {
        //     screen: Bottom4,
        //     navigationOptions: {
        //         tabBarIcon: ({ tintColor }) => (
        //             <Icon
        //                 name={'help'}
        //                 color={tintColor}
        //             />
        //         ),
        //     },
        // },
    }
);

TabStack.navigationOptions = {
    // Hide the header from root stack
    header: null,
};

const LoggedIn = createStackNavigator({
    LoginScreen: { screen: Login },
    ChooseChildScreen: { screen: ChooseChild },
    VideosScreen: { screen: Videos },
    EditScreen: { screen: Edit },
    Tabs: TabStack,

});

export default class App extends Component {

    // componentDidMount() {
    //     this.fetchData()
    // }
    //
    // fetchData() {
    //     AsyncStorage.getItem('first_name')
    //         .then((e) => {
    //             this.setState({ first_name: e, })
    //         });
    // }
    //
    // constructor(props) {
    //     super(props);
    //
    //     this.state = {
    //         first_name: '',
    //     };
    // }

    render() {
        return <LoggedIn/>;
        // if (this.state.first_name) {
        //     return <LoggedIn/>;
        // } else {
        //     return <NotLoggedIn/>;
        // }

    }
}


