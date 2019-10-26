import React, { Component } from 'react';
import {
    View,
    Text,
    AsyncStorage,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    Alert,
} from 'react-native';
import styles from '../styles/calendarStyle';
import { Icon } from 'react-native-elements'
import { Agenda } from 'react-native-calendars';
import { Thumbnail, } from 'native-base';

/**
 * Create Appointments in the application
 * https://github.com/wix/react-native-calendars
 */
export default class Calendar extends Component {

    static navigationOptions = {
        title: 'Appointments',
    };

    constructor(props) {
        super(props);

        this.state = {
            auth_token: '',
            id: '',
            loading: false,
            data: [],
            error: null,
            status: '',
            selected: '',
            biometryType: null,
            accessControl: null,
            refreshing: false,
            marked: {},
            items2: {},
            dateObject: {},
            month: '',
            re_num: 1,
            url: "http://204.209.76.235/"
        };
        this.onDayPress = this.onDayPress.bind(this);
    }

    async componentDidMount() {
        this.fetchData().done;
    }

    fetchData = async () => {
        const url = this.state.url + "api/appointment/";
        let value = '';
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        const date = `${yyyy}-${mm}-${dd}`;
        this.getMonthName(mm);

        this.setState({
            selected: date,
        });

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
        console.log("DATA", appointment);
        this.setState({ data: appointment });

        // get request number
        let request_num = 0;

        for (var i = 0; i < this.state.data.length; i++) {
            let obj = this.state.data[i];
            if (!obj.booked && obj.parent != null) {
                request_num += 1;
            }
        }
        this.setState({ re_num: request_num });
    }

    refreshData() {
        for (let i = 0; i < this.state.data.length; i++) {
            let obj = this.state.data[i];
            let parent_name = "No appointment";
            let image = "None";
            console.log("THE OBJ", i ,obj, obj.booked, obj.parent)
            // get booked appointments
            if (obj.parent != null && obj.booked) {
                console.log("ye?")
                parent_name = obj.parent.profile.first_name + " " + obj.parent.profile.last_name
                image = this.state.url + "parent_photo/" + obj.parent.id + "/"
            }
            if (obj.booked){
                console.log("DO THIS")
            }

            if (!this.state.items2[obj.date]) {
                this.state.items2[obj.date] = [];
                this.state.items2[obj.date].push({
                    date: obj.date,
                    start: obj.start_time,
                    end: obj.end_time,
                    time: obj.start_time + ' - ' + obj.end_time,
                    app_id: obj.id,
                    parent: parent_name,
                    parent_img: image,
                });

                // create marked dot on calendar
                
                this.state.marked[obj.date] = { marked: true };

            } else {
                x = this.state.items2[obj.date];
                let append = true;
                console.log("did you come here", x)
                //check if start date exists
                for (let j = 0; j < x.length; j++) {
                    if (obj.start_time == x[j].start) {
                        append = false;
                    }
                }

                if (append) {
                    this.state.items2[obj.date].push({
                        date: obj.date,
                        start: obj.start_time,
                        end: obj.end_time,
                        time: obj.start_time + ' - ' + obj.end_time,
                        app_id: obj.id,
                        parent: parent_name,
                        parent_img: image,
                    });
                }
            }

        }
        console.log("APPOINTMENT", this.state.items2);

        const newItems = {};
        Object.keys(this.state.items2).forEach(key => {
            newItems[key] = this.state.items2[key];
        });
        this.setState({
            items2: newItems
        });
    }

    /**
     * Refreshing data
     * RefreshControl from react native
     * How it works: drag the screen down to refresh screen
     */
    _onRefresh() {
        console.log("REFRESHING ...............")
        this.setState({ refreshing: true, items2: {}});
        this.fetchData().done;
        this.loadItems();
        this.setState({ refreshing: false });
    }

