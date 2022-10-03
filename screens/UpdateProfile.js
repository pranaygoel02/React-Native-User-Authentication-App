import { Keyboard,Image,KeyboardAvoidingView,StyleSheet,TextInput, Text, TouchableWithoutFeedback,TouchableHighlight, View, TouchableOpacity } from 'react-native'
import React,{useEffect, useState, useMemo, useCallback} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {styles} from '../styles/AppStyles'
import { auth,db } from '../firebase'
import { doc, setDoc, getDoc } from "firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { deleteUser } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const UpdateProfile = (props) => {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

const getUserData = useCallback( async() => {
    const docRef = doc(db, "users", auth.currentUser.email);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUser(docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
},[auth.currentUser.email])
  
useEffect(()=>{
    getUserData()
  },[getUserData])

  useEffect(()=>{
    setEmail(prev=>user.email)
    setName(prev=>user.name)
    setUsername(prev=>user.username)
    setPhoneNumber(prev=>user.phoneNumber)
  },[user])

  const saveLoginState = async () => {
    try{
      await AsyncStorage.setItem('LoggedIn','false');
      console.log('set value');
    }catch(err){
      console.log(err);
    }
  }
const deleteAccount = () => {
  console.log('deleting');
  deleteUser(auth.currentUser).then(() => {
    saveLoginState();
    props.navigation.replace('Login')
  }).catch((error) => {
    
  });
}

    return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={[styles.container,{paddingHorizontal: 16}]} behavior='padding'>
            <View style={styles.inputContainer}>
              <Text style={[styles.header,{marginBottom: 16}]}>Update Profile</Text>
              
              <View style={{borderRadius: 500, marginBottom: 16, }}>
                <Image source={require('../assets/user.jpg')} style={{width: 150, height: 150, borderRadius: 500, position: 'relative'}} resizeMode={'contain'}/>
                <TouchableOpacity style={{position: 'absolute', backgroundColor: 'rgba(1,1,1,0.1)', width: 150, height: 150, borderRadius: 500, alignItems: 'center', justifyContent: 'space-evenly'}}>
                  <MaterialIcons name='add-photo-alternate' size={40} color={'#fff'}/>
                  <Text style={{color: 'white', fontSize: 16, textAlign: 'center', fontWeight: '500'}}>Change Profile Photo</Text>
                </TouchableOpacity>
            </View>
              <View style={[styles.inputField,{marginBottom: 8}]}>
                <MaterialIcons name='person-outline' size={24} color='#666'/>
                <TextInput
                  placeholder='Full Name'
                  style={[styles.input,styles.marginVertical]}
                  value={name}
                  onChangeText={text=>setName(text)}
                />
              </View>
              <View style={[styles.inputField,{marginBottom: 8}]}>
        
                <MaterialIcons name='mail-outline' size={24} color='#666'/>
                <TextInput
                  placeholder='Email ID'
                  style={[styles.input,styles.marginVertical]}
                  value={email}
                  onChangeText={text=>setEmail(text)}
                />
              </View>
              <View style={[styles.inputField,{marginBottom: 8}]}>
                <MaterialIcons name='alternate-email' size={24} color='#666'/>
                <TextInput
                  placeholder='Username'
                  style={[styles.input,styles.marginVertical]}
                  value={username}
                  onChangeText={text=>setUsername(text)}
                />
              </View>
              <View style={[styles.inputField,{marginBottom: 8}]}>
                <MaterialIcons name='phone' size={24} color='#666'/>
                <TextInput
                  placeholder='Phone Number'
                  style={[styles.input,styles.marginVertical]}
                  value={phoneNumber}
                  onChangeText={text=>setPhoneNumber(text)}
                />
              </View>
              <View style={styles.buttons}>
        <TouchableOpacity onPress={()=>{}} style={styles.button}>
            <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
        <View style={styles.or}>
            <View style={styles.line}></View>
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line}></View>
        </View>
        <TouchableHighlight underlayColor={'rgba(250,40,65,0.5)'} onPress={deleteAccount} style={[styles.button,{backgroundColor: 'transparent'}]}>
            <Text style={[styles.buttonText,{color:'red'}]}>Delete Account</Text>
        </TouchableHighlight>
      </View>
            </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default UpdateProfile