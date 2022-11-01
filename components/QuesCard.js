import { View, Text, StyleSheet, TouchableHighlight,TouchableOpacity } from 'react-native'
import React,{useEffect, useState} from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { auth } from '../firebase'
import Chip from './Chip'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
dayjs.extend(relativeTime)

const QuesCard = ({navigation,doc,idx}) => {

  const post = doc;
  console.log( "open =>", doc.open);
  const time = dayjs(doc.date).fromNow(true)

  return (
    <View style={styles.card}>
      <Text  numberOfLines={2} style={styles.title}><Octicons name={`issue-${doc?.open ? 'opened':'closed'}`} size={16}/> {doc?.title}</Text>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',padding:8,paddingBottom:16,width:'100%',justifyContent:'space-between'}}>
        <Text style={[{ fontSize:12}]}>by {auth.currentUser.email === doc?.author ? 'You' : doc?.author}</Text>
        <Text style={{ fontSize:12}}>{time} ago</Text>
      </View>
      <Text numberOfLines={4} style={[styles.query,doc.open ? styles.open : styles.closed]}>{doc?.query}</Text>
      <View style={{width:'100%',display:'flex',flexDirection:'row',flexWrap:'wrap',marginTop: 10}}>
        {doc.tags?.map(tag => <Chip data={tag}/>)}
      </View>
      <View style={{display:'flex',flexDirection:'row', alignItems:'center',padding:8,paddingBottom:16,width:'100%',justifyContent:'space-between'}}>
        {doc?.votes >= 0 ?
        <View style={{display:'flex',flexDirection:'row', alignItems:'center'}}>
          <TouchableOpacity>
        <MaterialCommunityIcons name={doc?.voters.includes(auth.currentUser?.email) ? 'thumb-up' :'thumb-up-outline'} size={20} color={'green'}/>
          </TouchableOpacity>
        <Text style={{marginHorizontal:4}}>{doc.votes}</Text>
        </View> : null
        }
      <TouchableHighlight onPress={()=>{navigation.navigate('Post',{post})}} style={{padding:12,paddingVertical:8,borderRadius:20}}>
        {/* <Text style={{color: 'white'}}>Read More</Text> */}
        <MaterialIcons name='arrow-forward' size={24} color='rgb(25, 134, 214)'/>
      </TouchableHighlight>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flex: 1,
    width: '100%',
    marginVertical: 8,
    borderRadius: 16,
    overflow:'hidden',
    borderColor: 'rgb(226, 233, 270)',
    borderBottomWidth: 1,
    elevation: 2,
    shadowRadius: 10,
    shadowOffset: 8,
    shadowColor: 'rgb(25, 134, 214)',
shadowOpacity: 5,
backgroundColor:'white',
  },
  title :{
    color: 'rgb(25, 134, 214)',
    backgroundColor: 'rgb(226, 243, 251)',
    padding: 12,
    paddingTop:16,
    fontSize: 16,
    fontWeight: '500'
  },
  query: {
    padding: 12,
    paddingLeft: 14,
    fontSize:16,
    lineHeight:21,
    borderLeftWidth: 6,
    borderRadius: 6,
    marginLeft:4,
    borderColor:'rgb(150,186,59)'
  },
  open: {
    borderColor:'rgb(35, 134, 54)'
  },
  closed: {
    borderColor:'rgb(137, 87, 229)'
  },
})

export default QuesCard