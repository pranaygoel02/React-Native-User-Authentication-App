import { KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard ,Alert ,StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React,{useEffect, useState} from 'react'
import { useFonts } from 'expo-font' ;
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { auth } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import {styles} from '../styles/AppStyles'

const ForgotPassword = ({navigation}) => {
   const [email, setEmail] = useState('')

    const createAlert = () => {
        Alert.alert(
            "Password Reset Link Sent",
            `to ${email}`,
            [
              { text: "OK", onPress: () => navigation.pop() }
            ]
          )
    }

    const submit = () =>{
        Keyboard.dismiss()
        console.log('submitting');
        sendPasswordResetEmail(auth, email)
  .then(() => {
    console.log('snet');
    createAlert()
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error ,errorCode, errorMessage, email);
    // ..
  });
    }


    const [loaded] = useFonts({
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
  })
  
  if(!loaded) return null;

    return (
        <SafeAreaView style={{flex: 1}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View>
            <Image source={require('../assets/forgot-psd.png')} style={{width: 270, height: 360}} resizeMode='contain'></Image>
        </View>
      <View style={styles.login}>
      <View style={styles.inputContainer}>
        <View style={{paddingVertical: 0}}>
          <Text style={[styles.header]}>Forgot Password?</Text>
        </View>
        <Text style={styles.signup}>Enter email address assosiated with your account.</Text>
        <View style={styles.inputField}>
        <MaterialIcons name='alternate-email' size={24} color='#666'/>
        <TextInput
            placeholder='Email ID'
            name='email'
            style={[styles.input,{marginVertical: 12}]}
            value={email}
            onChangeText={text=>setEmail(text)}
        />
        </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={submit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    <Text style={styles.signup}>Already have an account? <Text onPress={()=>{navigation.pop()}} style={styles.link}>Login</Text></Text>
    </View>
    </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default ForgotPassword

