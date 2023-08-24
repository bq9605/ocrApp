import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Asset,ImagePickerResponse } from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [state, setState] = useState<{
  loading: boolean;
  image: string | "";
  toast: { 
   message: string;
   isVisible: boolean;
  };
  textRecognition: [] | null; 
 }>({
  loading: false,
  image: "",
  textRecognition: null,
  toast: {
  message: "",
  isVisible: false,
  },
 });
  const onPress = (type: "capture" | "library") =>{
  setState({ ...state, loading: true });
  type === "capture"
   ? launchCamera({ mediaType:"photo" }, onImageSelect)
   : launchImageLibrary({ mediaType: "photo" }, onImageSelect);
 }
 async function onImageSelect(media: ImagePickerResponse) {
   setState({ ...state, loading: false });
   if(media.assets){

     const file = media.assets[0].uri; 
     const textRecognition = await RNTextDetector.detectFromUri(file);
    const INFLIGHT_IT = "Inflight IT";
    //if match toast will appear 
    const matchText = textRecognition.findIndex((item: { text: string      
    }) => item.text.match(INFLIGHT_IT));
    setState({
      ...state,
      textRecognition,
      image: file??"",
      toast: {
      message: matchText > -1 ? "Ohhh i love this company!!" : "",
      isVisible: matchText > -1, 
      },
      loading: false,
    });
   }
   
 }
  return (
    <SafeAreaView style={styles.container}>
   <View>
    <Text >RN OCR SAMPLE</Text>
   <View >
    <TouchableOpacity 
    onPress={() => onPress("capture")}>
     <Text>Take Photo</Text>
    </TouchableOpacity>
   <View > 
    <TouchableOpacity
     
     onPress={() => onPress("library")}
    >
     <Text>Pick a Photo</Text>
    </TouchableOpacity>
   </View>
   <View >
    
     <View style={{ alignItems: "center" }}>
      <Image source=
       {{ uri: state.image }} />
     </View> 
   {!!state.textRecognition && 
    state.textRecognition.map(
     (item: { text: string }, i: number) => (
      <Text key={i} >
       {item.text}
      </Text>
     ))}
    
    </View>
   </View>
  
   </View>
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
