import { useLayoutEffect, useEffect, useState } from "react";
import {
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  Text,
  View,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { selectUsers } from "../../redux/features/usersSlice";
import React from "react";
import moment from "moment";
import * as firebase from "firebase";

const windowWidth = Dimensions.get("window").width;

const ChatList = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const [newChat, setNewChat] = useState(false);
  const [newChatButton, setNewChatButton] = useState(false);
  const users = useSelector(selectUsers);
  const user = useSelector(selectUser);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const subscriber = db
      .collection("chats")
      .where("Members", "array-contains", user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((child) => {
          child.data().Members.forEach((member) => {
            if (member != user.uid) {
              db.collection("users")
                .doc(member)
                .get()
                .then((memberDetails) => {
                  let tempArray = [];
                  chatList.forEach((chatListChild) => {
                    tempArray.push(chatListChild);
                  });
                  tempArray.push({
                    name: memberDetails.data().displayName,
                    image: memberDetails.data().photoURL,
                    preview: child.data().preview,
                    timestamp: child.data().timestamp,
                    id: child.id,
                    friend: member,
                    blockedBy: child.data().blockedBy,
                    color: child.data().color,
                  });
                  setChatList(tempArray);
                });
            }
          });
        });
      });

    // return () => subscriber();
  }, [navigation]);

  useEffect(() => {}, [chatList]);

  const startNewChat = (item) => {
    db.collection("chats")
      .add({
        members: [user.uid, item.uid],
        blockedBy: "",
        preview: "Hi " + item.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        color: false,
      })
      .then((response) => {
        db.collection("chats")
          .doc(response.id)
          .collection("data")
          .add({
            message: "Hi " + item.displayName,
            sender: user.uid,
            receiver: item.uid,
            image: "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            navigation.navigate("ChatScreen", {
              item: {
                name: item.displayName,
                image: item.photoURL,
                preview: "Hi " + item.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                id: response.id,
                friend: item.uid,
                blockedBy: "",
                color: false,
              },
            });
          });
      });
  };

  if (newChat) {
    return (
      <View backgroundColor={"#FFFFFF"} flex={1}>
        <StatusBar barStyle={"dark-content"} backgroundColor={"#FFFFFF"} />
        <View
          style={{
            height: 60,
            width: windowWidth,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
            borderBottomWidth: 0.5,
            borderBottomColor: "#C7C6CE",
          }}
        >
          <TouchableOpacity
            onPress={() => setNewChat(false)}
            style={{ marginLeft: 10 }}
          >
            <Ionicons
              name={"chevron-back-outline"}
              size={35}
              color={"#000000"}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, color: "#000000" }}>
            {" "}
            Start New Chat
          </Text>
        </View>
        {console.log(users)}
        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: windowWidth - 40,
                height: 100,
                borderBottomWidth: 0.5,
                borderBottomColor: "#C7C6CE",
                marginHorizontal: 20,
              }}
              onPress={() => startNewChat(item)}
            >
              <Image
                style={{
                  resizeMode: "cover",
                  height: 60,
                  width: 60,
                  borderTopLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  borderTopRightRadius: 15,
                }}
                source={
                  item.photoURL != null
                    ? { uri: item.photoURL }
                    : require("../../assets/user-blue.png")
                }
              />
              <View style={{ width: windowWidth - 100 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 22,
                      fontWeight: "bold",
                      marginLeft: 10,
                    }}
                  >
                    {" "}
                    {item.displayName}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <View backgroundColor={"#FFFFFF"} flex={1}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#FFFFFF"} />
      <View
        style={{
          width: windowWidth,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            color: "#272639",
            fontSize: 45,
            fontWeight: "bold",
            marginLeft: 30,
          }}
        >
          {chatList.length}{" "}
        </Text>
        <Text style={{ color: "#272639", fontSize: 45 }}>Chat</Text>
        <Text style={{ color: "#272639", fontSize: 45 }}>
          {chatList.length == 1 ? "" : "s"}
        </Text>
        <TouchableOpacity style={{ position: "absolute", right: 30 }}>
          <AntDesign name={"search1"} size={35} color={"#C7C6CE"} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              alignItems: "center",
              flexDirection: "row",
              width: windowWidth - 40,
              height: 100,
              borderBottomWidth: 0.5,
              borderBottomColor: "#C7C6CE",
              marginHorizontal: 20,
            }}
            onPress={() => {
              navigation.navigate("ChatScreen", { item: item });
            }}
          >
            <Image
              style={{
                resizeMode: "cover",
                height: 60,
                width: 60,
                borderTopLeftRadius: 15,
                borderBottomRightRadius: 15,
                borderTopRightRadius: 15,
              }}
              source={{ uri: item.image }}
            />
            <View style={{ width: windowWidth - 100 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginLeft: 10,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: "#C7C6CE",
                    fontSize: 16,
                    position: "absolute",
                    right: 0,
                  }}
                >
                  {moment(
                    new Date(item.timestamp.seconds * 1000).toUTCString()
                  ).fromNow()}
                </Text>
              </View>
              <Text
                style={{
                  color: "#A3A3AD",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                {item.preview}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => setNewChat(true)}
        style={{
          position: "absolute",
          right: 30,
          bottom: 30,
          backgroundColor: "#3240FF",
          borderRadius: 100,
          height: 60,
          width: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name={"plus"} size={30} color={"#FFFFFF"} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatList;
