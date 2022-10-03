import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'

const GoogleLogin = ({navigation,text, onPress}) => {

    const [accessToken, setAccessToken] = useState()
    const [userInfo, setUserInfo] = useState()

    async function signInWithGoogleAsync(){
        try{
            const result = await Google.logInAsync({
                androidClientId: '',
                iosClientId: '',
                scopes: ['profile','email']
            });
            if(result.type === 'success'){
                setAccessToken(result.accessToken)
            }else{
                console.log('Permission Denied');
            }
        }catch(e){
            console.log(e);
        }
    }

    async function getUserData(){

    }


  return (
    <TouchableOpacity onPress={()=>{navigation.replace('Home')}} style={[styles.button, styles.google]}>
        <Image source={require('../assets/google.png')} style={{ width: 24, height: 24 }}/>
        <Text style={[styles.buttonText, styles.googleText]}>{text} with Google</Text>
    </TouchableOpacity>
  )
}

export default GoogleLogin

const styles = StyleSheet.create({
    button: {
        padding: 14,
        backgroundColor: '#1660f9',
        borderRadius: 10,
        shadowColor: 'black',
        alignItems: 'center',
        marginVertical: 5,
        width: '100%',
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