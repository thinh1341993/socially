import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { Button, Avatar, Text, ListItem } from "react-native-elements";
import { KeyboardAvoidingView } from "react-native";
import { StatusBar, ImageBackground } from "react-native";
import * as firebase from "firebase";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser, selectUserInfo } from "../../redux/features/userSlice";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const width = Dimensions.get("window").width - 36;

const HeaderComp = ({ user }) => {
  const navigation = useNavigation();
  const [send, setSend] = useState(false);
  const [requestSent, setRequestSent] = useState(send);
  const firebaseUser = firebase.auth().currentUser;
  const [friend, setFriend] = useState(false);
  const u = useSelector(selectUser);
  // const userInfo = useSelector(selectUserInfo);
  const [info, setInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followBack, setFollowBack] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    db.collection("users")
      .doc(user?.uid || authUser?.uid)
      .collection("friends")
      .onSnapshot((snapshot) => {
        setFollowing(
          snapshot?.docs?.map((doc) => ({
            id: doc.id,
            displayName: doc?.data()?.displayName,
            photoURL: doc?.data().photoURL || null,
            timestamp: doc.data().timestamp,
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(user?.uid)
      .collection("followers")
      .onSnapshot((snapshot) =>
        setFollowers(
          snapshot?.docs?.map((doc) => ({
            id: doc.id,
            displayName: doc?.data()?.displayName,
            photoURL: doc?.data().photoURL || null,
            timestamp: doc.data().timestamp,
          }))
        )
      );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("profileViewers")
        .doc(firebaseUser?.uid || user?.uid)
        .set({
          displayName: firebaseUser?.displayName,
          photoURL: firebaseUser?.photoURL,
          uid: firebaseUser?.uid,
        });
    }
  }, [user]);

  useEffect(() => {
    db.collection("users")
      .doc(user?.uid)
      .collection("info")
      .onSnapshot((snapshot) =>
        setInfo(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);

  useEffect(() => {
    // console.log('user id-->',typeof user?.id === 'undefined');
    if (typeof user?.id === "undefined" || !user?.id) {
      db.collection("users")
        .doc(firebaseUser?.uid)
        .collection("friends")
        .doc(user?.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // setFollowBack(true);
            db.collection("users")
              .doc(firebaseUser?.uid)
              .collection("friends")
              .doc(user?.uid)
              .get()
              .then((doc) => {
                if (!doc.exists) {
                  setFollowBack(true);
                } else {
                  setFriend(true);
                }
              });
          }
        });
    } else {
      db.collection("users")
        .doc(user?.uid)
        .collection("page")
        .doc(user?.id)
        .collection("friends")
        .doc(firebaseUser?.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            db.collection("users")
              .doc(firebaseUser?.uid)
              .collection("friends")
              .doc(user?.id)
              .get()
              .then((doc) => {
                if (!doc.exists) {
                  setFollowBack(true);
                } else {
                  setFriend(true);
                }
              });
          }
        });
    }
  }, []);

  useEffect(() => {
    db.collection("posts")
      .doc(user?.uid)
      .collection("userPosts")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .doc(user?.uid)
      .collection("likedPosts")
      .onSnapshot((snapshot) => {
        setLikes(snapshot.size);
      });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(user?.uid)
      .collection("requests")
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data().uid === firebaseUser?.uid) {
            setRequestSent(true);
          }
        });
      });
    return unsubscribe;
  }, []);

  const sendCompliment = () => {
    navigation.navigate("Compliment", { sendUser: user });
  };

  const handleFollowBack = () => {
    if (typeof user?.id === "undefined" || !user?.id) {
      db.collection("users")
        .doc(firebaseUser?.uid)
        .collection("friends")
        .doc(user?.uid)
        .set({
          uid: user?.uid,
          displayName: user?.displayName || user?.name,
          email: user?.email || "",
          photoURL: user?.photoURL || "",
          id: null,
        });

      db.collection("users")
        .doc(user?.uid)
        .collection("followers")
        .doc(firebaseUser?.uid)
        .set({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          id: null,
        });

      setFriend(true);
    } else {
      db.collection("users")
        .doc(firebaseUser?.uid)
        .collection("friends")
        .doc(user?.id)
        .set({
          uid: user?.uid || null,
          id: user?.id || null,
          name: user?.name || "",
          photoURL: user?.photoURL || "",
        });

      db.collection("users")
        .doc(user?.uid)
        .collection("page")
        .doc(user?.id)
        .collection("followers")
        .doc(firebaseUser?.uid)
        .set({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          // id: null
        });

      setFriend(true);
    }
  };
  const navigateUser = (list, text) => {
    list = list.slice().sort(function (a, b) {
      var nameA = a.displayName.toLowerCase(),
        nameB = b.displayName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    // setVisible(true);
    navigation.navigate("UserFollowers", { list: list, text: text });
  };

  const handleFollow = () => {
    // if(!friend){
    let reqSent = false;
    setSend(true);
    if (followBack) {
      handleFollowBack();
    } else {
      if (
        (user?.privacy === "private" && typeof user?.privacy !== "undefined") ||
        (info?.[0]?.privacy === "private" && info !== null)
      ) {
        // console.log('user-->',info?.[0]?.privacy);
        // console.log('user pirvacu-->',user?.privacy);
        console.log("for private account");
        db.collection("users")
          .doc(user?.uid)
          .collection("requests")
          .doc(firebaseUser?.uid)
          .set({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            id: user?.id || null,
          })
          .then(() => console.log("request sent sucessfully"));
      } else if (
        !friend &&
        typeof user?.id === "undefined" &&
        info?.[0]?.privacy === "public" &&
        info !== null
      ) {
        console.log("public account here");
        db.collection("users")
          .doc(firebaseUser?.uid)
          .collection("friends")
          .doc(user?.uid)
          .set({
            uid: user?.uid,
            displayName: user?.displayName || user?.name,
            email: user?.email || "",
            photoURL: user?.photoURL || "",
            id: null,
          });
        db.collection("users")
          .doc(user?.uid)
          .collection("followers")
          .doc(firebaseUser?.uid)
          .set({
            uid: firebaseUser?.uid,
            displayName: firebaseUser?.displayName || firebaseUser?.name,
            email: firebaseUser?.email || "",
            photoURL: firebaseUser?.photoURL || "",
          });
      } else if (
        typeof user?.id !== "undefined" &&
        user?.privacy === "public" &&
        !friend
      ) {
        db.collection("users")
          .doc(firebaseUser?.uid)
          .collection("friends")
          .doc(user?.id)
          .set({
            uid: user?.uid || null,
            id: user?.id || null,
            name: user?.name || "",
            photoURL: user?.photoURL || "",
          });
        db.collection("users")
          .doc(user?.uid)
          .collection("page")
          .doc(user?.id)
          .collection("followers")
          .doc(firebaseUser?.uid)
          .add({
            uid: firebaseUser?.uid,
            displayName: firebaseUser?.displayName || firebaseUser?.name,
            email: firebaseUser?.email || "",
            photoURL: firebaseUser?.photoURL || "",
            // id: user?.id
          });
      }

      db.collection("chats")
        .add({
          members: [user.uid, friend.uid],
          blockedBy: "",
          preview: "Hi " + friend.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          color: false,
        })
        .then((response) => {
          db.collection("chats")
            .doc(response.id)
            .collection("data")
            .add({
              message: "Hi " + friend.displayName,
              sender: user.uid,
              receiver: friend.uid,
              image: "",
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        });
    }
    // }
  };

  const handlePress = (posts, index) => {
    navigation.navigate("PostList", {
      userId: user?.uid,
      posts: posts,
      index: index,
    });
  };
  console.log("info", info);
  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="auto" />
      {/* <ScrollView> */}

      <View style={[styles.loginHeader]}>
        <ImageBackground
          resizeMode="stretch"
          blurRadius={40}
          source={{
            uri:
              user?.photoURL ||
              "https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png",
          }}
          style={{
            paddingTop: 70,
            backgroundColor: "rgb(37,63,110)",
            width: Dimensions.get("window").width,
          }}
        >
          <View
            style={{
              height: 35,
              backgroundColor: "white",
              position: "absolute",
              bottom: 0,
              width: Dimensions.get("window").width,
              borderTopLeftRadius: 99,
              borderTopRightRadius: 99,
            }}
          />
          <TouchableOpacity style={[styles.dp]} activeOpacity={0.8}>
            <Avatar
              size="large"
              source={{
                uri:
                  user?.photoURL ||
                  "https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png",
              }}
              icon={{ name: "user", type: "font-awesome" }}
              activeOpacity={0.7}
              containerStyle={{ borderRadius: 999 }}
              avatarStyle={{ borderRadius: 999 }}
            />
          </TouchableOpacity>
        </ImageBackground>

        <View style={[styles.userDetails]}>
          <View style={[styles.info]}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginBottom: 10,
                alignSelf: "center",
              }}
            >
              {user.displayName}
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginBottom: 10,
                alignSelf: "center",
              }}
            >
              {info?.location || info?.location}
            </Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => goToURL()}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "#49cbe9",
                  alignSelf: "center",
                  marginBottom: 10,
                }}
              >
                {info?.website}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginBottom: 10,
                alignSelf: "center",
              }}
            >
              {info?.bio || info?.description}
            </Text>

            <View style={styles.login}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: "rgb(211,211,211)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="chat-processing-outline"
                  size={30}
                  color="rgb(164,	129,	205	)"
                />
              </TouchableOpacity>
              <Button
                style={styles.loginButton}
                title={
                  friend
                    ? "Following"
                    : !requestSent
                    ? followBack
                      ? "Follow Back"
                      : "Follow"
                    : "Follow Request Sent"
                }
                buttonStyle={{
                  width: 200,
                  backgroundColor: "rgb(70,	113,	241)	",
                  borderRadius: 12,
                  marginHorizontal: 10,
                }}
                onPress={handleFollow}
              />

              <TouchableOpacity
                onPress={sendCompliment}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: "rgb(211,211,211)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="emoticon-excited"
                  size={30}
                  color="rgb(248,	218	,93	)"
                />
              </TouchableOpacity>
            </View>
            {/* <Button
              style={styles.loginButton}
              title="Send Compliment"
              buttonStyle={{
                width: 200,
                backgroundColor: "#49cbe9",
                borderRadius: 12,
              }}
              onPress={sendCompliment}
            /> */}
          </View>
        </View>
        <View style={[styles.a]}>
          <TouchableOpacity
            onPress={() => navigateUser(followers, "Followers")}
            style={[
              styles.stats,
              {
                borderRightWidth: 1,
                borderRightColor: "lightgray",
              },
            ]}
          >
            <Text style={styles.userText}>{followers.length}</Text>
            <Text style={styles.text}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateUser(following, "Following")}
            style={[
              styles.stats,
              {
                borderRightWidth: 1,
                borderRightColor: "lightgray",
              },
            ]}
          >
            <Text style={styles.userText}>{following.length}</Text>
            <Text style={styles.text}>Following</Text>
          </TouchableOpacity>
          <View style={[styles.stats]}>
            <Text style={styles.userText}>{likes}</Text>
            <Text style={styles.text}>Likes</Text>

            {/* <AntDesign name="heart" size={24} color="red" /> */}
          </View>
        </View>
      </View>
      {/* <View style={{margin: 10, borderTopWidth: 0.5,paddingVertical: 5}}> */}
      {/* <FlatList
			data={posts}
			style={{ marginBottom: 10 }}
			numColumns={3}
			keyExtractor={(item) => item.id}
			renderItem={({ item,index }) => (
				<View>
					{item?.data?.image?.length > 0 ? (
						// console.log('postid00>',item),
						<TouchableOpacity onPress={() =>handlePress(posts,index)} activeOpacity={0.7} style={{margin: 2}}>
							<Image
								source={{ uri: item?.data?.image?.[0] }}
								style={{ height: width / 3, width: width / 3, borderRadius: 10 }}
							/>
						</TouchableOpacity>
					) : null}
				</View>
			)}
		/> */}
      {/* </View> */}

      {/* </ScrollView> */}
      <View style={{ height: 50 }} />
    </KeyboardAvoidingView>
  );
};

export default HeaderComp;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "column",
    flex: 1,
    color: "black",
    backgroundColor: "white",
  },
  login: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  // bottom: {
  // 	alignSelf: "center",
  // 	justifyContent: "flex-end",
  // 	flex : 0,
  // },
  a: {
    flexDirection: "row",
    flex: 0,
    paddingVertical: 10,
    // borderBottomColor: "black",
    // borderBottomWidth: 0.3,
    // alignItems:"",
    // alignSelf: "center",
    width: "100%",
    justifyContent: "space-between",
  },

  userDetails: {
    flexDirection: "column",
    flex: 1,
    // alignItems:"",
    alignSelf: "center",
  },

  loginHeader: {
    // flexDirection: "row",
    // flex: 1,
    alignItems: "center",
    // justifyContent: "space-between",
    marginHorizontal: 10,
  },
  userDetails: {
    flexDirection: "column",
    justifyContent: "center",
    // alignItems:"center"
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgb(211,	211,	211)	",
  },
  info: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  stats: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginTop: 10,
    flex: 1,
    // paddingVertical: 20
  },
  dp: {
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 999,
    // padding: 5,
    // flex: 1,
  },
});
