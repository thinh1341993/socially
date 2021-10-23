import React, { useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ProfileComp from "../../components/ProfileComp";
import { selectPage, setPage } from "../../redux/features/pageSlice";
import { Entypo } from "@expo/vector-icons";
import { db } from "../../firebase";
import { selectUser } from "../../redux/features/userSlice";
import * as firebase from "firebase";
import { selectPages } from "../../redux/features/pagesSlice";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

const Activity = ({ navigation }) => {
  const pages = useSelector(selectPages);
  var page = useSelector(selectPage);
  page = page?.length > 0 ? page : pages;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const authUser = firebase.auth().currentUser;
  // console.log('page-->',page);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: page?.name || "Activity",
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 10 }}
          onPress={() => navigation.openDrawer()}
        >
          <Entypo name="menu" size={28} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <>
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          //   justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("ActivityFollowers")}
          activeOpacity={0.7}
          style={[
            styles.stats,
            {
              backgroundColor: "#FFA2BF",
              marginTop: 10,
              width: 300,
              borderRadius: 5,
              height: 100,

              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.statsText, { marginBottom: 10 }]}>
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ActivityLikes")}
          activeOpacity={0.7}
          style={[
            styles.stats,
            {
              backgroundColor: "#81D5DF",
              marginTop: 10,
              width: 300,
              borderRadius: 5,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.statsText, { marginBottom: 10 }]}>Likes </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ActivityCompliments")}
          activeOpacity={0.7}
          style={[
            styles.stats,
            {
              backgroundColor: "#5F75EC",
              marginTop: 10,
              width: 300,
              borderRadius: 5,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.statsText, { marginBottom: 10 }]}>
            Compliments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ActivityProfileVisitors")}
          activeOpacity={0.7}
          style={[
            styles.stats,
            {
              backgroundColor: "#5f95EC",
              marginTop: 10,
              width: 300,
              borderRadius: 5,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.statsText, { marginBottom: 10 }]}>
            Profile Visitors
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Activity;

const styles = StyleSheet.create({});
