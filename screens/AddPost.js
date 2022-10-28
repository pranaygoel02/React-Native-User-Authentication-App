import { Keyboard,Image,KeyboardAvoidingView,StyleSheet,TextInput, Text, TouchableWithoutFeedback,TouchableHighlight, View, TouchableOpacity } from 'react-native'
import React,{useEffect, useState, useMemo, useCallback} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {styles} from '../styles/AppStyles'
import { auth,db } from '../firebase'
import { doc, setDoc, getDoc } from "firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { deleteUser } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AddPost = () => {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
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
    setTitle(prev=>'')
  },[])

  

    return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={[styles.container,{paddingHorizontal: 16}]} behavior='padding'>
            <View style={styles.inputContainer}>
              <Text style={[styles.header,{marginBottom: 16}]}>Post your query</Text>
              <View style={[styles.inputField,{marginBottom: 8}]}>
                <TextInput
                  multiline={true}
                 numberOfLines={2}
                  placeholder='Title...'
                  style={[styles.input,styles.input_post,styles.marginVertical]}
                  value={title}
                  onChangeText={text=>setTitle(text)}
                />
              </View>
              <View style={[styles.inputField,{marginBottom: 8}]}>
                <TextInput
                multiline={true}
                numberOfLines={10000}
                  placeholder='Add query...'
                  style={[styles.input,styles.input_post,styles.marginVertical,{height:200, textAlignVertical: 'top'}]}
                  value={phoneNumber}
                  onChangeText={text=>setQuery(text)}
                />
              </View>
              <View style={styles.buttons}>
        <TouchableOpacity onPress={()=>{}} style={styles.button}>
            <Text style={styles.buttonText}>Post Query</Text>
        </TouchableOpacity>
      </View>
            </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default AddPost