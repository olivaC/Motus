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
    header: {
        fontSize: 15,
        alignSelf: 'center',
        paddingBottom: 5,
    },
    infoHeader:{
        fontSize: 12,
        paddingTop: 15,
        color: '#6c6c6c',
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
        height: 150,
        alignSelf: 'center',
        margin: 7,
        borderRadius: 15
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
    },
    modalContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 15,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    },
    listContainer:{
        flex: 1,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        margin : 10,
        padding: 5,
    },
    leftContainer:{
        justifyContent: 'flex-end', 
        alignSelf: 'baseline', 
        padding: 5,
    },
    row:{
        flex: 1,
        flexDirection: 'row',
        padding: 5,
    },
    time:{ 
        textAlign:"left", 
        color: 'grey',
        paddingHorizontal: 20,
        fontSize: 12
    },
    text:{
        fontSize: 12
    },
    modalMessage: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#E0E0E0',
        borderRadius: 15,
        alignItems: 'center'
    },
    form:{
        borderWidth: 1 , 
        height: 250, 
        borderColor: '#EEEEEE', 
        padding: 10, 
        backgroundColor: 'white',
    },
    greenButton: {
        backgroundColor: '#73C07E', 
        padding: 8, 
        color: 'white', 
        fontSize: 11,
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
    
    
});