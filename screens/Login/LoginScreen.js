import React, {
  Component,
  createRef,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { OutlinedTextField } from "rn-material-ui-textfield";
import { Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase";
import { Alert } from "react-native";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAF8G-PkCy4u7y-ZbrO5k22gzni-X4U4lM",
  authDomain: "socially-dd898.firebaseapp.com",
  projectId: "socially-dd898",
  storageBucket: "socially-dd898.appspot.com",
  messagingSenderId: "195286176803",
  appId: "1:195286176803:web:28d7d216d2cf5c7e5bcd96",
  measurementId: "G-BSP507SDEB",
};

try {
  if (FIREBASE_CONFIG.apiKey) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
} catch (err) {
  // ignore app already initialized error on snack
}

export default function ({ route, navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(true);
  const [validate, setValidate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState({ email: "", password: "" });

  useEffect(() => {
    if (validate) {
      setError({
        email: isValidEmail(email) ? "" : "Invalid email",
        password:
          password?.length >= 6 ? "" : "Password length should be atleast 6",
      });
    }
  }, [email, password, validate]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // setLoading(true);
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      // console.log(authUser);
      // setLoading(false);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      if (authUser?.email) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Socially",
              params: { screen: "Home" },
            },
          ],
        });
      }
    });
    return unsubscribe;
  }, []);

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  const signup = () => {
    // Sign-out successful.
    // console.log("singout successfully");
    navigation.navigate("Authentication");
  };

  const passwordRef = createRef();

  const onLogin = () => {
    setValidate(true);
    if (!email || error.email || !password || error.password) {
      console.log('test')
      return;
    }
    setLoading(true);
    if (!route.params?.fromOTP) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          try {
            const refUser = db.collection("users").doc(user?.uid);
            if (!refUser.exists) {
              db.collection("users").add({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
              });
            }
          } catch {}

          // console.log('user is signed in -->', user);
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          Alert.alert("error.code", errorMessage);
          // console.log(errorMessage);
        });
    } else {
      firebase.auth().currentUser.updateProfile({
        displayName: "",
      });
      // firebase.auth().createUserWithEmailAndPassword(email, password).
      // 	then((userCredential) => {
      // 		// Signed in
      // 		var user = userCredential.user;
      // 		const refUser = db.collection('users')
      // 			.doc(user?.uid)
      // 		if (!refUser.exists) {
      // 			db.collection('users').add({
      // 				"displayName": username,
      // 				"email": user.email,
      // 				"photoURL": user.photoURL,
      // 				"uid": user.uid,
      // 			})
      // 		}
      // 	})
      // 	.catch(function (error) {
      // 		var errorCode = error.code;
      // 		var errorMessage = error.message;
      // 	});

      var credential = firebase.auth.EmailAuthProvider.credential(
        email,
        password
      );
      // console.log(credential, "login credential");
      firebase
        .auth()
        .currentUser.linkWithCredential(credential)
        .then(function async(usercred) {
          var user = usercred.user;

          // console.log("Account linking success", user);
        })
        .catch(function (error) {
          // console.log("Account linking error", error);
        });

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Socially",
            params: { screen: "Home" },
          },
        ],
      });

      // console.log("login");
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const onForgotPassword =()=>{
    navigation.navigate("ForgotPassword");
  }

  // console.log(error, "error");

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#eb8441"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} style={{backgroundColor: "#FFF"}} showsVerticalScrollIndicator={false}>
      <ImageBackground source={require("../../assets/2483817.jpeg")} style={{height: Dimensions.get("window").height / 2.5}}>
        <View style={styles.brandView}>
          <Text style={{ fontSize: 40, fontWeight: "bold", color: "white" }}>Create better</Text>
          <Text style={{ fontSize: 40, fontWeight: "bold", color: "white" }}>together.</Text>
          <Text style={{ color: "white", marginTop: 10 }}>Just Our Community</Text>
        </View>
      </ImageBackground>
      <View style={styles.bottomView}>
        <View style={{marginLeft: 35, marginTop: 25}}>
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>Login</Text>
        </View>
        <View style={{width: "90%", marginLeft: 20, marginTop: 20}}>
          <OutlinedTextField autoCapitalize="none" tintColor={"#000"} onChangeText={setEmail} onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()} error={error.email} label="Email" value={email}/>
        </View>
        <View style={{width: "90%", marginLeft: 20, marginTop: 20}}>
          <OutlinedTextField ref={passwordRef} tintColor={"#000"} onChangeText={setPassword} secureTextEntry={!showPassword} onSubmitEditing={Keyboard.dismiss} error={error.password} label="Password" value={password}/>
        </View>
        <View style={{marginTop: -45, height: 20, width: 20, marginLeft: "85%"}}>
          <TouchableOpacity style={{height: 20, width: 20}}onPress={toggleShowPassword}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={"gray"}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginTop: -85, width: "80%", marginLeft: 45, alignItems: "center"}}>
        <TouchableOpacity style={{ backgroundColor: "#eb8441", borderWidth: 0, color: "#FFFFFF", borderColor: "#7DE24E", height: "22%", width: "100%", justifyContent: "center", alignItems: "center", borderRadius: 10, marginLeft: 0, marginRight: 10, marginTop: 20, marginBottom: 25, shadowColor: "#eb8441", shadowOpacity: 0.5, shadowOffset: { width: 0, height: 6}}} activeOpacity={0.5} onPress={onLogin}>
          <Text style={{ color: "white" }}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onForgotPassword}>
        <View style={{alignItems: "flex-start", marginLeft: -170}}>
          <Text style={{ color: "gray" }}>Forgot password</Text>
        </View>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: "center", marginTop: Dimensions.get('window').height - 850, marginBottom: Dimensions.get('window').height -700, flexDirection: "row", justifyContent: "center"}}>
        <Text>Don't Have An Account ? </Text>
        <Text style={{ color: "#eb8441", fontWeight: "bold", fontSize: 15 }} onPress={signup}>{" "}Sign up</Text>
      </View>
    </ScrollView>
  );
}

function isValidEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

const styles = StyleSheet.create({
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
    backgroundColor: "white",
    bottom: 20,
    height: 300,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
});
