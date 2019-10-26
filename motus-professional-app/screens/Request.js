import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage, Alert, FlatList, ScrollView } from 'react-native';
import styles from '../styles/calendarStyle';
import { Icon } from 'react-native-elements';
import { Thumbnail, } from 'native-base';

/**
 * Displays requests appointment
 */

export default class Request extends Component {
    static navigationOptions = {
        title: 'Appointment Requests',
    };

    constructor(props) {
        super(props);

        this.state = {
            auth_token: '',
            id: '',
            loading: false,
            data: [],
            error: null,
            refreshing: false,
            status: '',
            selected: '',
            biometryType: null,
            accessControl: null,
            isDateTimePickerVisible: false,
            requests: [],
            month: '',
            url: "http://204.209.76.235/"
        };
    }

    async componentDidMount(): Promise<void> {
        const url = this.state.url + "api/appointment/";
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

        let appointment = await r.json();
        //console.log("REQUEST DATA", appointment);
        this.setState({ data: appointment });

        let dict = []

        for (var i = 0; i < this.state.data.length; i++) {
            let obj = this.state.data[i];
            let info = {}
            if (!obj.booked && obj.parent != null) {
                info.id = obj.id
                info.date = obj.date
                info.start_time = obj.start_time
                info.end_time = obj.end_time
                info.parent = obj.parent
                info.professional = obj.professional

                dict.push(info);
            }
        }
        this.setState({ requests: dict });
        //console.log("DISPLAY", this.state.requests)
    }

    state = {
        isDateTimePickerVisible: false,
        isDateEndTimePickerVisible: false,

    };

    render() {
        let requests = this.state.requests;
        //console.log('requests', requests);
        return (
            <View style={styles.container}>
                <ScrollView>
                    {requests.length !== 0 &&
                    <FlatList
                        data={this.state.requests}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <View style={{
                                marginHorizontal: 10,
                                padding: 5,
                                borderBottomWidth: 1,
                                borderBottomColor: '#b6b6b6'
                            }}>
                                <View style={{ flexDirection: "row", flex: 1, padding: 5, alignItems: 'center' }}>
                                    <Thumbnail source={{ uri: this.state.url + "parent_photo/" + item.parent.id + "/" }}/>
                                    <View style={{
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        width: "100%",
                                        paddingHorizontal: 10,
                                        flex: 1,
                                    }}>
                                        <Text style={{
                                            fontSize: 12,
                                            paddingBottom: 5
                                        }}>{item.parent.profile.first_name} {item.parent.profile.last_name} requests to
                                            book an appointment with you</Text>

                                        <View style={{ flexDirection: "row" }}>
                                            <Icon
                                                name='calendar'
                                                type='evilicon'
                                                color='grey'
                                            />
                                            <Text>{item.date}</Text>
                                        </View>

                                        <View style={{ flexDirection: "row" }}>
                                            <Icon
                                                name='clock'
                                                type='evilicon'
                                                color='grey'
                                            />
                                            <Text>{item.start_time} - {item.end_time}</Text>
                                        </View>

                                        <View style={{ flexDirection: "row", flex: 1, justifyContent: 'flex-start' }}>
                                            <TouchableOpacity
                                                style={styles.reButton}
                                                onPress={() => this.appointmentResponse({ item }, 'accept').done()}>
                                                <Text style={styles.rButtonText}>Accept</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.reButton, { backgroundColor: "#ED655A" }]}
                                                onPress={() => this.appointmentResponse({ item }, 'decline').done()}>
                                                <Text style={styles.rButtonText}>Decline</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </View>

                            </View>
                        }
                    />}
                    {requests.length === 0 &&
                    <View >
                        <Text style={styles.centerText}>No Requests!</Text>
                    </View>
                    }
                </ScrollView>
            </View>
        );
    }

    appointmentResponse = async (item, reply) => {
        const booking = item.item
        let parent = null
        let booked = false
        const url = this.state.url + "api/appointment/" + booking.id + "/";
        let value = '';
        console.log("Book", reply)

        if (reply === 'accept') {
            parent = booking.parent.id
            booked = true
        }

        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res });
        });

        if (booking) {
            this.setState({
                loading: true
            });
            const data = new FormData();
            data.append('professional', booking.professional);
            data.append('date', booking.date);
            data.append('start_time', booking.start_time);
            data.append('end_time', booking.end_time);
            data.append('parent', parent);
            data.append('booked', booked);

            fetch(url, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data;',
                    'Authorization': 'Token ' + value,
                },
                body: data
            }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson);
                Alert.alert(
                    'Motus Parent',
                    'Appointment ' + reply,
                    [
                        { text: 'OK', },
                    ],
                    { cancelable: false }
                );
            }).catch((error) => {
                // Error in Form
                console.log(error);
                alert('Error in booking appointment.')
            })
        } else {
            console.log("Eror no data")
        }
    };
}