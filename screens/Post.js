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
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove,onSnapshot, collection  } from "firebase/firestore";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient'


const Post = ({}) => {
  const {params: {post}} = useRoute()
    // console.log("post doc: ",post);
    const time = dayjs(post.date).fromNow(true)
    const [comment,setComment] = useState('')
    const [comments,setComments] = useState([])
    const [list,setList] = useState([])
    const [newest, setNewest] = useState(true)
    const [open, setOpen] = useState(post?.open)
    const [votes, setVotes] = useState(post?.votes)
    const [voters,setVoters] = useState(post?.voters)
    const [vote,setVote] = useState(post?.voters.includes(auth.currentUser?.email))
    const [currPostStatus, setcurrPostStatus] = useState(post)
    const [questions, setQuestions] = useState([])

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
      setComment(prev=>'')
  }

useEffect(()=>{
  setList(prev=>comments)
},[comments])
  
comments?.sort(function(a, b) {
  var c = new Date(a.date);
  var d = new Date(b.date);
  return c-d;
});
useEffect(()=>{
    onSnapshot(doc(db, "comments", post?.id), (doc) => {
    // console.log("Current data: ", doc.data());
    if(doc.data()) setComments(doc.data()?.comments)
  });
},[])


useEffect(()=>{
  onSnapshot(doc(db, "questions", post?.author_mail), (doc) => {
      // console.log("Current Post data: ", doc.data());
      if(doc.data()) {
        setQuestions(prev=>doc.data()?.questions.filter(doc => {return doc.id !== post.id}))
        setcurrPostStatus(doc.data()?.questions.filter(doc => {return doc.id === post.id})[0])
      } 
  });
},[])


useEffect(()=>{
  setOpen(prev=>currPostStatus.open)
  setVotes(prev=>currPostStatus.votes)
  setVoters(prev=>currPostStatus.voters)
  setVote(prev=>currPostStatus?.voters?.includes(auth.currentUser?.email))
},[currPostStatus])

const handlePostOpen = async () => {
  console.log('handling post open state');
  try{
       
  await setDoc(doc(db, "questions", post?.author_mail), 
      {
        questions: [...questions,
          {
            ...currPostStatus,
            open: !(currPostStatus.open)
          }
        ]
      });
      
  } catch(err){
    console.log('====================================');
    console.log(err);
    console.log('====================================');
  }
}

const handlePostVote = async () => {
  console.log('handling post open state');
  try
  {    
    await setDoc(doc(db, "questions", post?.author_mail), 
      {
        questions: [...questions,
          {
            ...currPostStatus,
            votes: (vote) ? votes - 1 : votes + 1,
            voters: (vote) ? voters.filter(doc=>{return doc!==auth.currentUser.email}) : [...voters,auth.currentUser.email]
          }
        ]
      });    
  }
  catch(err){
    console.log('====================================');
    console.log(err);
    console.log('====================================');
  }
}

console.log('currPostStatus: ',currPostStatus);

  return (
    <SafeAreaView style={[open && {paddingBottom:150},{paddingTop:16,paddingHorizontal:8,flex:1}]}>
      <ScrollView>
      <Text style={[styles.header,{fontSize:32}]}>{post?.title}</Text>
      <TouchableOpacity onPress={()=>{if(auth.currentUser?.email === post.author_mail) handlePostOpen()}} style={[open ? styles1.open : styles1.closed,{padding: 8,marginVertical:4,paddingHorizontal:12,display:'flex',alignItems:'center',borderRadius:32,color:'#fff',alignSelf:'flex-start',flexDirection:'row'}]}>
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
      {votes >=0 && 
      <View style={{display:'flex',flexDirection:'row', alignItems:'center',marginVertical:8}}>
      <TouchableOpacity onPress={handlePostVote}>
    <MaterialCommunityIcons name={vote ? 'thumb-up' :'thumb-up-outline'} size={20} color={'green'}/>
      </TouchableOpacity>
    <Text style={{marginHorizontal:4}}>{votes}</Text>
    </View>}
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginVertical:4,width:'100%',justifyContent:'space-between'}}>
      <Text style={[styles.header,{fontSize:24,marginVertical:8}]}>Comments</Text>
      <TouchableOpacity onPress={()=>{setNewest(prev=>!prev)}} style={{elevation:2,padding:2,shadowColor:'black',marginLeft:8}}>
        <MaterialIcons name={newest ? 'arrow-circle-up' : 'arrow-circle-down'} size={24} color={'#000'}/>
      </TouchableOpacity>
      </View>
      {newest && list.reverse().map(com => <Comment comment={com}/>)}
        {!newest && list.map(com => <Comment comment={com}/>)}
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