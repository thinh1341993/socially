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
import { OutlinedTextField } from "rn-material-ui-textfield";

export default function ({ navigation }) {
  let textInput = useRef(null);
  const [email, setEmail] = useState();
  const [validate, setValidate] = useState(false);
  const [error, setError] = useState({ email: "", password: "" });


  useEffect(() => {
    if (validate) {
      setError({
        email: isValidEmail(email) ? "" : "Invalid email",
      });
    }
  }, [email, validate]);

  function isValidEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

      const sendInstruction =()=>{
        setValidate(true);
        if (!email || error.email) {
          return;
        }
        //Linking.openURL("https://mail.google.com");
        // alert(email);
        firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function async(usercred) {
         console.log('usercred',usercred);
         navigation.navigate("EmailInbox");
         
          // console.log("Account linking success", user);
        })
        .catch(function (error) {
          console.log('err',error);
          alert("User not exists. Please enter valid email");
          // console.log("Account linking error", error);
        });

      }


  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.innerContainer}>
       <Text style={styles.text}>Reset your password</Text>
        <Text style={styles.subText}>Enter the email associated with your account and we will send an email with instruction to reset your password</Text>
        {/* <TextInput editable={false} style={{marginLeft: 20, fontSize: 18, marginBottom: 10, }}/> */}

        
       </View>
       <View style={styles.inputFieldStyle}>
         {/* <Text> Email Address</Text> */}

         
       {/* <TextInput
            placeholder="Enter Pin to continue"
            textAlignVertical="center"
            multiline={false}
            placeholder="Email"
            style={styles.inputStyle}
            value={email}
            onChangeText={setEmail}
          /> */}
           <OutlinedTextField autoCapitalize="none" tintColor={"#000"} onChangeText={setEmail} error={error.email} label="Email" value={email}/>
       </View>
       <View>
       <Button
								style={styles.forgotPassworButton}
								title="Send Instruction"
								buttonStyle={{  backgroundColor: '#7e3af2', padding:15, borderRadius:10 }}
								onPress={sendInstruction}
							/>
       </View>
       
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({

container: {
    flex: 1,
    backgroundColor: '#fff',
    },
    innerContainer: {
        marginTop: 50,
        marginLeft: 25

    },
    text: {
    color: '#333',
    fontSize: 30,
    },
    subText: {
        color: '#333',
        marginTop:10,
        fontSize:16
        },
    buttonContainer: {
    margin: 25
    },
    inputFieldStyle:
    {
      marginHorizontal: "5%",     
      marginTop:20,
      marginBottom:20,
      fontSize:16
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
      fontSize:16,
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
