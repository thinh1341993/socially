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

const ActivityCompliments = ({ navigation }) => {
  const pages = useSelector(selectPages);
  var page = useSelector(selectPage);
  page = page?.length > 0 ? page : pages;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const authUser = firebase.auth().currentUser;
  // console.log('page-->',page);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: page?.name || "Compliments",
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
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={200}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={100} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </>
  );
};

export default ActivityCompliments;

const styles = StyleSheet.create({});
