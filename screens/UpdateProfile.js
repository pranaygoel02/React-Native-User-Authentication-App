import { Keyboard,Image,KeyboardAvoidingView,StyleSheet,TextInput, Text, TouchableWithoutFeedback,TouchableHighlight, View, TouchableOpacity } from 'react-native'
import React,{useEffect, useState, useMemo, useCallback} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {styles} from '../styles/AppStyles'
import { auth,db } from '../firebase'
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs,collection } from "firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { deleteUser } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuth, updateProfile, updateEmail  } from "firebase/auth";
import { useNavigation } from '@react-navigation/native'

const UpdateProfile = (props) => {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [usernames,setUsernames]= useState([])
  const [updating,setUpdating] = useState(false)
  const [emailError,setEmailError] = useState('')
  // const auth = getAuth();
  const navigation = useNavigation()

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
  console.log('====================================');
  console.log(auth.currentUser);
  console.log('====================================');
  deleteUser(auth.currentUser).then(() => {
    console.log('deleted');
    saveLoginState();
    navigation.replace('Login')
  }).catch((error) => {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  });
  
}

useEffect(()=>{
  const validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (!reg.test(text)) {
      setEmailError(prev=>'Email is Not Correct');
    }
    else {
      setEmailError(prev=>'')
    }
  }
  validate(email)
},[email])

const updateUserProfile = async() => {
  if(emailError ===''){
    
  setUpdating(prev=>true)
  const docRef = doc(db, "users", auth.currentUser?.email);
  if(name!==user.name || username!==user.username || phoneNumber!==user.phoneNumber){
    
  await updateDoc(docRef, {
    name: name,
    username: username,
    phoneNumber: phoneNumber
    });
    
  }
    if(name!==user.name){
    updateProfile(auth.currentUser, {
      displayName: name, photoURL: ""
    }).then(() => {   
    }).catch((error) => {
      console.log(error);
    });
  }
    if(email !== user.email){
    updateEmail(auth.currentUser, email).then(() => {
      // Email updated!
      // ...
    }).catch((error) => {
      // An error occurred
      // ...
    });
  }
    
    setUpdating(prev=>false)
    
  }
}
const getUsernames = useCallback(async() => {
  console.log('getting usernames');
  // setUsernames(prev=>[])
  try{
    const querySnapshot = await getDocs(collection(db, "username"));
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      setUsernames(prev=>[...new Set([...prev,doc.data().username])])
      })
  }catch(e){
    console.log(e);
  }
  },[])
useEffect(()=>{
  // setUsernames([])
  
  getUsernames()
},[getUsernames])
console.log('====================================');
console.log('usernames: ',usernames);
console.log('====================================');


    return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={[styles.container,{paddingHorizontal: 16}]} behavior='padding'>
            <View style={styles.inputContainer}>
              <Text style={[styles.header,{marginBottom: 16}]}>Update Profile</Text>
              
              <View style={{borderRadius: 500, marginBottom: 16, }}>
                <Image source={require('../assets/user.png')} style={{width: 150, height: 150, borderRadius: 500, position: 'relative'}} resizeMode={'contain'}/>
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
                  onChangeText={text=>setEmail(prev=>text)}
                />
                {emailError!=='' && <Text style={{color:'red',alignSelf:'center',textAlign:'center',width:'100%'}}>{emailError}</Text>}
              </View>
              <View style={[styles.inputField,{marginBottom: 8,flexWrap:'wrap'}]}>
                <MaterialIcons name='alternate-email' size={24} color='#666'/>
                <TextInput
                  placeholder='Username'
                  style={[styles.input,styles.marginVertical]}
                  value={username}
                  onChangeText={text=>setUsername(text)}
                />
              {(usernames.includes(username) && username!==user.username) && <Text style={{color:'red',alignSelf:'center',textAlign:'center',width:'100%'}}>*Username already taken.</Text>}
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
        <TouchableOpacity onPress={()=>{if(!(usernames.includes(username) && username!==user.username) || name!==user.name || email!==user.email || phoneNumber!==user.phoneNumber) updateUserProfile()}} style={styles.button}>
            <Text style={styles.buttonText}>{updating ? 'Updating...' : 'Update Profile'}</Text>
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