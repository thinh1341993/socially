import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import * as Linking from 'expo-linking';

// import {
//   OutlinedTextField,
//   TextField,
//   FilledTextField,
// } from "react-native-material-textfield";
// import { OutlinedTextField } from "rn-material-ui-textfield";
// import { Ionicons } from "@expo/vector-icons";
import VirtualKeyboard from "react-native-virtual-keyboard";
import CountryPicker from "react-native-country-picker-modal";
import * as firebase from "firebase";
import { auth } from "../../firebase";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import { Button } from "react-native-elements/dist/buttons/Button";
import { MaterialIcons } from "@expo/vector-icons";

export default function ({ navigation }) {
  let textInput = useRef(null);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#eb8441"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      </SafeAreaView>
    );
  }


    const gotoLogin =()=>{
        navigation.navigate("Login");        
    }

      const sendInstruction =()=>{

        Linking.openURL("https://mail.google.com");

        firebase
        .auth()
        .sendPasswordResetEmail('pravin.khalase7@gmail.com')
        .then(function async(usercred) {
         console.log('usercred',usercred);
          // console.log("Account linking success", user);
        })
        .catch(function (error) {
          console.log('err',error);
          // console.log("Account linking error", error);
        });

      }


  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.innerContainer}>

       <View style={styles.iconContainer}>
        <MaterialIcons name="email" size={100} color="#7e3af2" />
      </View>


       <Text style={styles.text}>Check your mail</Text>
       <Text style={styles.subText}>We have sent a password recover instruction to your email</Text>

       <View>
       <Button
								style={styles.forgotPassworButton}
								title="Open email app"
								buttonStyle={{  backgroundColor: '#7e3af2' ,borderRadius: 10,padding:15 }}
								onPress={sendInstruction}
							/>


       </View>
       <View>
           
       <Text style={styles.skipLink} onPress={gotoLogin }>
                Skip, I'll confirm later
            </Text>
       
       </View>
        {/* <TextInput editable={false} style={{marginLeft: 20, fontSize: 18, marginBottom: 10, }}/> */}

        
       </View>
      
  
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({

container: {
    backgroundColor: '#fff',
    flex:1
    },
    innerContainer: {
        textAlign:"center",
        alignItems:"center",
        justifyContent:"center",
        paddingLeft:20,
        paddingRight:20,
        marginTop:"30%"
        

    },
    iconContainer:{
        padding:30,
        backgroundColor:'rgba(100, 100, 100, 0.1)',
        borderRadius:20
    },
    skipLink:{
        margin:20,
        marginTop:20
    },
    text: {
    color: '#333',
    fontSize: 30,
    lineHeight:50,
    marginBottom:20
    },
    subText: {
        color: '#333',
        fontSize:18,
        marginBottom:20,
        paddingLeft:5,
        paddingRight:5
        },
    forgotPassworButton:{
      marginTop:10,
      marginHorizontal: "5%", 
      marginTop:10

    },
    inputStyle:
    {
      height: 50,
      width: "100%",
      borderColor: "#c4c4c4",
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 16,
      marginTop:10,
      padding:10
    },
  loading: {
    flex: 1,
    backgroundColor: "white",
  },
  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 15,
  },
  bottomView: {
    flex: 1,
    backgroundColor: "#fff",
    bottom: 20,
    height: 300,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
});
