'use strict';
import { StyleSheet } from 'react-native';
let defont = 12

export default StyleSheet.create({
    headings:{
        fontSize: 13,
        padding: 5,
    },
    text:{
        fontSize: 15,
    },
    content:{
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
    row:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    section:{
        padding: 10,
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'#bcbcbc',
        margin:10,
    },
    saveButton: {
        borderRadius: 10,
        borderColor:'#00aeef',
        margin: 5,
        paddingVertical: 5,
        paddingHorizontal:15,
        backgroundColor: '#00aeef',
        borderWidth: 1,
        alignItems: 'center',
    },
    button: {
        borderRadius: 10,
        borderColor:'#ED655A',
        margin: 5,
        paddingVertical: 5,
        paddingHorizontal:15,
        backgroundColor: '#ED655A',
        borderWidth: 1,
        alignItems: 'center',
    },
});