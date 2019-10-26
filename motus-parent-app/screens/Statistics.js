import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/darkStyle';

export default class Statistics extends Component {
    static navigationOptions = {
        title: 'Child Statistics',
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>SEE THEIR PROGRESS...</Text>
                <View style={{ flex: 1, flexDirection: 'row', height: "50%" }}>

                    <TouchableOpacity
                        style={styles.content2}>
                        <Image style={styles.imageView} source={require('../img/kids.jpg')}/>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>MOOD SCORES</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.content2}>
                        <Image style={styles.imageView} source={require('../img/kid3.jpg')}/>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}> FEARS </Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', height: "50%", width: "100%", }}>

                    <TouchableOpacity
                        style={styles.content2}>
                        <Image style={styles.imageView} source={require('../img/kid2.jpg')}/>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>SELF-TALK</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.content2}
                        onPress={() => this.props.navigation.navigate('ProgressScreen')}>
                        <Image style={styles.imageView} source={require('../img/book.jpg')}/>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}> LESSON PROGRESS </Text>
                        </View>

                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}