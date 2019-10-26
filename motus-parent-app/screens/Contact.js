import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import styles from '../styles/mainStyles';
import { View, Text, AsyncStorage, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Agenda } from 'react-native-calendars';

/**
 * Parent booking appointment in this screen
 * Avaiable appointments are created through professional app
 */
export default class Contacts extends Component {
    static navigationOptions = {
        title: 'Make Appointment',
    };

    fetchData = async () => {
        const url = this.state.url + "api/appointment/";
        let value = '';
        let today = new Date();
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
        console.log("APOINTMENT DATA", appointment);

        //get parents id
        const url2 = this.state.url + "api/parent/";

        let r1 = await fetch(url2, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        // get parent and professional id
        let parent = await r1.json();
        let p = parent[0];
        this.setState({
            parent_id: p.id,
            pro_id: p.professional.id,
            data: appointment
        });
    };

    fetchData2 = async () => {
        const url = this.state.url + "api/appointment/";
        let value = '';
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1; //January is 0!
        const yyyy = today.getFullYear();

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
        console.log("APOINTMENT DATA", appointment);

        //get parents id
        const url2 = this.state.url + "api/parent/";

        let r1 = await fetch(url2, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        // get parent and professional id
        let parent = await r1.json();
        let p = parent[0];
        this.setState({
            parent_id: p.id,
            pro_id: p.professional.id,
            data: appointment
        });

        this.loadItems();
    };

    componentDidMount() {
        this.fetchData().done()
    }

    _onRefresh() {
        this.setState({ refreshing: true, items2: [] });
        this.fetchData2().done();
        this.setState({ refreshing: false });
    }

    loadItems() {
        for (var i = 0; i < this.state.data.length; i++) {
            var obj = this.state.data[i];
            console.log("THE DATA ", obj)
            let parent_obj = true
            let parent_id = "None"

            // check if parent exists
            if (obj.parent != null) {
                // console.log(obj.parent.id)
                if (obj.parent.id != this.state.parent_id) {
                    parent_obj = false
                } else {
                    parent_id = obj.parent.id
                }
            }
            if (parent_obj) {
                if (!this.state.items2[obj.date]) {
                    this.state.items2[obj.date] = [];
                    this.state.items2[obj.date].push({
                        date: obj.date,
                        start: obj.start_time,
                        end: obj.end_time,
                        time: obj.start_time + ' - ' + obj.end_time,
                        app_id: obj.id,
                        parent: parent_id,
                        booked: obj.booked,
                    });

                    // create marked dot on calendar
                    this.state.marked[obj.date] = { marked: true };

                } else {
                    x = this.state.items2[obj.date];
                    append = true

                    //check if start date exists
                    for (var j = 0; j < x.length; j++) {
                        // console.log(j, x[j].start);
                        if (obj.start_time == x[j].start) {
                            // console.log("MATCH", obj.start_time);
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
                            parent: parent_id,
                            booked: obj.booked,
                        });
                    }
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

    constructor(props) {
        super(props);

        this.state = {
            auth_token: '',
            id: '',
            parent_id: '',
            pro_id: '',
            loading: false,
            data: [],
            error: null,
            refreshing: false,
            status: '',
            selected: '',
            biometryType: null,
            accessControl: null,
            isDateTimePickerVisible: false,
            marked: {},
            items2: {},
            dateObject: {},
            month: '',
            url: "http://204.209.76.235/"
        };
        this.onDayPress = this.onDayPress.bind(this);
    }

    renderIcon = icon => ({ isActive }) => (
        <Icon size={24} color="white" name={icon}/>
    )

    renderTab = ({ tab, isActive }) => (
        <FullTab
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            renderIcon={this.renderIcon(tab.icon)}
        />
    )

    handleTabPress = (newTab, oldTab) => {
        this.setState({ activeTab: newTab.key })
        console.log(newTab.key)
        this.props.navigation.navigate(newTab.key)
    }

    onDayPress(day) {
        this.getMonthName(day.month);
        this.setState({
            selected: day.dateString
        });
    }

    _onPressBack() {
        const { goBack } = this.props.navigation
        goBack()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ alignSelf: 'center', padding: 5 }}>Available Appointments for {this.state.month}</Text>
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
                    // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />}
                    markedDates={this.state.marked}
                    // callback that gets called when items for a certain month should be loaded (month became visible)
                    items={this.state.items2}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    renderEmptyData={() => this.renderEmptyDate()}
                    onDayChange={(date) => {
                        this.getMonthName(date.month);
                    }}
                />
            </View>
        )
    }

    loadItems(day) {
        setTimeout(() => {
            for (var i = 0; i < this.state.data.length; i++) {
                var obj = this.state.data[i];
                console.log("THE DATA ", obj)
                let parent_obj = true
                let parent_id = "None"

                // check if parent exists
                if (obj.parent != null) {
                    // console.log(obj.parent.id)
                    if (obj.parent.id != this.state.parent_id) {
                        parent_obj = false
                    } else {
                        parent_id = obj.parent.id
                    }
                }
                if (parent_obj) {
                    if (!this.state.items2[obj.date]) {
                        this.state.items2[obj.date] = [];
                        this.state.items2[obj.date].push({
                            date: obj.date,
                            start: obj.start_time,
                            end: obj.end_time,
                            time: obj.start_time + ' - ' + obj.end_time,
                            app_id: obj.id,
                            parent: parent_id,
                            booked: obj.booked,
                        });

                        // create marked dot on calendar
                        this.state.marked[obj.date] = { marked: true };

                    } else {
                        x = this.state.items2[obj.date];
                        append = true

                        //check if start date exists
                        for (var j = 0; j < x.length; j++) {
                            // console.log(j, x[j].start);
                            if (obj.start_time == x[j].start) {
                                // console.log("MATCH", obj.start_time);
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
                                parent: parent_id,
                                booked: obj.booked,
                            });
                        }
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
            <View style={{ padding: 10, backgroundColor: 'white', margin: 10, height: 80 }}>
                <View style={{ flexDirection: "row", flex: 1, alignItems: 'center' }}>
                    <Icon
                        name='clock'
                        type='evilicon'
                        color='grey'
                    />
                    <Text style={{ fontSize: 12, }}>{item.time}</Text>
                    {item.parent === this.state.parent_id && !item.booked &&
                    <TouchableOpacity style={styles.rightContainer}
                                      onPress={() => this.bookAppointment({ item }, 'cancel').done()}>
                        <Text style={{ backgroundColor: '#ff0021', padding: 8, color: 'white', fontSize: 11, }}>
                            Cancel Request</Text>
                    </TouchableOpacity>
                    }
                    {item.parent === "None" &&
                    <TouchableOpacity style={styles.rightContainer}
                                      onPress={() => this.bookAppointment({ item }, 'book').done()}>
                        <Text style={{ backgroundColor: '#73C07E', padding: 8, color: 'white', fontSize: 11, }}>
                            Book Appointment</Text>
                    </TouchableOpacity>
                    }
                    {item.parent === this.state.parent_id && item.booked &&
                    <Text style={{ fontSize: 12, paddingHorizontal: 10 }}>Appointment booked!</Text>
                    }
                </View>
            </View>
        );

    }

    renderEmptyDate() {
        return (
            <View style={[styles.content, { alignItems: 'center' }]}><Text>No available appointments</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1 !== r2;
    }

    getMonthName(date) {
        const month = date - 1;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        this.setState({ month: monthNames[month], showMonth: true });
    }

    /**
     * Request to book an appointment
     */
    bookAppointment = async (item, todo) => {
        const booking = item.item;
        const url = this.state.url + "api/appointment/" + booking.app_id + "/";
        let value = '';
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
            data.append('professional', this.state.pro_id);
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
                console.log(responseJson);
                if (todo === 'cancel') {
                    Alert.alert(
                        'Motus Parent',
                        'Appointment has been canceled!',
                        [
                            { text: 'OK', },
                        ],
                        { cancelable: false }
                    );
                } else {
                    Alert.alert(
                        'Motus Parent',
                        'Appointment has been requested!',
                        [
                            { text: 'OK', },
                        ],
                        { cancelable: false }
                    );
                }
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