    /**
     * Get Day press
     */
    onDayPress(day) {
        this.getMonthName(day.month);
        this.setState({
            selected: day.dateString
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={styles.leftContainer}>
                        <Text style={[styles.text, { textAlign: 'left' }]}></Text>
                    </View>
                    <Text style={{ alignSelf: 'center', padding: 5 }}>{this.state.month}</Text>
                    <TouchableOpacity
                        style={styles.rightContainer}
                        onPress={() => this.props.navigation.navigate('RequestScreen')}>
                        <Text style={styles.request_text}>Request</Text>
                        <View style={styles.circle}>
                            <Text style={styles.request}>{this.state.re_num}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

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
                    onRefresh={this._onRefresh.bind(this)}
                    // // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />}
                    renderEmptyData={() => this.renderEmptyDate()}
                    markedDates={this.state.marked}
                    items={this.state.items2}
                    loadItemsForMonth={this.loadItems.bind(this)}

                    renderItem={this.renderItem.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    onDayChange={(date) => {
                        this.getMonthName(date.month);
                    }}
                />

                <TouchableOpacity
                    style={styles.roundButton}
                    onPress={() => this.props.navigation.navigate('TimeSlot', {
                        bookingDate: this.state.selected,
                        bookings: this.state.items2[this.state.selected]
                    })}>
                    <Icon
                        name='add'
                        color='white'
                    />
                </TouchableOpacity>
            </View>
        );
    }

    loadItems(day) {
        setTimeout(() => {

            for (let i = 0; i < this.state.data.length; i++) {
                let obj = this.state.data[i];
                let parent_name = "No appointment";
                let image = "None";
                // get booked appointments
                if (obj.parent != null && obj.booked) {
                    parent_name = obj.parent.profile.first_name + " " + obj.parent.profile.last_name
                    image = this.state.url + "parent_photo/" + obj.parent.id + "/"
                }

                if (!this.state.items2[obj.date]) {
                    this.state.items2[obj.date] = [];
                    this.state.items2[obj.date].push({
                        date: obj.date,
                        start: obj.start_time,
                        end: obj.end_time,
                        time: obj.start_time + ' - ' + obj.end_time,
                        app_id: obj.id,
                        parent: parent_name,
                        parent_img: image,
                    });

                    // create marked dot on calendar

                    this.state.marked[obj.date] = { marked: true };

                } else {
                    x = this.state.items2[obj.date];
                    let append = true;
                    //check if start date exists
                    for (let j = 0; j < x.length; j++) {
                        if (obj.start_time == x[j].start) {
                            append = false;
                        }
                    }

                    if (append) {
                        this.state.items2[obj.date].push({
                            date: obj.date,
                            start: obj.start_time,
                            end: obj.end_time,
                            time: obj.start_time + ' - ' + obj.end_time,
                            app_id: obj.id,
                            parent: parent_name,
                            parent_img: image,
                        });
                    }
                }

            }
            console.log("APPOINTMENT", this.state.items2);

            const newItems = {};
            Object.keys(this.state.items2).forEach(key => {
                newItems[key] = this.state.items2[key];
            });
            this.setState({
                items2: newItems
            });
        }, 1000);
    }

    renderItem(item) {
        return (
            <View style={styles.item}>
                <View style={styles.row}>
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            <Icon
                                name='clock'
                                type='evilicon'
                                color='grey'
                            />
                            <Text>{item.time}</Text>
                        </View>
                        {item.parent === "No appointment" &&
                        <Text style={{ color: "#818181", fontSize: 12, paddingHorizontal: 10 }}>{item.parent}</Text>
                        }
                        {item.parent !== "No appointment" &&
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: "#2a2a2a", fontSize: 12 }}>Appointment booked</Text>
                            <Text style={{ fontSize: 14 }}>{item.parent}</Text>
                        </View>
                        }
                    </View>
                    {item.parent_img !== "None" &&
                    <View style={styles.rightContainer}>
                        <View style={{alignItems:'center'}}>
                            <Thumbnail source={{ uri: item.parent_img }}/>
                            <TouchableOpacity
                                onPress={() => this.bookAppointment({ item }, 'prof_cancel').done()}>
                            <Text style={{fontSize: 10}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

                </View>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.content}><Text style={styles.centerText}>No available appointments</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    getMonthName(date) {
        const month = date - 1;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        this.setState({ month: monthNames[month], showMonth: true });
    }

    bookAppointment = async (item, todo) => {
        const booking = item.item;
        const url = this.state.url + "api/appointment/" + booking.app_id + "/";
        let value = '';
        console.log("ITEM", item)
        console.log("Book", booking);

        await AsyncStorage.getItem('key').then((res) => {
            value = res;
            this.setState({ auth_token: res });
        });

        if (booking) {
            this.setState({
                loading: true
            });
            const data = new FormData();
            
            data.append('date', booking.date);
            data.append('start_time', booking.start);
            data.append('end_time', booking.end);
            data.append('parent', this.state.parent_id);
            data.append('booked', false);
            data.append('todo', todo);

            fetch(url, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data;',
                    'Authorization': 'Token ' + value,
                },
                body: data
            }).then((response) => response.json()).then((responseJson) => {
                console.log("return yar", responseJson);
                
                Alert.alert(
                    'Motus Professional',
                    'Appointment has been canceled!',
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