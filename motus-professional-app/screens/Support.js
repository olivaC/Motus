import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, AsyncStorage, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Thumbnail, } from 'native-base';
import styles from '../styles/styles';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";

/**
 * View support contact information for the Motus Application.
 */
export default class Support extends Component {

    static navigationOptions = {
        title: 'Motus Support Team',
    };

    async componentDidMount(): Promise<void> {
        const url = this.state.url + "api/support/";
        let value = '';
        let prof = '';

        await AsyncStorage.getItem('key').then((res) => {
            value = res
        });
        await AsyncStorage.getItem('professional').then((res) => {
            prof = res
        });
        let r = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let support = await r.json();
        this.setState({ data: support, auth_token: value, professional: JSON.parse(prof) });
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
            error: null,
            refreshing: false,
            status: '',
            professional: '',
            biometryType: null,
            accessControl: null,
            isModalVisible: false,
            text: '',
            url: "http://204.209.76.235/"
        };
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ flex: 1, padding: 15, alignItems: 'center' }}>
                        <Text>CONNECT WITH US</Text>
                        <FlatList
                            data={this.state.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                <View style={[styles.row, { padding: 10 }]}>

                                    <Thumbnail square large
                                               source={{ uri: this.state.url + "support_photo/" + item.id + "/" }}/>

                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={{ textTransform: 'uppercase' }}>{item.name}</Text>

                                        <View style={styles.row}>
                                            <Icon
                                                name='star'
                                                color='grey'
                                                size={15}
                                                type='entypo'/>
                                            <Text style={styles.text}> {item.position}</Text>
                                        </View>


                                        <View style={styles.row}>
                                            <Icon
                                                name='phone'
                                                color='grey'
                                                size={15}
                                                type='entypo'/>
                                            <Text style={styles.text}> {item.phone}</Text>
                                        </View>

                                        <View style={styles.row}>
                                            <Icon
                                                name='email'
                                                color='grey'
                                                size={15}
                                                type='materialicons'/>
                                            <Text style={styles.text}> {item.email}</Text>
                                        </View>
                                    </View>
                                </View>
                            }
                        />

                    </View>
                    <TouchableOpacity
                        style={{ alignSelf: 'center', flex: 1 }}
                        onPress={this._toggleModal}>
                        <Text style={styles.greenButton}>Send us an email!</Text>
                    </TouchableOpacity>

                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={styles.modalMessage}>
                            <ScrollView>
                                <Text style={[styles.header, { fontSize: 16 }]}>LEAVE A MESSAGE</Text>
                                <TextInput
                                    style={styles.form}
                                    editable={true}
                                    multiline={true}
                                    numberOfLines={10}
                                    maxLength={100}
                                    placeholder="Message"
                                    onChangeText={(text) => this.setState({ text })}
                                    value={this.state.text}
                                />
                                <TouchableOpacity
                                    style={{ alignItems: 'center', margin: 5, padding: 5 }}
                                    onPress={() => this.onCreate()}>
                                    <Text style={styles.greenButton}>Send</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ alignItems: 'center' }}
                                    onPress={this._toggleModal}>
                                    <Text style={[styles.greenButton, { backgroundColor: 'grey' }]}>Cancel</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        )
    }

    onCreate = async () => {

        console.log('text', this.state.text);
        //
        const key = this.state.auth_token;
        const text = this.state.text;
        const data = new FormData();
        data.append('message', text);
        data.append('professional', this.state.professional.id);
        fetch(this.state.url + "api/contact_support/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + key,
            },
            body: JSON.stringify(data)
        }).then((response) => response.text()).then((responseJson) => {
            console.log('reaction:', responseJson);
            let x = responseJson;
            Alert.alert(
                'Motus Professional',
                'Email sent!',
                [
                    { text: 'OK', onPress: () => this._toggleModal() },
                ],
                { cancelable: false }
            );

        }).catch((error) => {
            // Error in Form
            console.log(error);
            alert('Error in sending reaction.')
        });
    };
}
