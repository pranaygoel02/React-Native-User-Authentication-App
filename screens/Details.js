import { StyleSheet,Modal,Image, Text, View, RefreshControl, ScrollView,FlatList, TouchableOpacity } from 'react-native'
import {auth,db} from '../firebase'
import React, {useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GestureRecognizer from 'react-native-swipe-gestures';
import { doc, getDoc } from "firebase/firestore";
import {styles} from '../styles/AppStyles'
import AddPost from './AddPost'
import QuesCard from '../components/QuesCard'
import Checkbox from 'expo-checkbox';


const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};


const Feed = ({navigation,route}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible,setModalVisible] = useState(false)
  const [docs,setDocs] = useState([])
  const [newest, setNewest] = useState(true)
  const [list, setList] = useState([])
  const [showOpen, setShowOpen] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [error,setError] = useState('')

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    getAllDocs();
  }, []);
  
  useEffect(()=>{
    // getAllDocs();
    setList(prev=>[])
    onRefresh()
  },[])
  
  useEffect(()=>{
    setList(prev=>docs)
  },[docs])
  
  const getAllDocs = useCallback(async() => {
    setDocs(prev=>[])
    const docRef = doc(db, "questions", auth.currentUser?.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
    } else {
   // doc.data() will be undefined in this case
       console.log("No such document!");
    }
    docSnap.data().questions.map(doc => {
      // console.log(docs);
      setDocs(prev=>[...new Set([...prev,doc])])
    })
  },[docs])

  console.log('auth.currentUser?.email: ', auth.currentUser?.email);
  list.sort(function(a, b) {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return c-d;
});

  useEffect(()=>{
    if((showClosed && showOpen) || (!showClosed && !showOpen)) setList(prev=>docs)
    if(showClosed && !showOpen)  setList(prev=>docs.filter(doc=>{return doc?.open===false}))
    if(!showClosed && showOpen)  setList(prev=>docs.filter(doc=>{return doc?.open}))
  },[showOpen,showClosed])

  useEffect(()=>{
    if(list.length == 0){
      if((showClosed && showOpen) || (!showClosed && !showOpen)) setError(prev=>`${docs.length ==0 && 'Lets add your first post.'}`)
      if(showClosed && !showOpen)  setError(prev=>`${docs.length == 0 ? 'Lets add your first post.': 'No posts are closed yet.'}`)
      if(!showClosed && showOpen)  setError(prev=> `${docs.length ==0 ? 'Lets add your first post.':'Lets add your next post.'}`)
    }
  },[list])

  return (
    <SafeAreaView style={{flex: 1,alignItems:'center',marginHorizontal:8}}>
      <Text style={styles.header}>Your Posts</Text>
      <View style={{flexDirection: 'row',alignItems: 'center',justifyContent:'space-between',width:'100%'}}>
      <View style={{flexDirection: 'row',alignItems: 'center'}}>
      <View style={{flexDirection: 'row',alignItems: 'center',marginRight:4}}>
      <Checkbox
          style={{marginHorizontal: 4,borderRadius:20}}
          value={showOpen}
          onValueChange={setShowOpen}
          color={showOpen ? 'rgb(25, 134, 214)' : undefined}
        />
        <Text style={{fontSize: 16}}>Open</Text>
      </View>
      <View style={{flexDirection: 'row',alignItems: 'center'}}>
      <Checkbox
          style={{marginHorizontal: 4,borderRadius:20}}
          value={showClosed}
          onValueChange={setShowClosed}
          color={showClosed ? 'rgb(25, 134, 214)' : undefined}
        />
        <Text style={{fontSize: 16}}>Closed</Text>
      </View>
      </View>
      <View style={{marginVertical:2,alignSelf:'flex-end',display:'flex',flexDirection:'row',alignItems:'center', padding:2,paddingHorizontal:8,justifyContent:'center', elevation: 2,backgroundColor:'white',borderColor: 'rgb(226, 233, 270)',borderWidth:1,borderRadius:8}}>
      <Text style={{fontSize:16}}>Showing {newest ? <Text>Latest</Text> : <Text>Oldest</Text>}</Text>
      <TouchableOpacity onPress={()=>{setNewest(prev=>!prev)}} style={{elevation:2,padding:2,shadowColor:'black'}}>
        <MaterialIcons name={newest ? 'arrow-circle-up' : 'arrow-circle-down'} size={24} color={'#000'}/>
      </TouchableOpacity>
      </View>
      </View>
      {list.length>0 ? <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {newest && list.reverse().map(doc=> doc && <QuesCard navigation={navigation} doc={doc}/>)}
        {!newest && list.map(doc=> doc && <QuesCard navigation={navigation} doc={doc}/>)}
      </ScrollView>
      :
      <View style={{flex:1,justifyContent:'center',position:'relative'}}>
        <Text style={{position:'absolute',zIndex:1,fontSize:36,width:'75%',fontWeight:'600',top:60,left:40}}>{error}</Text>
        <Image source={require('../assets/add.png')} style={{width: 330, height: 700}} resizeMode='contain'></Image>
      </View>
        }
      <GestureRecognizer onSwipeDown={()=>{
        getAllDocs()
        setModalVisible(false)
        }}>
        <Modal
          animationType='slide'
          visible={modalVisible}
          statusBarTranslucent = { true}
          onRequestClose={()=>setModalVisible(false)}>
          <AddPost onClose={()=>setModalVisible(false)} />
        </Modal>
      </GestureRecognizer>
      <View>
      <TouchableOpacity onPress={()=>setModalVisible(true)} style={{elevation:4,position: 'absolute', bottom: 16, left: 130, zIndex: 1, backgroundColor: ' rgb(25, 134, 214)', borderRadius: 100, padding: 18}}>
        <MaterialIcons name='add' size={20} color={'#fff'}/>
      </TouchableOpacity>
      </View>
    
    </SafeAreaView>
  )
}

export default Feed