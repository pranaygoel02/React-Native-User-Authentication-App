import { View, Text } from 'react-native'
import React from 'react'

const Chip = ({data}) => {
  return (
    data.trim() !== '' && 
      <Text style={{padding: 12, paddingVertical:8,backgroundColor: 'rgb(226, 243, 251)',borderRadius:10,marginHorizontal:3}}>{data.trim().toLowerCase()}</Text>
  )
}

export default Chip