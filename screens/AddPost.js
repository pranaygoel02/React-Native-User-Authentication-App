import { Keyboard,Image,KeyboardAvoidingView,StyleSheet,TextInput, Text, TouchableWithoutFeedback,TouchableHighlight, View, TouchableOpacity, ScrollView } from 'react-native'
import React,{useEffect, useState, useMemo, useCallback} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {styles} from '../styles/AppStyles'
import { auth,db } from '../firebase'
import { doc, setDoc, getDoc } from "firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { deleteUser } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { tags } from '../utils/tags'
import uuid from 'react-native-uuid';

const AddPost = () => {
  const [title, setTitle] = useState('')
  const [query, setQuery] = useState('')
  const [userQues, setUserQues] = useState('')
  const [tags, setTags] = useState('')
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

const newPost = async () => {
  setError(prev=>'')
  setAdding(prev=>true)
    console.log('adding ques');
    const tagsArr = tags.split('@')
    await setDoc(doc(db, "questions", auth.currentUser.email), 
    {
      questions: [...userQues,
        {
          id: uuid.v4(),
          date: new Date().toISOString(),
          author: auth.currentUser.displayName ? auth.currentUser.displayName : auth.currentUser.email,
          author_mail: auth.currentUser.email,
          title: title,
          query: query,
          tags: tagsArr,
          open: true,
          votes: 0,
          voters : []
        }
      ]
    });
    setTitle(prev=>'')
    setQuery(prev=>'')
    setTags(prev=>'')
    setAdding(prev=>false)
    setAdded(prev=>true)
    setTimeout(()=>{
      setAdded(prev=>false)
    },1500)
}


  const getUserQuestions = async() => {
    const docRef = doc(db, "questions", auth.currentUser?.email);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data().questions);
      setUserQues(docSnap.data().questions)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
}

useEffect(()=>{
  setTitle(prev=>'')
  setQuery(prev=>'')
  getUserQuestions()
  },[])

  

    return (
    <SafeAreaView style={{flex: 1,backgroundColor:'rgba(0,0,0,0.5)',}}>
      {/* {!adding &&  */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={[styles.container,{justifyContent:'flex-end'}]} behavior='padding'>
            <View style={[styles.inputContainer,{justifyContent:'space-between',paddingHorizontal: 16,paddingBottom:32,backgroundColor:'#fff',borderTopLeftRadius:32,borderTopRightRadius:32,elevation:8}]}>
            <View style={{alignSelf:'center',marginVertical:16,backgroundColor:'rgba(0,0,0,0.1)',borderRadius:8,width:'25%',height:6}}></View>
              <View>
              <Text style={[styles.header,{marginBottom: 16,alignSelf:'flex-start'}]}>Post your query</Text>
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
                  style={[styles.input,styles.input_post,styles.marginVertical,{height:240, textAlignVertical: 'top'}]}
                  value={query}
                  onChangeText={text=>setQuery(text)}
                />
              </View>
              <Text style={{marginVertical:8}}>{query.length} characters</Text>
              <TextInput value={tags} onChangeText={(text)=>setTags(prev=>text)} style={[styles.input,styles.input_post,{color:'rgb(24,152,254)',fontSize:16}]} placeholder='Add tags... For Example: @Nodejs @Reactjs...'/>
              </View>
              <View style={{display:'flex'}}>
                <TouchableOpacity disabled={adding} onPress={()=>{
                  if(title!=='' && query !== '')
                    newPost()
                  else
                    setError(prev=>'All fields are required to post a query.')
                  }} style={styles.button}>
                  <Text style={styles.buttonText}>{adding ? 'Adding...' : 'Post'}</Text>
                </TouchableOpacity>
                {error!=='' && <Text style={{color:'red',textAlign:'center'}}>{error}</Text>}
              </View>
            </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/* {adding &&
      <View>
      <Image source={require('../assets/login1.png')} style={{width: 270, height: 310}} resizeMode='contain'></Image>
  </View>} */}
    </SafeAreaView>
  )
}

export default AddPost