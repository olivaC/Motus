'use strict';
import { StyleSheet, Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        margin: 5,
        shadowOffset: { width: 2, height: 2, },
        shadowColor: '#c2c2c2',

        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        alignItems: 'center'
    },
    header: {
        fontSize: 20,
        alignSelf: 'center',
        paddingBottom: 10,
    },
    infoHeader: {
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
        width: '60%',
        height: '45%',
        alignSelf: 'center',
        margin: 7,
        borderRadius: 15
    },
    button: {
        borderRadius: 10,
        borderColor: '#818181',
        margin: 5,
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
    },
    center: {
        alignItems: 'center',
    },
    textView: {
        width: '100%',
        fontSize: 18,
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
    text2: {
        fontSize: 15,
        letterSpacing: 2,
        alignSelf: 'center',
        textAlign: 'center',
        padding: 10,
    },
    child: {
        height: height * 0.4,
        width,
        justifyContent: 'center'
    },
    container2: {
        backgroundColor: 'white',
        flex: 1,
    },
    text: {
        fontSize: 15,
        letterSpacing: 2,
        alignSelf: 'center',
        textTransform: 'uppercase',
        textAlign: 'center',
        padding: 10,
    },
    modalContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 15,
    },
    contentNotComplete:{
        flex:1,
        backgroundColor:'white',
        padding: 20,
        margin: 5,
        shadowOffset:{  width: 2,  height: 2,  },
        shadowColor: '#c2c2c2',

        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#ddd',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    contentComplete:{
        flex:1,
        backgroundColor:'#DFDFDF',
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
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});

