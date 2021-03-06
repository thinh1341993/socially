import React from "react";
import { StyleSheet, View } from "react-native";
import Slider from "@react-native-community/slider";
import { Text } from "react-native-elements";

const Filters = ({ value, name, minimum, maximum, onChange }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{name}</Text>
    <Slider
      value={value}
      style={styles.slider}
      minimumValue={minimum}
      maximumValue={maximum}
      onValueChange={onChange}
    />
  </View>
);

export default Filters;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    paddingLeft: 20,
  },
  text: { textAlign: "center" },
  slider: { width: 150 },
});
