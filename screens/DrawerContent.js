import React, {useState} from 'react'
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

const DrawerContent = (props) => {

    const [modalVisible, setModalVisible] = useState(false)
    
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
    
  return (
    <SafeAreaView style={{flex:1, alignItems: 'center'}}>
      <GestureRecognizer onSwipeDown={()=>setModalVisible(false)}>
        <Modal
          animationType='slide'
          visible={modalVisible}
          statusBarTranslucent = { true}
          onRequestClose={()=>setModalVisible(false)}>
          <UpdateProfile {...props} onClose={()=>setModalVisible(false)} />
        </Modal>
      </GestureRecognizer>
      <View style={{alignItems: 'center', width: '100%', paddingHorizontal: 25, marginVertical: 15}}>
        <View style={{borderRadius: 500, position: 'relative'}}>
          <Image source={require('../assets/user.png')} style={{width: 150, height: 150, borderRadius: 500}} resizeMode={'contain'}/>
          <TouchableHighlight onPress={()=>setModalVisible(true)} style={{position: 'absolute', zIndex: 1, backgroundColor: 'rgb(179, 198, 234)', bottom: 10, right: 10, borderRadius: 20, padding: 6}}>
            <MaterialIcons name='edit' size={20} color={'rgb(0, 120, 200)'}/>
          </TouchableHighlight>
        </View>
        <Text>{auth.currentUser?.email}</Text>
        <TouchableOpacity onPress={logout} style={{marginVertical:2,display:'flex',flexDirection:'row',alignItems:'center', padding:2,paddingHorizontal:8,justifyContent:'center', elevation: 2,backgroundColor:'#fff',borderColor: 'rgb(226, 233, 270)',borderWidth:1,borderRadius:8}}>
        <MaterialIcons name='logout' size={24} color={'#666'}/>
        <Text style={{marginHorizontal:8}}>Sign Out</Text>
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
      
    </SafeAreaView>
  )
}

export default DrawerContent

const styles = StyleSheet.create({})