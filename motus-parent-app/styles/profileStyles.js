'use strict';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    content:{
        flex:1,
        backgroundColor:'white',
        padding: 20,
        margin: 5,
        shadowOffset:{  width: 2,  height: 2,  },
        shadowColor: '#c2c2c2',

        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    header: {
        fontSize: 20,
        alignSelf: 'center',
        paddingBottom: 10,
    },
    infoHeader:{
        fontSize: 12,
        paddingTop: 15,
        color: '#606060',
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    imageView: {
        width:  150,
        height: 150,
        alignSelf: 'center',
        margin: 7,
        borderRadius: 150/2,
    },
    button: {
        borderRadius: 10,
        borderColor:'#818181',
        margin: 5,
        paddingVertical: 5,
        paddingHorizontal:15,
        backgroundColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
    },
    center:{
        alignItems: 'center',
    },
    textView: {
        width: '100%',
        fontSize: 20,
        padding: 10,
        color: '#000'
    },
    imageContainer: {
        width: '50%',
        height: 100,
        alignSelf: 'center',
        margin: 7,
        borderRadius: 15
    },
    
});