import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import OTPTextView from "react-native-otp-textinput";

const DEFAULT_COUNT_DOWN = 30;

export default function ({
  phone,
  verificationId,
  setVerificationId,
  signIn,
  onConfirmCode,
}) {
  let clockCall = null;
  const [confirmError, setConfirmError] = React.useState();
  const [confirmInProgress, setConfirmInProgress] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState();
  const [countDown, setCountDown] = React.useState(DEFAULT_COUNT_DOWN);
  const [enableResend, setEnableResend] = useState(false);

  const confirmCode = async () => {
    // console.log(verificationCode, verificationId, "xxx");
    try {
      setConfirmError(undefined);
      setConfirmInProgress(true);
      const credential = await onConfirmCode(verificationId, verificationCode);
      //   const credential =
      // const authResult = await firebase.auth().signInWithCredential(credential).then(() => console.log('user-->',user));
      setConfirmInProgress(false);
      setVerificationId("");
      setVerificationCode("");
      signIn(credential);
      // Alert.alert('Phone authentication successful!');
    } catch (err) {
      setConfirmError(err);
      setConfirmInProgress(false);
    }
  };

  function hidePhoneNum() {
    // console.log(phone.length, "phone length");
    let tmpPhone = phone.substr(0, 8);
    for (let i = 0; i < phone.length - 8; i++) {
      tmpPhone += "*";
    }
    return tmpPhone;
  }

  useEffect(() => {
    if (verificationId) {
      clockCall = setInterval(() => {
        decrementClock();
      }, 1000);

      return () => {
        clearInterval(clockCall);
      };
    }
  });

  const decrementClock = () => {
    if (countDown === 0) {
      setEnableResend(true);
      setCountDown(0);
      clearInterval(clockCall);
    } else {
      setCountDown(countDown - 1);
    }
  };

  const onResendOTP = () => {
    if (enableResend) {
      setCountDown(DEFAULT_COUNT_DOWN);
      setEnableResend(false);
      clearInterval(clockCall);
      clockCall = setInterval(() => {
        decrementClock();
      }, 1000);
    }
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1}} 
      style={{backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={require("../../assets/2483817.jpeg")}
        style={{
          height: Dimensions.get("window").height / 5,
        }}
      ></ImageBackground>
      <View style={styles.bottomView}>
        <View
          style={{
            marginLeft: 35,
            marginTop: 25,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 25 }}>
            Enter code sent{" "}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 25 }}>
            to your mobile number{" "}
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
            We have send you confirmation otp on this number {hidePhoneNum()}
          </Text>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              borderColor: "black",
              marginTop: 15,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 0,
              }}
            >
              <OTPTextView
                containerStyle={styles.textInputContainer}
                handleTextChange={setVerificationCode}
                inputCount={6}
                keyboardType="numeric"
              />
            </View>

            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={{
                  height: 50,
                  marginTop: -5,
                  width: "70%",
                  color: "gray",
                  fontSize: 35,
                  fontWeight: "bold",
                }}
                88={false}
                value={verificationCode}
              />
            </TouchableWithoutFeedback> */}
          </View>
        </View>

        {enableResend ? (
          <View style={styles.resend}>
            <Text>Didn't receive your code? </Text>
            <TouchableOpacity style={{ marginLeft: 3 }} onPress={onResendOTP}>
              <Text style={{ color: "#eb8441" }}>Resend</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resend}>
            <Text>Resend code in {countDown}</Text>
          </View>
        )}

        {confirmError && (
          <Text style={styles.error}>{`Error: ${confirmError.message}`}</Text>
        )}
        {confirmInProgress ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <View
            style={{
              marginTop: 0,
              width: "80%",
              marginLeft: 45,
              marginTop: 0,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#eb8441",
                borderWidth: 0,
                color: "#FFFFFF",
                borderColor: "#7DE24E",
                height: "30%",
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
              onPress={confirmCode}
            >
              <Text style={{ color: "white" }}>Enter</Text>
            </TouchableOpacity>
          </View>
        )}
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
  );
}

const styles = StyleSheet.create({
  resend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
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
