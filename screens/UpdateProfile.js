import { Keyboard,Image,KeyboardAvoidingView,StyleSheet,TextInput, Text, TouchableWithoutFeedback,TouchableHighlight, View, TouchableOpacity } from 'react-native'
import React,{useEffect, useState, useMemo, useCallback} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {styles} from '../styles/AppStyles'
import { auth,db } from '../firebase'
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs,collection, deleteDoc } from "firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { deleteUser } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuth, updateProfile, updateEmail,signOut  } from "firebase/auth";
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import ImgToBase64 from 'react-native-image-base64';

const UpdateProfile = (props) => {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [bio,setBio] = useState('')
  const [usernames,setUsernames]= useState([])
  const [updating,setUpdating] = useState(false)
  const [emailError,setEmailError] = useState('')
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const [hasGalleryPermissions, setHasGalleryPermissions] = useState(null)

  const authentication = getAuth();
  const navigation = useNavigation()

  useEffect(()=>{
  (async ()=> {
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
    setHasGalleryPermissions(prev=>galleryStatus.status === 'granted')
  }) 
  ();
  },[])

  const handleImage = async () => {
    if(!hasGalleryPermissions){
      setImageError(prev=>'*Please grant gallery access.')
    }
    else{
      await pickImage()
      console.log(image);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    })
    console.log(result);
    if(!result.cancelled){
      setImage(result.uri)
    }
  }



const getUserData = useCallback( async() => {
    const docRef = doc(db, "users", authentication.currentUser?.email);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUser(docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
},[authentication.currentUser?.email])
  
useEffect(()=>{
    getUserData()
  },[getUserData])

  useEffect(()=>{
    setEmail(prev=>user.email)
    setName(prev=>user.name)
    setUsername(prev=>user.username)
    setPhoneNumber(prev=>user.phoneNumber)
    setBio(prev=>user.bio)
    setImage(prev=>user.photo)
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
  deleteUser(authentication.currentUser).then(() => {
    console.log('deleted');
    saveLoginState();
    navigation.replace('Login')
  }).catch((error) => {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  });
  
}
const logout = ()=>{
  signOut(authentication).then(() => {
    saveLoginState();
    navigation.replace('Login')
  }).catch((error) => {
    console.log(error);
  });
}

  const validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      setEmailError(prev=>'*Incorrect email address')
      setEmail(prev=>text)
      return false;
    }
    else {
      setEmail(prev=>text)
      setEmailError(prev=>'')
      console.log("Email is Correct");
    }
  }

  useEffect(() => {
    if(open){
    setTimeout(() => {
       setOpen(prev=>false)
    }, 2000); 
  }
  }, [open]);
const saveUsername = async () => {
  try{
    const docRef = doc(db, "username", user.email);
    await deleteDoc(docRef);
    await setDoc(doc(db,"username",email), {
      username: username,
      bio:bio
      });
      await AsyncStorage.setItem('Username',username);
      await AsyncStorage.setItem('Bio',bio);
  }catch(err){
    console.log(err);
  }
}


