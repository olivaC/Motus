'use strict';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: 'white',
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
        padding: 10,
    },
    button: {
        backgroundColor: '#00aeef',
        borderRadius: 15,
        width: '30%',
        padding: 10,
        alignSelf: 'center',
    },
    buttonText:{
        color: 'white',
        alignSelf: 'center',
        fontSize: 15,
    },
    textView: {
        width: '100%',
        fontSize: 20,
        padding: 10,
        color: '#000'
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    imageView: {
        width: '40%',
        height: 100,
        margin: 7,
        borderRadius: 7
    },
    paddler: {
        backgroundColor: '#00aeef',
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 50,
    },
    centerContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        alignItems: 'center'
    },
    greenButton: {
        backgroundColor: '#73C07E', 
        padding: 8, 
        color: 'white', 
        fontSize: 11,
    },
    buttonContainer:{
        alignItems: 'center', 
        margin: 5, 
        padding: 5,
    },
    form:{
        borderWidth: 1 , 
        height: 250, 
        borderColor: '#EEEEEE', 
        padding: 10, 
        backgroundColor: 'white',
    }
});