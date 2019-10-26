import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    AsyncStorage,
    Image,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    FlatList
} from 'react-native';
import { Icon } from 'react-native-elements';
import styles from '../styles/styles';
import Emoji from 'react-native-emoji';

const emojiDict = {
    'love': 'heart_eyes',
    'sad': 'cry',
    'relaxed': 'relaxed',
    'angry': 'rage',
    'surprised': 'hushed',
};

/**
 * This class is the Mental health professionals profile page.
 */
export default class ActivityLog extends Component {
    static navigationOptions = {
        title: 'Activity Log',
    };

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
            children: '',
            lessons: '',
            error: null,
            refreshing: false,
            status: '',
            biometryType: null,
            accessControl: null,
            p: '',
            url: "http://204.209.76.235/"
        };
    }

    async componentDidMount() {
        this.fetchData()
    }


    fetchData = async () => {
        const url = this.state.url + "api/child/" + this.state.id + "/";
        let value = '';
        const parent = this.props.navigation.getParam('parent');
        console.log(parent, parent.id)

        await AsyncStorage.getItem('key').then((res) => {
            value = res
        });

        let r2 = await fetch(this.state.url + "api/parent_log/"+ `?parent=${encodeURIComponent(parent.id)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + value,
            }
        });

        let children = await r2.json();
        //console.log(children);
        this.setState({ children: children });

        let dict = []

        for (let i = 0; i < this.state.children.length; i++) {
            let obj = this.state.children[i];
            let info = {}
            let info2 = {}
            let info3 = {}
            let info4 = {}
            // console.log("THE OBJECT", obj, i)
            if(obj.date_completed !=null){
                let d = obj.date_completed;
                let t = d.substring(d.indexOf('T')+1, d.indexOf('T')+9);
                d = d.split('T')[0];
                
                info.type = 'Video Completed'
                info.date = d + ' ' + t
                info.lesson = obj.video.lesson.lesson_name
                info.video = obj.video.video_name
                info.person = obj.child.first_name
                dict.push(info);
            }
            if(obj.reaction_date != null){
                let d = obj.reaction_date;
                let t = d.substring(d.indexOf('T')+1, d.indexOf('T')+9);
                d = d.split('T')[0];
                
                info2.type = 'Reaction Added' 
                info2.date = d + ' ' + t
                info2.lesson = obj.video.lesson.lesson_name
                info2.video = obj.video.video_name
                info2.reaction =  obj.reaction
                info2.person = obj.child.first_name
                dict.push(info2);
            }
            if(obj.diary_entry_date != null){
                let d = obj.diary_entry_date;
                let t = d.substring(d.indexOf('T')+1, d.indexOf('T')+9);
                d = d.split('T')[0];

                info3.type = 'Diary Entry Added'
                info3.date = d + ' ' + t
                info3.lesson = obj.video.lesson.lesson_name
                info3.video = obj.video.video_name
                info3.diary = "Diary entry: "+ obj.diary_entry
                info3.person = obj.child.first_name
                dict.push(info3)
            }
            if(obj.bookmark_date != null){
                let d = obj.bookmark_date;
                let t = d.substring(d.indexOf('T')+1, d.indexOf('T')+9);
                d = d.split('T')[0];

                info4.type = 'Video Favorited'
                info4.date = d + ' ' + t
                info4.id = obj.id
                info4.lesson = obj.video.lesson.lesson_name
                info4.video = obj.video.video_name
                info4.person = obj.child.first_name
                dict.push(info4)
            }
        }
        this.setState({ data: dict });
        console.log("DISPLAY", this.state.data)
    };


    _onRefresh() {
        this.setState({ refreshing: true });
        this.fetchData().done();
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
                    
                        {this.state.children.length === 0 &&
                        
                        <Text style={{alignSelf:'center'}}>No Activity</Text>
                        
                        }
                        <FlatList
                            data={this.state.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                <View style={styles.listContainer}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.time}>{item.date}</Text>
                                </View>
                                
                                <View style={styles.row}>
                                    <View style={styles.leftContainer}>

                                        {item.type == 'Video Completed' &&
                                            <Icon
                                            reverse
                                            name='check'
                                            color='#C8D34B'
                                            />    
                                        }
                                        {item.type == 'Reaction Added' &&
                                            <Icon
                                            reverse
                                            name='ios-happy'
                                            type = 'ionicon'
                                            color='#F19C38'
                                            />   
                                        }
                                        {item.type == 'Video Favorited' &&
                                            <Icon
                                            reverse
                                            name='heart'
                                            type = 'foundation'
                                            color='#D50000'
                                            />   
                                        }
                                        {item.type == 'Diary Entry Added' &&
                                            <Icon
                                            reverse
                                            name='book'
                                            type = 'foundation'
                                            color='#53B9D2'
                                            />   
                                        }
                                    </View>
                                <View style={[styles.row, {alignItems:'center'}]}>
                                    <View style={{flex: 1}}>
                                        <Text style={[styles.text,{fontWeight: 'bold'}]}>{item.type}</Text>
                                        <Text style={[styles.text,{textTransform: 'uppercase'}]}>{item.person}</Text>
                                        <Text style={styles.text}>Lesson: {item.lesson}</Text>
                                        <Text style={styles.text}>Video: {item.video}</Text>
                                        {item.reaction &&
                                        <Emoji name={emojiDict[item.reaction]}
                                                                   style={{ fontSize: 25 }}
                                                            />}
                                        <Text style={styles.text}>{item.diary}</Text>
                                    </View>

                                </View>
                                    


                                </View>
                                    
                                    
                                    
                                </View>
                            }
                        />
                    
                </ScrollView>
            </View>
        );
    }
}



