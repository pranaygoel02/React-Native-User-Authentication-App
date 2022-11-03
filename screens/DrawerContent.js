import React, {useState,useEffect} from 'react'
import { StyleSheet, Text,Modal, Image,View, TouchableOpacity, TouchableHighlight } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import {DrawerContentScrollView,DrawerItemList,DrawerItem, Drawer} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {auth,db} from '../firebase'
import { signOut } from 'firebase/auth';
import UpdateProfile from './UpdateProfile';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/AppStyles';

const DrawerContent = (props) => {

    const [modalVisible, setModalVisible] = useState(false)
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [photo, setPhoto] = useState(auth.currentUser.photoURL)

    useEffect(()=>{
      setPhoto(prev=>auth.currentUser.photoURL)
    },[auth.currentUser.photoURL])

    useEffect(()=>{
      const getUsername = () => {
        // console.log('use effect running');
        try{
          AsyncStorage.getItem('Username')
          .then(value => {
            // console.log(value);
            setUsername(prev=>value)
          })
          AsyncStorage.getItem('Bio')
          .then(value => {
            // console.log(value);
            setBio(prev=>value)
          })
        }catch(err){
          console.log(err);
        }
      }
      getUsername()
    })
    
    const saveLoginState = async () => {
      try{
        await AsyncStorage.setItem('LoggedIn','false');
      }catch(err){
        console.log(err);
      }
    }
    const logout = ()=>{
        signOut(auth).then(() => {
          saveLoginState();
          props.navigation.replace('Login')
        }).catch((error) => {
          // An error happened.
        });
        // props.navigation.replace('Login')
      }
    console.log(auth.currentUser.displayName);
  return (
    <View style={{flex:1, alignItems: 'center'}}>
      <GestureRecognizer onSwipeDown={()=>setModalVisible(false)}>
        <Modal
          animationType='slide'
          visible={modalVisible}
          statusBarTranslucent = { true}
          transparent={true}
          onRequestClose={()=>setModalVisible(false)}>
          <UpdateProfile {...props} onClose={()=>setModalVisible(false)} />
        </Modal>
      </GestureRecognizer>
      <View style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%'}}>
        <View style={{display:'flex',alignItems: 'center', width: '100%', paddingHorizontal: 25, paddingTop: 36}}>
        <View style={{borderRadius: 500, position: 'relative',borderColor:'blue',borderWidth:3,borderRadius:200,borderColor:'rgb(25, 134, 214)'}}>
          {photo ? <Image source={{uri: photo}} style={{width: 150, height: 150, borderRadius: 500,borderWidth:2,borderColor:'#fff'}} resizeMode={'contain'}/> : <MaterialIcons name='account-circle' size={150} color='gray'/>}
          {/* <TouchableHighlight onPress={()=>setModalVisible(true)} style={{position: 'absolute', zIndex: 1, backgroundColor: 'rgb(179, 198, 234)', bottom: 10, right: 10, borderRadius: 20, padding: 6}}>
            <MaterialIcons name='edit' size={20} color={'rgb(0, 120, 200)'}/>
          </TouchableHighlight> */}
        </View>
        <Text style={{marginTop:16,fontSize:32,fontWeight:'500'}}>{auth.currentUser?.displayName ? auth.currentUser?.displayName : `@${username}`}</Text>
        {auth.currentUser?.displayName && <Text style={{marginVertical:10,fontSize:22,fontWeight:'400',color:'#666'}}>@{username}</Text>}
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginVertical:5,}}>
          <MaterialIcons name='mail-outline' style={{marginRight:8}} size={24} color='#666'/>
          <Text style={{fontSize:16,fontWeight:'400',color:'#666'}}>{auth.currentUser?.email}</Text>
        </View>
        <Text style={{marginVertical:10,fontSize:16,color:'#000'}}>{bio!=='' ? bio : 'Update Profile To Add Bio'}</Text>
        <TouchableOpacity onPress={()=>setModalVisible(true)} style={{marginVertical:2,display:'flex',flexDirection:'row',alignItems:'center', padding:8,justifyContent:'center', borderColor: 'rgba(0,0,0,0.1)',borderWidth:0.2,backgroundColor: ' rgb(25, 134, 214)', borderRadius: 100, paddingHorizontal: 8,marginVertical:16}}>
        <MaterialIcons name='edit' size={24} color='#fff'/>
        <Text style={[{marginHorizontal:8,color:'#fff'}]}>Update Profile</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={logout} style={{marginVertical:2,display:'flex',flexDirection:'row',alignItems:'center', padding:12,paddingHorizontal:8,justifyContent:'center', borderColor: 'rgba(0,0,0,0.1)',borderTopWidth:0.2}}>
        <MaterialIcons name='logout' size={24} color={'red'}/>
        <Text style={{marginHorizontal:8,color:'red'}}>Sign Out</Text>
        </TouchableOpacity>
      </View>
        {/* <DrawerContentScrollView style={{paddingHorizontal: 10,width: '100%'}} {...props}>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <DrawerItem
            icon={()=>(<MaterialIcons name='logout' size={24} color={'#666'}/>)}
            label='Sign Out'
            onPress={logout}
            style={{paddingHorizontal: 10,borderTopColor:'#666',borderTopWidth:0.2, width: '100%'}}
        /> */}
      
    </View>
  )
}

export default DrawerContent