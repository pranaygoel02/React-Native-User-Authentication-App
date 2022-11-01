import { StyleSheet,Modal, Text, View, RefreshControl, ScrollView,FlatList, TouchableOpacity, TextInput } from 'react-native'
import {auth,db} from '../firebase'
import React, {useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import GestureRecognizer from 'react-native-swipe-gestures';
import { collection, getDocs,onSnapshot } from "firebase/firestore";
import {styles} from '../styles/AppStyles'
import AddPost from './AddPost'
import QuesCard from '../components/QuesCard'
import Chip from '../components/Chip'
import Details from './Details'

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};


const Feed = ({navigation,route}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible,setModalVisible] = useState(false)
  const [docs,setDocs] = useState([])
  const [list, setList] = useState([])
  const [newest, setNewest] = useState(true)
  const [search, setSearch] = useState('')

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    getAllDocs();
  }, []);
  
  useEffect(()=>{
    getAllDocs();
    // onRefresh()
    // setList(prev=>docs)
  },[])
  docs.sort(
    function(a, b) {
      var c = new Date(a.date);
      var d = new Date(b.date);
      if(newest) return d-c;
      return c-d;
  }
  )
  useEffect(()=>{
    console.log("docssssssssssssss:",docs);
    setList(prev=>docs)
    console.log(docs);
  },[docs])
  
  const getAllDocs = async() => {
    setDocs(prev=>[])
    console.log('====================================');
    console.log('getting all docsssssssssssssssssssssssssssssssssssssssssssssss');
    console.log('====================================');
    const querySnapshot = await getDocs(collection(db, "questions"));
    querySnapshot.forEach((doc) => {
    doc.data().questions.map(doc => {
      setDocs(prev=>[...new Set([...prev,doc])])
    })
    })
  }

  useEffect(()=>{
    setList(prev=>prev.reverse())
  },[newest])

  // const getAllDocs = useCallback(async() => {
  //   setDocs(prev=>[])
  //   console.log('====================================');
  //   console.log('getting all docs');
  //   console.log('====================================');
  //   const querySnapshot = await getDocs(collection(db, "questions"));
  //   querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   // console.log(doc.id, " => ", doc.data());
  //   doc.data().questions.map(doc => {
  //   //   console.log('====================================');
  //   //   console.log(docs);
  //   //   console.log('====================================');
  //     setDocs(prev=>[...new Set([...prev,doc])])
  //   })
  //   })
  // },[docs])

  useEffect(()=>{
    setList(prev=>docs.filter(doc=>{
      return doc?.title.toLowerCase().includes(search.toLowerCase())
    }))
  },[search])

  console.log('auth.currentUser?.email: ', auth.currentUser?.email);
  
  return (
    <SafeAreaView style={{flex: 1,alignItems:'center',paddingHorizontal:8}}>
      <Text style={styles.header}>Recent Queries</Text>
      <View style={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingBottom:8}}>
      <View style={[{width:'74%',display:'flex',flexDirection:'row',padding:2,paddingHorizontal:8,justifyContent:'flex-start',alignItems:'center', elevation: 2,backgroundColor:'white',borderColor: 'rgb(226, 233, 270)',borderWidth:1,borderRadius:8}]}>
      <MaterialIcons name='search' size={20}/>
      <TextInput style={{marginHorizontal:4,width:'100%'}} value={search} onChangeText={(text)=>setSearch(prev=>text)}  placeholder='Search...' />
      </View>
      <View style={{marginVertical:2,alignSelf:'flex-end',display:'flex',flexDirection:'row',alignItems:'center', padding:2,paddingHorizontal:8,justifyContent:'center', elevation: 2,backgroundColor:'white',borderColor: 'rgb(226, 233, 270)',borderWidth:1,borderRadius:8}}>
      <Text style={{fontSize:16}}>{newest ? <Text>Latest</Text> : <Text>Oldest</Text>}</Text>
      <TouchableOpacity onPress={()=>{setNewest(prev=>!prev)}} style={{elevation:2,padding:2,shadowColor:'black'}}>
        <MaterialIcons name={newest ? 'arrow-circle-up' : 'arrow-circle-down'} size={24} color={'#000'}/>
      </TouchableOpacity>
      </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* {newest && list.reverse().map(doc=> doc && <QuesCard key={doc?.id} navigation={navigation} doc={doc} />)}
        {!newest && list.map(doc=> doc && <QuesCard key={doc?.id} navigation={navigation} doc={doc} />)} */}
        {list.map(doc=> doc && <QuesCard key={doc?.id} navigation={navigation} doc={doc}/>)}
        {/* <View style={{marginVertical:16,borderTopWidth:0.2,padding:8,borderColor:'black',width:'100%'}}>
        <Text style={{textAlign:'center',color:'rgb(25, 134, 214)'}}>Team Forum App</Text>
        <Text style={{textAlign:'center',color:'rgb(25, 134, 214)'}}>Developed by Pranay Goel</Text>
        </View> */}
      </ScrollView>
      <GestureRecognizer onSwipeDown={()=>{
        getAllDocs()
        setModalVisible(false)
        }}>
        <Modal
          animationType='slide'
          visible={modalVisible}
          statusBarTranslucent = { true}
          transparent={true}
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