import { View, Text, TextInput, TouchableOpacity,ScrollView, StyleSheet } from 'react-native'
import React, { useState,useEffect } from 'react'
import QuesCard from '../components/QuesCard'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../styles/AppStyles'
import Chip from '../components/Chip'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Comment from '../components/Comment'
import { db,auth } from '../firebase'
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient'


const Post = ({}) => {
  const {params: {post}} = useRoute()
    console.log("post doc: ",post);
    const time = dayjs(post.date).fromNow(true)
    const [comment,setComment] = useState('')
    const [comments,setComments] = useState([])
    const [newest, setNewest] = useState(true)
    const [open, setOpen] = useState(post?.open)
    const [votes, setVotes] = useState(post?.votes)
    const [voters,setVoters] = useState(post?.voters)
    const [vote,setVote] = useState(post?.voters.includes(auth.currentUser?.email))

    const newComment = async () => {
      console.log('adding comment');
      await setDoc(doc(db, "comments", post?.id), 
      {
        comments: [...comments,
          {
            date: new Date().toISOString(),
            author: auth.currentUser.displayName ? auth.currentUser.displayName : auth.currentUser.email,
            comment: comment
          }
        ]
      });
      setComments(prev=>[...prev,
        {
        date: new Date().toISOString(),
        author: auth.currentUser.displayName ? auth.currentUser.displayName : auth.currentUser.email,
        comment: comment
      }])
      setComment(prev=>'')
  }


  

  const getComments = async() => {
    const docRef = doc(db, "comments", post?.id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().comments);
      setComments(docSnap.data().comments)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
}
useEffect(()=>{
  setComment(prev=>'')
  // setComments([])
  getComments()
  },[])
  comments.sort(function(a, b) {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return c-d;
});

const handlePostStatus = async () => {
  if(auth.currentUser?.email === post.author){
    setOpen(prev=>!prev)
    const docRef = doc(db, "questions", auth.currentUser?.email);
    await updateDoc(docRef, {
      questions: arrayRemove(post)
    });
  
    // Atomically add a new region to the "regions" array field.
    await updateDoc(docRef, {
        questions: arrayUnion({
          ...post,open:!(post.open)
        })
    }); 
  }
}




  return (
    <SafeAreaView style={[open && {paddingBottom:150},{paddingTop:16,paddingHorizontal:8,flex:1}]}>
      <ScrollView>
      <Text style={[styles.header,{fontSize:32}]}>{post?.title}</Text>
      <TouchableOpacity onPress={handlePostStatus} style={[open ? styles1.open : styles1.closed,{padding: 8,marginVertical:4,paddingHorizontal:12,display:'flex',alignItems:'center',borderRadius:32,color:'#fff',alignSelf:'flex-start',flexDirection:'row'}]}>
    <Octicons name={`issue-${open ? 'opened':'closed'}`} size={20} color='#fff'/>
      <Text style={{marginLeft:4,fontSize:16,color:'#fff',textTransform:'capitalize'}}>{open ? 'open' : 'closed'}</Text>
      </TouchableOpacity>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',padding:8,paddingBottom:16,width:'100%',justifyContent:'space-between'}}>
        <Text style={{ fontSize:12}}>by {post.author}</Text>
        <Text style={{ fontSize:12}}>{time} ago</Text>
      </View>
      {post?.tags.length > 1 && <View style={{width:'100%',display:'flex',flexDirection:'row',flexWrap:'wrap',marginVertical: 10}}>
        {post.tags?.map(tag => <Chip data={tag}/>)}
      </View>}
      <Text style={{marginVertical:8,borderLeftWidth: 5,paddingHorizontal:12, borderColor:'green'}}>{post?.query}</Text>
      {post.votes >=0 && 
      <View style={{display:'flex',flexDirection:'row', alignItems:'center',marginVertical:8}}>
      <TouchableOpacity onPress={()=>{}}>
    <MaterialCommunityIcons name={vote ? 'thumb-up' :'thumb-up-outline'} size={20} color={'green'}/>
      </TouchableOpacity>
    <Text style={{marginHorizontal:4}}>{votes}</Text>
    </View>}
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginVertical:4,width:'100%',justifyContent:'space-between'}}>
      <Text style={[styles.header,{fontSize:24,marginVertical:8}]}>Comments</Text>
      <TouchableOpacity onPress={()=>{setNewest(prev=>!prev)}} style={{elevation:2,padding:2,shadowColor:'black'}}>
        <MaterialIcons name={newest ? 'arrow-circle-up' : 'arrow-circle-down'} size={24} color={'#000'}/>
      </TouchableOpacity>
      </View>
      {newest && comments.reverse().map(com => <Comment comment={com}/>)}
        {!newest && comments.map(com => <Comment comment={com}/>)}
      </ScrollView>
      {open && <LinearGradient colors={['transparent', 'rgba(255,255,255,1)']} style={{position:'absolute',bottom:0,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'white',width:'104%',padding:8}}>
      <TextInput onChangeText={(text)=>setComment(text)} value={comment} style={[styles.input,styles.input_post]} placeholder='Add comment...'/>
      <TouchableOpacity onPress={()=>{if(comment!=='') newComment()}} style={styles.button}><Text style={styles.buttonText}>Post Comment</Text></TouchableOpacity>
      </LinearGradient>}
      
    </SafeAreaView>
  )
}


const styles1 = StyleSheet.create({
  open: {
    backgroundColor:'rgb(35, 134, 54)'
  },
  closed: {
    backgroundColor:'rgb(137, 87, 229)'
  },
})


export default Post