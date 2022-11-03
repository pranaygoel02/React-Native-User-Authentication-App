import { View, Text } from 'react-native'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {auth} from '../firebase'

const Comment = ({comment}) => {
    const time = dayjs(comment?.date).fromNow(true)
  return (
    <View style={{backgroundColor: 'rgba(226, 243, 251,0.8)',marginVertical:4,padding:8,borderRadius:8}}>
      <Text style={{padding:8,borderRadius:4,borderLeftWidth:4,borderColor:'green',backgroundColor:'rgba(255,255,255,0.8)'}}>{comment?.comment}</Text>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginVertical:4,width:'100%',justifyContent:'space-between'}}>
        <Text style={{ fontSize:12}}>by @{comment?.author}</Text>
        {comment?.date &&  <Text style={{ fontSize:12}}>{time} ago</Text>}
      </View>
    </View>
  )
}

export default Comment