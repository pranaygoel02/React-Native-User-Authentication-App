import { StyleSheet,Modal, Text, View, RefreshControl, ScrollView, TouchableHighlight } from 'react-native'
import {auth} from '../firebase'
import React, {useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import GestureRecognizer from 'react-native-swipe-gestures';
import AddPost from './AddPost'

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};


const Feed = ({navigation,route}) => {
  console.log('auth.currentUser?.email: ', auth.currentUser?.email);
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible,setModalVisible] = useState(false)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(()=>{
    onRefresh()
  },[])


  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={auth.currentUser?.emailVerified && styles.verified}>{auth.currentUser?.email}</Text>
      <Text>Hello</Text>
      </ScrollView>
      <GestureRecognizer onSwipeDown={()=>setModalVisible(false)}>
        <Modal
          animationType='slide'
          visible={modalVisible}
          statusBarTranslucent = { true}
          onRequestClose={()=>setModalVisible(false)}>
          <AddPost onClose={()=>setModalVisible(false)} />
        </Modal>
      </GestureRecognizer>
      <View>
      <TouchableHighlight onPress={()=>setModalVisible(true)} style={{position: 'absolute', bottom: 10, right: 10, zIndex: 1, backgroundColor: 'rgb(96, 203, 255)', borderRadius: 100, padding: 18}}>
        <MaterialIcons name='add' size={20} color={'rgb(0,0,0)'}/>
      </TouchableHighlight>
      </View>
    
    </SafeAreaView>
  )
}

export default Feed

const styles = StyleSheet.create({
    verified:{
        color: 'green'
      }
})