const updateUserProfile = async() => {
  Keyboard.dismiss()
  if(emailError ===''){
    
  setUpdating(prev=>true)
  const docRef = doc(db, "users", user.email);
  if(name!==user.name || username!==user.username || phoneNumber!==user.phoneNumber || bio!==user.bio || email!==user.email || image!==user.photo){
    await deleteDoc(docRef);
    await setDoc(doc(db, "users", email),{
    ...user,
    name: name,
    username: username,
    phoneNumber: phoneNumber,
    bio: bio,
    email: email,
    photo: image,
    });
    setOpen(prev=>true)
  }
  await saveUsername()
  
    if(name!==user.name || image!==user.photo){
    await updateProfile(authentication.currentUser, {
      displayName: name, photoURL: image
    }).then(() => {   
    }).catch((error) => {
      console.log(error);
    });
  }
    if(email !== user.email){
    await updateEmail(authentication.currentUser, email).then(() => {
      // Email updated!
      console.log('====================================');
      console.log('email updated: ');
      console.log('====================================');
      // ...
    }).catch((error) => {
      // An error occurred
      // ...
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    });
  }
    
    setUpdating(prev=>false)
    
    // setTimeout(()=>{
    //   setOpen(prev=>false)
    // },[3000])
    if(email !== user?.email){
      logout()
    }
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
    <SafeAreaView style={{flex: 1,backgroundColor:'rgba(0,0,0,0.5)',}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={[styles.container,{justifyContent:'flex-end'}]}  behavior='padding'>
        <View style={[styles.inputContainer,{justifyContent:'space-between',paddingHorizontal: 16,paddingBottom:32,backgroundColor:'#fff',borderTopLeftRadius:32,borderTopRightRadius:32,elevation:8}]}>
        <View style={{alignSelf:'center',position:"relative",marginVertical:16,backgroundColor:'rgba(0,0,0,0.1)',borderRadius:8,width:'25%',height:6}}></View>
            
              <Text style={[styles.header,{marginBottom: 16}]}>Update Profile</Text>
              
              <View style={{borderRadius: 500, marginBottom: 16, }}>
                {image ? <Image source={{uri:image}} style={{width: 150, height: 150, borderRadius: 500, position: 'relative'}} resizeMode={'contain'}/> : <MaterialIcons name='account-circle' size={150} color='gray'/>}
                <TouchableOpacity 
                onPress={handleImage}
                style={{position: 'absolute', backgroundColor: 'rgba(1,1,1,0.1)', width: 150, height: 150, borderRadius: 500, alignItems: 'center', justifyContent: 'space-evenly'}}>
                  <MaterialIcons name='add-photo-alternate' size={40} color={'#fff'}/>
                  <Text style={{color: 'white', fontSize: 16, textAlign: 'center', fontWeight: '500'}}>Change Profile Photo</Text>
                </TouchableOpacity>
                {imageError !== '' && <Text style={{marginVertical:8,color:'red'}}>{imageError}</Text>}
            </View>
              <View style={[styles.inputField,{marginBottom: 4}]}>
                <MaterialIcons name='person-outline' size={24} color='#666'/>
                <TextInput
                  placeholder='Full Name'
                  style={[styles.input,styles.marginVertical]}
                  value={name}
                  onChangeText={text=>setName(text)}
                  autoCapitalize={'words'}
                />
              </View>
              <View style={[styles.inputField,{marginBottom: 4,flexWrap:'wrap'}]}>
        
                <MaterialIcons name='mail-outline' size={24} color='#666'/>
                <TextInput
                  placeholder='Email ID'
                  style={[styles.input,styles.marginVertical]}
                  value={email}
                  onChangeText={text=>{validate(text)}}
                  keyboardType={'email-address'}
                />
                {emailError!=='' && <Text style={{color:'red',alignSelf:'center',textAlign:'center',width:'100%'}}>{emailError}</Text>}
              </View>
              {/* <View style={[styles.inputField,{marginBottom: 4,flexWrap:'wrap'}]}>
                <MaterialIcons name='alternate-email' size={24} color='#666'/>
                <TextInput
                  placeholder='Username'
                  style={[styles.input,styles.marginVertical]}
                  value={username}
                  onChangeText={text=>setUsername(text)}
                  autoCapitalize={'none'}
                />
              {(usernames.includes(username) && username!==user.username) && <Text style={{color:'red',alignSelf:'center',textAlign:'center',width:'100%'}}>*Username already taken.</Text>}
              </View> */}
              <View style={[styles.inputField,{marginBottom: 4}]}>
                <MaterialIcons name='phone' size={24} color='#666'/>
                <TextInput
                  placeholder='Phone Number'
                  style={[styles.input,styles.marginVertical]}
                  value={phoneNumber}
                  onChangeText={text=>setPhoneNumber(text)}
                  keyboardType={'phone-pad'}
                />
              </View>
              <View style={[styles.inputField,{marginBottom: 4}]}>
              <MaterialCommunityIcons name='text-account' size={24} color='#666'/>
                <TextInput
                multiline={true}
                numberOfLines={5}
                  placeholder='Add Bio...'
                  style={[styles.input,styles.marginVertical,{height:100, textAlignVertical: 'top'}]}
                  value={bio}
                  onChangeText={text=>setBio(text)}
                />
              </View>
              <View style={styles.buttons}>
        <TouchableOpacity onPress={()=>{if(!(usernames.includes(username) && username!==user.username) || name!==user.name || email!==user.email || phoneNumber!==user.phoneNumber) updateUserProfile()}} style={styles.button}>
            <Text style={styles.buttonText}>{updating ? 'Updating...' : 'Update Profile'}</Text>
        </TouchableOpacity>
        
        {/* <View style={styles.or}>
            <View style={styles.line}></View>
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line}></View>
        </View>
        <TouchableHighlight underlayColor={'rgba(250,40,65,0.5)'} onPress={deleteAccount} style={[styles.button,{backgroundColor: 'transparent'}]}>
            <Text style={[styles.buttonText,{color:'red'}]}>Delete Account</Text>
        </TouchableHighlight> */}
      </View>
      {open && <View style={{display:'flex',flexDirection:'column',position:'absolute',top:-50,width:'100%',padding:16,paddingVertical:24,alignSelf:'center',margin:8,marginBottom:16,borderRadius:16,backgroundColor:'rgba(240,245,255,0.995)',elevation:5,shadowOffset:10,shadowRadius:300,shadowColor:'rgba(240,245,255,0.8)',alignItems:'center',justifyContent:'space-evenly'}}>
              <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',width:'100%'}}>
              <MaterialCommunityIcons style={{padding:16,borderRadius:300,backgroundColor:'rgba(35, 134, 54,0.1)'}} name='account-check' size={52} color='rgb(35, 134, 54)'/>
              <View>
              <Text style={{fontSize:20,fontWeight:'500',textAlign:'center'}}>Profile Updated</Text>
              <Text style={{fontSize:24,fontWeight:'600',textAlign:'center'}}>Succesfully!</Text>
              </View>
              </View>
              {email!==user.email && <View style={{display:'flex',flexDirection:'row',marginTop:8}}>
              <Text>Email updated. </Text>
              <Text>Signing out...</Text>
              </View>}
            </View>}
            </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default UpdateProfile