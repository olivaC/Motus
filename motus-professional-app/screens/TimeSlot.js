import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import common from '../styles/styles';
import styles from '../styles/timeStyle';
import { Icon } from 'react-native-elements'

/**
 * Create Appointments with Time Slot in the application
 */

export default class TimeSlot extends Component {
  static navigationOptions = {
    title: 'Create Availability',
  };

  constructor(props) {
    super(props);

    this.state = {
      auth_token: '',
      id: '',
      loading: false,
      data: '',
      bookingDate: '',
      error: null,
      refreshing: false,
      status: '',
      selected_time: '9:00 AM',
      selected_end_time: '10:00 AM',
      biometryType: null,
      accessControl: null,
      h: 9,
      min: 0,
      min2: 0,
      url: "http://204.209.76.235/"
    };
  }

  async componentDidMount(): Promise<void> {
    const bookingDate = this.props.navigation.state.params.bookingDate
    console.log("CREATE APPOINTMENT ON THIS DATE", bookingDate)
    this.setState({
      bookingDate: bookingDate,
    });

    const url = this.state.url + "api/professional/";
    let value = '';

    await AsyncStorage.getItem('key').then((res) => {
        value = res;
        this.setState({ auth_token: res });
    });

    let r1 = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + value,
        }
    });

    // get professional id
    let prof = await r1.json();
    let p = prof[0];
    this.setState({
        id: p.id,
    });
  }

  state = {
    isDateTimePickerVisible: false,
    isDateEndTimePickerVisible: false,

  };
  
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  
  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    let ampm = " AM"
    let h1 = date.getHours()
    let h2 = h1 + 1
    let getm = date.getMinutes()
    let m = ('0'+getm).slice(-2);
    const time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if(h2>= 12){
      if(h2>12) h2 -= 12;
      ampm= ' PM';
    }
    const next = h2 + ":"+ m + ampm;
    
    console.log("START TIME", time);
    this.setState({
      selected_time: time,
      selected_end_time: next,
      h: h1,
      min: getm,
    });
    this._hideDateTimePicker();
  };

  _showDateEndTimePicker = () => this.setState({ isDateEndTimePickerVisible: true });
  
  _hideDateEndTimePicker = () => this.setState({ isDateEndTimePickerVisible: false });
  
  _handleDateEndPicked = (date) => {
    console.log("CURRENT SELECTED", this.state.h)
    let h = date.getHours()
    let m = date.getMinutes()
    if((this.state.h > h) || (this.state.h == h && this.state.min > m)){
      console.log("HIGHER" , this.state.h, h)
    
    } else{
      const endTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      console.log("END TIME", endTime);
      this.setState({
        selected_end_time: endTime,
        min2: m,
      });
    }
    this._hideDateEndTimePicker();
  };
  
  fetchDataFromApi = () => {
    const url = this.state.url + "api/appointment/";
    pass = true;
    overlap = false;
    const bookings = this.props.navigation.state.params.bookings;
    const st = this.state.selected_time; // selected start time
    const et = this.state.selected_end_time; // selected end time
    const ampms = st.slice(-2); // get AM/PM for start time
    const ampme = et.slice(-2); // get AM/PM for end time

    num_s = Number(st.substr(0,st.indexOf(":")));
    num_e = Number(et.substr(0,et.indexOf(":")));
    console.log(st.indexOf(":"))
    let min = Number(st.substr(st.indexOf(":")+1,st.indexOf(":")+1))
    console.log("Selected range",num_s, num_e, this.state.min, this.state.min2 , min)
      
    if(bookings){
      //do checking
      console.log(bookings);
      for(var i = 0; i < bookings.length; i++){
        b_s = Number(bookings[i].start.substr(0,bookings[i].start.indexOf(":"))); // bookings start time
        b_e = Number(bookings[i].end.substr(0,bookings[i].end.indexOf(":"))); // bookings end time
        b_ampms = bookings[i].start.slice(-2); // get AM/PM for start time
        b_ampme = bookings[i].end.slice(-2); // get AM/PM for end time
        min_s = Number(bookings[i].start.substr(bookings[i].start.indexOf(":")+1,bookings[i].start.indexOf(":")+1))
        min_e = Number(bookings[i].end.substr(bookings[i].end.indexOf(":")+1,bookings[i].end.indexOf(":")+1))
        //console.log("RANGE", b_s, b_e , num_s , num_e);
        console.log("COMPARE MIN", min_s, this.state.min , b_ampms, ampms)
        if(st == bookings[i].start){
          pass = false;
          console.log("SAME TIME", bookings[i].start)
          Alert.alert(
            'Time Error',
            'This time already exist!',
            [
                { text: 'OK' },
            ],
            { cancelable: false }
          );
        } else if ( b_s <=  num_s && num_s < b_e && b_ampms == ampms){
          //check if time is overlaping
          console.log("TRUE",b_s , num_s , b_e)
          pass = false;
          Alert.alert(
            'Time Error',
            'Selected time is overlaping.',
            [
                { text: 'OK' },
            ],
            { cancelable: false }
          );
        } else if( num_s == b_e && (this.state.min < min_e) && b_ampme == ampme){
          pass = false;
          Alert.alert(
            'Time Error',
            'Selected time is overlaping.',
            [
                { text: 'OK' },
            ],
            { cancelable: false }
          );
        }
      }
    } 

    
    if (pass) {
      console.log(this.state.selected_time);
      this.setState({
          loading: true
      });
      const data = new FormData();
      data.append('professional', this.state.id);
      data.append('date', this.state.bookingDate);
      data.append('start_time', this.state.selected_time);
      data.append('end_time', this.state.selected_end_time);
      console.log(data);
      fetch(url, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Token ' + this.state.auth_token,
          },
          body: data
      }).then((response) => response.json()).then((responseJson) => {
          Alert.alert(
              'Motus Professional',
              'Time slot created!',
              [
                  { text: 'OK', onPress: () => this.props.navigation.navigate('CalendarScreen') },
              ],
              { cancelable: false }
          );

      }).catch((error) => {
          // Error in Form
          console.log(error)
          alert('Error in time slot.')
      })
      } else {
        console.log("Check does not pass")
      }
};

  render () {
    return (
      <View style={common.container}>
      <View style={{ flex: 1, padding: 20, }}>
        <View style={styles.content}>
          <View style={styles.section}> 
            <View style={styles.row}> 
              <Icon
                name='calendar'
                type='evilicon'
                color='grey'
              />
              <Text style={styles.headings}>Date</Text>
            </View>
            <Text style={styles.text}>{this.state.bookingDate}</Text>
          </View>

          <View style = {styles.lineStyle} />
          <View style={styles.section}>
            <View style={styles.row}> 
              <Icon
                name='clock'
                type='evilicon'
                color='grey'
              />
              <Text style={styles.headings}>Time</Text>
            </View>
            
            <View style={styles.row}> 
              <Text>Start: </Text>
              <TouchableOpacity onPress={this._showDateTimePicker}>
                <Text style={{color:'#2979FF'}}>{this.state.selected_time}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}> 
              <Text>End: </Text>
              <TouchableOpacity onPress={this._showDateEndTimePicker}>
                <Text style={{color:'#2979FF'}}>{this.state.selected_end_time}</Text>
              </TouchableOpacity>
              </View>
          </View>
          

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode = 'time'
          />
          <DateTimePicker
            isVisible={this.state.isDateEndTimePickerVisible}
            onConfirm={this._handleDateEndPicked}
            onCancel={this._hideDateEndTimePicker}
            mode = 'time'
          />
        
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={this.fetchDataFromApi}>
            <Text style={{color: 'white'}}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('CalendarScreen')}>
            <Text style={{color: 'white'}}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    );
  }
  
}
