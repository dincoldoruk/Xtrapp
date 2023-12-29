import { Image } from '@rneui/base'
import React from 'react'
import { View } from 'react-native'

const ProductBox = () =>{
  return (
    <TouchableOpacity style={{margin:2,}} onPress={()=>{navigationRef.navigate('FareScreen')}} >
        <Image source={'../assets/'}></Image>
    </TouchableOpacity>
  )
}
export default ProductBox
