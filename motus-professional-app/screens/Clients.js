import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, AsyncStorage, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { Thumbnail, } from 'native-base';
import styles from '../styles/search-styles';
import { List, ListItem, SearchBar } from 'react-native-elements';

/**
 * View Clients for the Motus Application.
 * resource search function:
 * https://github.com/vikrantnegi/react-native-searchable-flatlist
 */
export default class Clients extends Component {
    static navigationOptions = {
        title: 'Clients',
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
            biometryType: null,
            accessControl: null,
            url: "http://204.209.76.235/"
        };

        this.arrayholder = [];
    }

    async componentDidMount(): Promise<void> {
        const url = this.state.url + "api/parent/";
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

        let clients = await r.json();
        this.setState({ data: clients});
        this.arrayholder = clients;
        console.log("YAR",this.arrayholder)
        StatusBar.setNetworkActivityIndicatorVisible(false);
        return Promise.resolve();
    }

    searchFilterFunction = text => {
        console.log(text,this.arrayholder);
        const newData = this.arrayholder.filter(item => {
          const itemData = `${item.profile.first_name.toUpperCase()} ${item.profile.last_name.toUpperCase()}`;
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({
          data: newData,
        });
    };

    onPress(item){
        console.log("CLIENT", item);
        this.props.navigation.navigate('ClientProfileScreen',{ client : item })
    }
    

    render() {
        if (this.state.loading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
              </View>
            );
          }
        return (
            <View style={styles.container}>
                <SearchBar
                    clearIcon={{ color: '#86939e' }}
                    inputStyle={{color: 'white'}}
                    TextColor='white'
                    placeholder="Search Client"
                    round
                    onChangeText={text => this.searchFilterFunction(text)}
                    autoCorrect={false}
                    />
                <ScrollView>
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        // renderItem={({ item }) => (
                        //     <ListItem
                        //       roundAvatar
                        //       title={`${item.profile.first_name} ${item.profile.last_name}`}
                        //       titleStyle={{ color: 'white'}}
                        //       avatar={{ uri: item.picture  }}
                        //       containerStyle={{ borderBottomWidth: 0 }}
                        //     />
                        //   )}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.onPress(item)}>
                            <View style={styles.content}>
                                <Thumbnail source={{ uri: this.state.url + "parent_photo/" + item.id + "/" }}/>
                                <Text style={styles.name}>{item.profile.first_name} {item.profile.last_name}</Text>
                                </View>
                            </TouchableOpacity>
                            
                        }
                    />
                </ScrollView>
            </View>
        )
    }
}