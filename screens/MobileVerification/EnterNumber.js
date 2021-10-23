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
import EnterOtpScreen from "./EnterOtpScreen";

export default function ({ navigation }) {
  let clockCall = null;
  const recaptchaVerifier = React.useRef(null);
  const verificationCodeTextInput = React.useRef(null);
  const firebaseConfig = firebase.app().options;
  // console.log('config-->', firebaseConfig);
  const attemptInvisibleVerification = false;
  // const defaultCodeCountry = "+49";
  let textInput = useRef(null);
  const defaultMaskCountry = "99999 99999";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [verifyInProgress, setVerifyInProgress] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState();
  const [confirmError, setConfirmError] = React.useState();
  const [confirmInProgress, setConfirmInProgress] = React.useState(false);
  const [internalVal, setInternalVal] = useState("");
  const defaultCountDown = 30;
  const [countDown, setCountDown] = useState(defaultCountDown);
  const [enableResend, setEnableResend] = useState(false);
  const [focusInput, setFocusInput] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  //   const [dataCountries, setDataCountries] = useState(Countries);
  const [codeCountry, setCodeCountry] = useState({
    code: "IN",
    phoneCode: "91",
  });
  const [placeholder, setPlaceholder] = useState(defaultMaskCountry);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
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

  //   const changeIcon = () => {
  //     this.setState((prevState) => ({
  //       icon: prevState.icon === "eye" ? "eye-off" : "eye",
  //       pwd: !prevState.pwd,
  //     }));
  //   };

  const currencyPicker = () => {
    <CountryPicker
      withFilter
      withFlag
      countryCode={countryCode.code}
      onSelect={(country) => {
        // console.log("country " + JSON.stringify(country.c));
        setCodeCountry({ code: country.cca2, phoneCode: country.callingCode });
      }}
      withCallingCode={true}
      withAlphaFilter={false}
      withCountryButton={false}
      containerButtonStyle={{ alignItems: "center", marginLeft: 10 }}
    />;
  };

  const onPressContinue = async () => {
    if (phoneNumber) {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      try {
        setVerifyError(undefined);
        setVerifyInProgress(true);
        setVerificationId("");
        const tmpPhone = `+${codeCountry.phoneCode}${phoneNumber}`;
        const verificationId = await phoneProvider.verifyPhoneNumber(
          tmpPhone,
          recaptchaVerifier.current
        );
        setVerifyInProgress(false);
        setVerificationId(verificationId);
        // verificationCodeTextInput.current?.focus();
      } catch (err) {
        // console.log(err.code);
        if (err.code && err.code !== "ERR_FIREBASE_RECAPTCHA_CANCEL") {
          Alert.alert(err.code, err.message);
        }
        setVerifyError(err);
        setVerifyInProgress(false);
      }
    } else {
      Alert.alert("Mobile error", "Mobile number is required!");
    }
  };

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

  const signIn = async (credential) =>
    await firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        // User signed in successfully.

        const user = result.user;

        // console.log(user, "user");

        if (!user?.email) {
          navigation.navigate("Login", { fromOTP: true });
        }
        // else {
        // navigation.navigate("Login", { fromOTP: true });
        // }
        // console.log('user-->',user);
        // navigation.navigate('SignUp');
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        console.log("error in signing in-->", error.message);
        // ...
      });

  const onConfirmCode = async (_id, _code) =>
    await firebase.auth.PhoneAuthProvider.credential(_id, _code);

  return (
    <>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
      {verificationId ? (
        <EnterOtpScreen
          phone={`+84974500326`}
          verificationId={verificationId}
          setVerificationId={setVerificationId}
          signIn={signIn}
          onConfirmCode={onConfirmCode}
        />
      ) : (
        <ScrollView
        contentContainerStyle={{ flexGrow: 1}} 
          style={{ backgroundColor: "#fff" }}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={require("../../assets/2483817.jpeg")}
            style={{
              height: Dimensions.get("window").height / 5,
            }}
          />
          <View style={styles.bottomView}>
            <View
              style={{
                marginLeft: 35,
                marginTop: 25,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                Enter Your{" "}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                mobile number{" "}
              </Text>
              <Text
                style={{
                  fontWeight: "500",
                  color: "gray",
                  fontSize: 15,
                  marginTop: 15,
                }}
              >
                {" "}
                we will send you confirmation code{" "}
              </Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: "50%", height: "30%" }}>
                <CountryPicker
                  withFilter
                  withFlag
                  countryCode={codeCountry.code}
                  onSelect={(country) => {
                    //   console.log("country " + JSON.stringify(country.callingCode));
                    //   setCodeCountry(country.callingCode);
                    setCodeCountry({
                      code: country.cca2,
                      phoneCode: country.callingCode,
                    });
                  }}
                  withCallingCode={true}
                  withAlphaFilter={false}
                  withCountryButton={false}
                  containerButtonStyle={{
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                />
              </View>
              <View
                style={{
                  borderColor: "black",
                  marginTop: 15,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    height: 50,
                    color: "gray",
                    fontSize: 35,
                    fontWeight: "bold",
                  }}
                  onPress={() => {
                    currencyPicker;
                  }}
                >
                  {" +"}
                  {codeCountry.phoneCode}{" "}
                </Text>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <TextInput
                    style={{
                      height: 50,
                      marginTop: -5,
                      width: "70%",
                      color: "gray",
                      fontSize: 35,
                      fontWeight: "bold",
                    }}
                    showSoftInputOnFocus={false}
                    value={phoneNumber}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
            <VirtualKeyboard
              color="black"
              style={{ marginTop: -5 }}
              pressMode="string"
              onPress={setPhoneNumber}
            />

            <View
              style={{
                marginTop: 0,
                width: "80%",
                marginLeft: 45,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#eb8441",
                  borderWidth: 0,
                  color: "#FFFFFF",
                  borderColor: "#7DE24E",
                  height: 44,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  marginLeft: 0,
                  marginRight: 10,
                  marginTop: 20,
                  marginBottom: 25,
                  shadowColor: "#eb8441",
                  shadowOpacity: 0.5,
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                }}
                activeOpacity={0.5}
                onPress={onPressContinue}
              >
                <Text style={{ color: "white" }}>NEXT</Text>
              </TouchableOpacity>
              {/* <View style={{ alignItems: "flex-start", marginLeft: -170 }}>
                <Text style={{ color: "gray" }}>Forgot password</Text>
              </View> */}
            </View>
            <View
              style={{
                alignItems: "center",
                marginTop: 0,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text>By creating passcode you agree with our</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#eb8441" }}> Terms and Conditions </Text>
                <Text>and </Text>
                <Text style={{ color: "#eb8441" }}>Privacy Policy</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
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
    backgroundColor: "#fff",
    bottom: 20,
    height: 300,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
});
