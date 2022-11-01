import { KeyboardAvoidingView,SafeAreaView,TouchableWithoutFeedback,Keyboard ,Alert ,StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React,{useEffect, useState} from 'react'
import { useFonts } from 'expo-font' ;
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {auth,db} from '../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc,getDocs, doc,collection } from 'firebase/firestore'
import GoogleLogin from '../components/GoogleLogin';
import {styles} from '../styles/AppStyles'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Signup = ({navigation}) => {
    const [showPass, setShowPass] = useState(false)
    const [showCPass, setShowCPass] = useState(false)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [CPassword, setCPassword] = useState('')
    const [validateMessage, setValidateMessage] = useState(null)
    const [signingin,setSigningin] = useState(false)
    const [usernames, setUsernames] = useState([])
  

    useEffect(()=>{
        if(CPassword !== password){
            setValidateMessage('Passwords do not match')
        }
        else{
            setValidateMessage(null)
        }
    },[CPassword,password])

    useEffect(()=>{
        setValidateMessage(prev=>null)
    },[email])

    const createSucessAlert = () =>
    Alert.alert(
      "Sign up successful",
      `Verification email sent to ${auth.currentUser.email}`,
      [
        { text: "OK", onPress: () => navigation.replace('Home') }
      ]
    );
    const saveLoginState = async () => {
      try{
        await AsyncStorage.setItem('LoggedIn','true');
      }catch(err){
        console.log(err);
      }
    }
    const getUsernames = async() => {
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
      }
    useEffect(()=>{
      // setUsernames([])
      
      getUsernames()
    },[])
console.log('====================================');
console.log('usernames: ',usernames);
console.log('====================================');

    const clearForm = () => {
        setEmail('')
        setUsername('')
        setPassword('')
        setCPassword('')
        setSigningin(prev=>!prev)
        saveLoginState();
        createSucessAlert();
    }

    const addUserToFirestore = async (data) => {
        console.log('adding data: ', data);
        await setDoc(doc(db, "users", data.email), data);
        await setDoc(doc(db, "username", data.email), {username:data.username});
    }
    
    // const addUsername = async (data) => {
    //     await setDoc(doc(db, "username", data.email), username);
    // }

    let signup = async ()=>{
        Keyboard.dismiss()
        if(password!=='' && CPassword!=='' &&  password === CPassword && username!=='' && email!==''){
          if(!usernames.includes(username)){
            setSigningin(prev=>!prev)
            setValidateMessage(prev=>'')
              await createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                  console.log(validateMessage);
                  sendEmailVerification(auth.currentUser)
                  // addUserToFirestore();
                  console.log('====================================');
                  console.log(auth.currentUser);
                  console.log('====================================');
                  let data = {
                      createdAt: new Date(),
                      // uid: auth.currentUser.stsTokenManager.uid,
                      name: auth.currentUser.displayName ? auth.currentUser.displayName : '',
                      email: auth.currentUser.email,
                      photo: auth.currentUser.photoURL ? auth.currentUser.photoURL : '',
                      phoneNumber: auth.currentUser.phoneNumber ? auth.currentUser.phoneNumber : '',
                      username: username,
                    }
                    addUserToFirestore(data);
                  // addUsername(data);
                  clearForm();
                  
              })
              .catch((error) => {
                  console.log(error);
              let errorCode = error.code;
              console.log(errorCode);
              let errorMessage = error.message;
              errorMessage ? setValidateMessage(prev=>error.message) : setValidateMessage(null)
              setSigningin(prev=>!prev)
            });
          }
          else{
            setValidateMessage(prev=>'Username already taken.')
          }
        }
        else if(password==='') setValidateMessage(prev=>'Please enter password.')
        else setValidateMessage(prev=>'*All fields are required.')
        // setSigningin(prev=>!prev)
    }


    const [loaded] = useFonts({
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
  })
  
  if(!loaded) return null;

    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View>
            <Image source={require('../assets/signup.png')} style={{width: 270, height: 310}} resizeMode='contain'></Image>
        </View>
      <View style={styles.login}>
      <View style={styles.inputContainer}>
        <View style={{paddingVertical: 0}}>
          <Text style={styles.header}>Sign up</Text>
        </View>
        <View style={styles.inputField}>
        <MaterialIcons name='mail-outline' size={24} color='#666'/>
        <TextInput
            placeholder='Email ID'
            name='email'
            style={[styles.input, {marginVertical: 8}]}
            value={email}
            onChangeText={text=>setEmail(text)}
        />
        </View>
        <View style={styles.inputField}>
        <MaterialIcons name='alternate-email' size={24} color='#666'/>
        <TextInput
            placeholder='Username'
            name='username'
            style={[styles.input, {marginVertical: 8}]}
            value={username}
            onChangeText={text=>setUsername(text)}
        />
        </View>
        <View style={styles.inputField}>
        <MaterialIcons name='lock-outline' size={24} color='#666'/>
        <View style={styles.password}>
            <TextInput
                placeholder='Password'
                style={[styles.input, {marginVertical: 8}]}
                name="password"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <MaterialIcons name={showPass ? 'visibility' : 'visibility-off'} onPress={()=>{setShowPass(prev=>!prev)}} size={24} color='#666'/>
        </View>
        </View>
        <View style={styles.inputField}>
        <MaterialIcons name='lock-outline' size={24} color='#666'/>
        <View style={styles.password}>
            <TextInput
                placeholder='Confirm Password'
                name="confirm-password"
                style={[styles.input, {marginVertical: 8}]}
                secureTextEntry={!showCPass}
                value={CPassword}
                onChangeText={text => setCPassword(text)}
            />
            <MaterialIcons name={showCPass ? 'visibility' : 'visibility-off'} onPress={()=>{setShowCPass(prev=>!prev)}} size={24} color='#666'/>
        </View>
        </View>
        {validateMessage && <Text style={styles.error}>{validateMessage}</Text>}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity disabled={signingin} onPress={signup} style={styles.button}>
            <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        {/* <View style={styles.or}>
            <View style={styles.line}></View>
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line}></View>
        </View>
        <GoogleLogin navigation={navigation} text = 'Sign up'/> */}
      </View>
    <Text style={styles.signup}>Already have an account? <Text onPress={()=>{navigation.replace('Login')}} style={styles.link}>Login</Text></Text>
    </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default Signup