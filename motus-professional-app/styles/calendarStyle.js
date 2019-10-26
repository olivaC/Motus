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
    imageContainer: {
        width: '50%',
        height: 100,
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
    roundButton:{
        position: 'absolute',
        bottom:0,
        right:0,
        margin: 20,
        backgroundColor: '#ED759D',
        width:50,
        height:50,
        borderRadius:50,
        padding:10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ddd',
        shadowOffset:{  width: 2,  height: 2,  },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    agenda:{
        backgroundColor: 'white', 
        height: "80%", 
        width: "90%", 
        alignSelf: 'center', 
        margin: 10 ,
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        height: 80
    },
    request:{
        alignSelf: "center",
        fontWeight: 'bold',
        color: 'white',
    },
    request_text:{
        alignSelf: "center",
        color: "#2a2a2a",
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 12,
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
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
    circle:{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        alignItems: 'center',
        margin: 5,
        justifyContent: 'center',
        padding: 3,
    },
    reButton:{
        backgroundColor: '#73C07E',
        padding: 5,
        color: 'white',
        borderRadius: 5,
        fontSize: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: 'transparent',
        margin: 5,
    },
    rButtonText:{
        color: 'white',
        fontSize: 12,
        alignSelf: 'center',
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    appText:{
        fontSize: 12,
        color:"#818181",
     },
    centerText:{
        alignSelf: 'center', 
        padding: 10,
    }
});