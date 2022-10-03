import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    login: {
        width: '100%',
        paddingHorizontal: 24,
        backgroundColor: '#fff'
    },
    header: {
        alignSelf: 'flex-start',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 40,
        color: '#182a4b'
    },
    inputContainer: {
        width: '100%',
    },
    marginVertical: {
        marginVertical: 8
    },
    inputField: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        // flexWrap: 'wrap'
    },
    password: {
        alignItems: 'center',
        flexDirection: 'row'
    },  
    link: {
        color: '#1660f9'
    },
    forgot: {
        alignSelf: 'flex-end'
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 16,
        borderRadius: 10,
        shadowColor: 'black',
        borderBottomColor: '#666',
        borderBottomWidth: 0.3,
        width: '90%',
    },
    error: {
        alignSelf: 'center',
        color:'red'
    },
    buttons: {
        width: '100%',
        marginTop: 16,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    button: {
        padding: 14,
        backgroundColor: '#1660f9',
        borderRadius: 10,
        shadowColor: 'black',
        alignItems: 'center',
        marginVertical: 5,
        width: '100%',
    },
    or:{
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
    },  
    line: {
        height: 0.31,
        flex: 1,
        backgroundColor: '#666'
    },
    orText: {
        marginHorizontal: 16,
        color: '#666'
    },
    signup: {
        marginTop: 16,
        alignSelf: 'center'
    },  
    buttonText: {
        color: '#fff',
        fontSize: 16
    },
    google: {
        // backgroundColor: 'rgba(10,10,10,0.2)',
        backgroundColor: 'rgb(241, 245, 246)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
        
    },
    googleText: {
        color: 'rgba(10,10,10,0.7)',
        textAlign: 'center',
    }
})

export {styles}