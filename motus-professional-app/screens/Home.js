// Home screen

import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    FlatList,
    StatusBar,
    RefreshControl,
    Image,
} from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail, } from 'native-base';
import { AsyncStorage } from "react-native";
import styles from '../styles/home-styles';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Require cycle:']);

export default class Home extends Component {
    static navigationOptions = {
        title: 'Motus Professional',
        headerLeft: null,
    };

    async componentDidMount() {
        this.fetchData()
    }

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
            team: '',
            resources: '',
            lessons: '',
            appointment: '',
            error: null,
            refreshing: false,
            status: '',
            schedule: '',
            biometryType: null,
            accessControl: null,
            collapsed: false,//do not show the body by default
            collapsed2: false,//do not show the body by default
            url: "http://204.209.76.235/"
        };
    }

    fetchData = async () => {
        StatusBar.setNetworkActivityIndicatorVisible(true);
        const url = this.state.url + "api/professional/";
        const url2 = this.state.url + "api/support/";
        const url3 = this.state.url + "api/resource/";
        const url4 = this.state.url + "api/parent/";
        const url5 = this.state.url + "api/lessons/";
        const url6 = this.state.url + "api/appointment/";

        let value = '';

        await AsyncStorage.getItem('key').then((res) => {
            value = res
        });
        // console.log(value);

        let r1 = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let prof = await r1.json();
        // console.log(prof);
        let p = prof[0];
        let p2 = prof[0].profile;
        this.setState({
            email: p2.username,
            data: p,
            first_name: p2.first_name,
            last_name: p2.last_name,
            id: p.id,
        });

        await AsyncStorage.setItem('first_name', p2.first_name).done();
        await AsyncStorage.setItem('last_name', p2.last_name).done();
        await AsyncStorage.setItem('professional', JSON.stringify(p2));

        let r2 = await fetch(url2, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });

        let team = await r2.json();
        this.setState({ team: team });

        let r3 = await fetch(url3, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let resource = await r3.json();
        this.setState({ resources: resource });

        let r4 = await fetch(url4, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });
        let clients = await r4.json();
        // console.log(clients)
        this.setState({ clients: clients });

        let r5 = await fetch(url5, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });
        let lessons = await r5.json();
        // console.log(lessons);
        this.setState({ lessons: lessons });

        let r6 = await fetch(url6, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let appointment = await r6.json();
        //console.log("DATA", appointment);
        this.setState({ appointment: appointment });
        this.createSchedule();

        StatusBar.setNetworkActivityIndicatorVisible(false);
        return Promise.resolve();
    }

    state = {
        activeSections: [],
        collapsed: true,
        multipleSelect: false,
    };

    onPress(item) {
        console.log("CLIENT", item);
        this.props.navigation.navigate('ClientProfileScreen', { client: item })
    }

    createSchedule(data){
        let schedule = []
        let test = []
        let dt = new Date();
        console.log("TODAY DATE",dt)
        let start = this.startOfWeek(dt);
        let end = this.endOfWeek(dt);
        console.log("START",start);
        console.log("END", end)
        //console.log(this.state.appointment)
        for(let i = 0; i<this.state.appointment.length; i++){
            let obj = this.state.appointment[i];
            let d = obj.date;
            let parts = d.split("-")
            // create date object
            let d_obj = new Date(parts[0], parts[1]-1, parts[2])
            
            if( start <= d_obj && d_obj <= end && obj.booked){
                //console.log(parts[0], parts[1], parts[2])
                
                let d_obj2 = new Date(parts[0], parts[1]-1, parts[2])
                
                // day = d_obj.getDay();
                day = d_obj2.toLocaleString('en-us', {  weekday: 'long' })
                //console.log(day)
                schedule.push(day)

            }
            
        }
        // schedule.sort()
        const counts = {};
        schedule.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
        test.push(counts)
        console.log("MY SCHEDULE", counts)
        this.setState({schedule: test});
        //console.log("DONE",this.state.schedule)
    }

    /**
     * Get first day of the week sunday
     * https://www.w3resource.com/javascript-exercises/javascript-date-exercise-50.php
     * @param {*} date 
     */
    startOfWeek(date){
        // IF date.getDay === 0 use sunday
        let diff = date.getDate() - date.getDay();
        return new Date(date.setDate(diff));
 
    }

    /**
     * Get last day of the week saturday
     * @param {*} date 
     */
    endOfWeek(date){
        let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? +6 : 0);
  
        return new Date(date.setDate(diff));
 
    }

 
    /**
     * Refreshing data
     * RefreshControl from react native
     * How it works: drag the screen down to refresh screen
     */
    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData();
        this.setState({ refreshing: false });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />}>
                    <TouchableOpacity
                        onPress={() => this.setState({ collapsed: !this.state.collapsed })}>
                        <Text style={styles.welcome}>Home</Text>
                    </TouchableOpacity>

                    <Collapse>
                        <CollapseHeader style={styles.headerBorder}>
                            <Text style={styles.header}>Profile</Text>
                        </CollapseHeader>
                        <CollapseBody style={styles.bodyBorder}>
                            <View style={styles.profile}>
                                <Thumbnail square large
                                           source={{ uri: this.state.url + "professional_photo/" + this.state.id + "/" }}/>
                                <Text style={{
                                    padding: 3,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                }}>{this.state.first_name} {this.state.last_name}</Text>
                                <Text style={{fontSize: 10, color: '#4c4c4c'}}>Therapy Style</Text>
                                <Text style={styles.textUpper}>{this.state.data.therapy_style1}</Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.props.navigation.navigate('ProfileScreen')}>
                                    <Text style={styles.regText}> View </Text>
                                </TouchableOpacity>
                            </View>
                        </CollapseBody>
                    </Collapse>
                    <Collapse>
                        <CollapseHeader style={styles.headerBorder}>
                            <Text style={styles.header}>Clients</Text>
                        </CollapseHeader>
                        <CollapseBody style={styles.bodyBorder}>
                            <View style={styles.content}>
                                <ScrollView>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.clients}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) =>
                                        <View>
                                            {item === 0 &&
                                            <View style={{alignSelf:'center'}}>
                                                <Text>No Clients, add client below</Text>
                                            </View>}
                                            <TouchableOpacity onPress={() => this.onPress(item)}>
                                            <View style={{ padding: 5, alignItems: 'center' }}>
                                                <Image style={styles.client}
                                                    source={{ uri: this.state.url + "parent_photo/" + item.id + "/" }}/>
                                                <Text
                                                    style={styles.name}>{item.profile.first_name} {item.profile.last_name}</Text>
                                            </View>
                                            </TouchableOpacity>
                                        </View>
                                        }
                                    />
                                </ScrollView>
                                <View style={styles.row}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => this.props.navigation.navigate('ClientsScreen')}>
                                        <Text style={styles.regText}> View </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => this.props.navigation.navigate('CreateScreen')}>
                                        <Text style={styles.regText}> Add Client </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </CollapseBody>
                    </Collapse>

                    <Collapse>
                        <CollapseHeader style={styles.headerBorder}>
                            <Text style={styles.header}>Appointments</Text>
                        </CollapseHeader>
                        <CollapseBody style={styles.bodyBorder}>
                            <View style={[styles.content, {padding: 2}]}>
                                <Text style={styles.textUpper}>Upcoming Appointments For
                                    This Week</Text>
                                <ScrollView>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.schedule}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                    <View>
                                        <View style={styles.row}>
                                            <View style={styles.week}>
                                                <Text style={{color: 'white'}}>S</Text>
                                                <Text style={styles.week_num}>{item.Sunday}</Text>
                                            </View>

                                            <View style={styles.week}>
                                                <Text style={{color: 'white'}}>M</Text>
                                                <Text style={styles.week_num}>{item.Monday}</Text>
                                            </View>

                                            <View style={styles.week}>
                                                <Text style={{color: 'white'}}>T</Text>
                                                <Text style={styles.week_num}>{item.Tuesday}</Text>
                                            </View>

                                            <View style={styles.week}>
                                                <Text style={{color: 'white'}}>W</Text>
                                                <Text style={styles.week_num}>{item.Wednesday}</Text>
                                            </View>

                                            <View style={styles.week}>
                                                <Text style={{color: 'white'}}>Th</Text>
                                                <Text style={styles.week_num}>{item.Thursday}</Text>
                                            </View>

                                            <View style={styles.week}>
                                                <Text style={{color: 'white'}}>F</Text>
                                                <Text style={styles.week_num}>{item.Friday}</Text>
                                            </View>

                                            <View style={styles.week}>
                                                <Text style={{color: 'white'}}>Sa</Text>
                                                <Text style={styles.week_num}>{item.Saturday}</Text>
                                            </View>

                                        </View>
                                    </View>
                                    }
                                />
                            </ScrollView>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.props.navigation.navigate('CalendarScreen')}>
                                    <Text style={styles.regText}> View Appointments </Text>
                                </TouchableOpacity>
                            </View>
                        </CollapseBody>
                    </Collapse>

                    <Collapse>
                        <CollapseHeader style={styles.headerBorder}>
                            <Text style={styles.header}>Lessons</Text>
                        </CollapseHeader>
                        <CollapseBody style={styles.bodyBorder}>
                            <View style={styles.content}>
                                <ScrollView>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.lessons}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity
                                                style={{ padding: 10}}
                                                onPress={() => this.props.navigation.navigate('VideosScreen', { lesson: item })}>
                                                <Image style={styles.squareImage}
                                                    source={{ uri: this.state.url + "lesson_photo/" + item.id + "/" }}/>
                                                <Text
                                                    style={styles.greyText}>{item.lesson_name}</Text>
                                            </TouchableOpacity>
                                        }
                                    />
                                </ScrollView>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.props.navigation.navigate('LessonsScreen')}>
                                    <Text style={styles.regText}>View Lessons</Text>
                                </TouchableOpacity>
                            </View>
                        </CollapseBody>
                    </Collapse>

                    <Collapse>
                        <CollapseHeader style={styles.headerBorder}>
                            <Text style={styles.header}>Academic Resources</Text>
                        </CollapseHeader>
                        <CollapseBody style={styles.bodyBorder}>
                            <View style={styles.content}>
                                <Text style={styles.textNormal}>Based on what you
                                    like...</Text>
                                <ScrollView>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.resources}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) =>
                                            <View style={styles.resourcesContent}>
                                                <Image style={styles.imageView}
                                                       source={{ uri: this.state.url + "resource_photo/" + item.id + "/" }}/>
                                                <View style={styles.textContent}>
                                                    <Text style={styles.title}>{item.name}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => this.props.navigation.navigate('PdfScreen', { item })}>
                                                        <View style={styles.rButton}>
                                                            <Text style={styles.rButtonText}>LEARN MORE</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        }
                                    />
                                </ScrollView>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.props.navigation.navigate('ResourcesScreen')}>
                                    <Text style={styles.regText}>View More</Text>
                                </TouchableOpacity>
                            </View>
                        </CollapseBody>
                    </Collapse>

                    <Collapse>
                        <CollapseHeader style={styles.headerBorder}>
                            <Text style={styles.header}>Support & Contacts</Text>
                        </CollapseHeader>
                        <CollapseBody style={styles.bodyBorder}>
                            <View style={styles.content}>
                                <ScrollView>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.team}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) =>
                                            <View style={{padding: 5, alignItems: "center" }}>
                                                <Image
                                                    style={styles.squareImage}
                                                    source={{ uri: this.state.url + "support_photo/" + item.id + "/" }}/>
                                                <View style={{backgroundColor: 'white', padding: 5, alignItems: 'center'}}>
                                                    <Text style={[styles.textUpper,{fontWeight:'bold'}]}>{item.name}</Text>
                                                    <Text style={styles.greyText}>{item.position}</Text>
                                                </View>
                                            </View>
                                        }
                                    />
                                </ScrollView>

                                <View style={styles.row}>
                                    <Text>CONNECT WITH US </Text>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => this.props.navigation.navigate('SupportScreen')}>
                                        <Text style={styles.regText}>Expand</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </CollapseBody>
                    </Collapse>
                </ScrollView>
            </View>
        );
    }
}