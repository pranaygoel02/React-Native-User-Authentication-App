import { KeyboardAvoidingView ,StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React,{useEffect, useState} from 'react'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {auth,currentUser} from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import GoogleLogin from '../components/GoogleLogin';
import {styles} from '../styles/AppStyles'
// import { async } from '@firebase/util';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Login = ({navigation}) => {
    
    const [showPass, setShowPass] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [loggingIn,setLoggingIn] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    

    // useEffect(()=>{
    //   if(auth.currentUser){
    //       navigation.replace('Home')
    //   }
    // },[])
    
    const saveLoginState = async () => {
      try{
        await AsyncStorage.setItem('LoggedIn','true');
      }catch(err){
        console.log(err);
      }
    }
  
    
    useEffect(()=>{
      const getLoginState = () => {
        try{
          AsyncStorage.getItem('LoggedIn')
          .then(value => {
            if(value!== 'false' && value!== null){
              navigation.replace('Home')
            }
          })
        }catch(err){
          console.log(err);
        }
      }
      getLoginState()
    },[])

    const login = () => {
        setLoggingIn(prev=>!prev)
        if(email !== '' && password !== ''){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log('===========LOGIN==============');
              console.log(user );
              console.log('====================================');
              setLoggingIn(prev=>!prev)
              saveLoginState();
                navigation.replace('Home',{user})
            })
            .catch((error) => {
              setErrorMessage(error.message)
            });
        }
        else{
            setErrorMessage('Please provide valid email and password')
            setLoggingIn(prev=>!prev)
        }
    }

    

    return (
        
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View>
            <Image source={require('../assets/login1.png')} style={{width: 270, height: 310}} resizeMode='contain'></Image>
        </View>
      <View style={styles.login}>
      <View style={styles.inputContainer}>
        <View style={{paddingVertical: 0}}>
          <Text style={styles.header}>Login</Text>
        </View>
        <View style={styles.inputField}>
        <MaterialIcons name='alternate-email' size={24} color='#666'/>
        <TextInput
            placeholder='Email ID'
            style={styles.input}
            value={email}
            onChangeText={text=>setEmail(text)}
        />
        </View>
        <View style={styles.inputField}>
        <MaterialIcons name='lock-outline' size={24} color='#666'/>
        <View style={styles.password}>
            <TextInput
                placeholder='Password'
                style={styles.input}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <MaterialIcons name={showPass ? 'visibility' : 'visibility-off'} onPress={()=>{setShowPass(prev=>!prev)}} size={24} color='#666'/>
        </View>
        </View>
      </View>
      <Text onPress={()=>navigation.navigate('ForgotPassword')} style={[styles.link,styles.forgot]}>Forgot Password?</Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <View style={styles.buttons}>
        <TouchableOpacity onPress={login} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* <View style={styles.or}>
            <View style={styles.line}></View>
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line}></View>
        </View>
        <GoogleLogin navigation={navigation} text='Login'/> */}
      </View>
    <Text style={styles.signup}>New to Our App? <Text onPress={()=>{navigation.replace('Signup')}} style={styles.link}>Sign up</Text></Text>
    </View>
    </KeyboardAvoidingView>
    
  )
}

export default Login