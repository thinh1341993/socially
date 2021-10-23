import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Slider,
} from "react-native";
import { Surface } from "gl-react-expo";
import { FontAwesome, FontAwesome5, Feather } from "@expo/vector-icons";

import ImageFilters, { Constants } from "react-native-gl-image-filters";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const settings = [
  {
    name: "hue",
    icon: "swatchbook",
    minValue: 0,
    maxValue: 6.3,
  },
  {
    name: "blur",
    icon: "cloud-sun",
    minValue: 0,
    maxValue: 30,
  },
  {
    name: "sepia",
    icon: "filter",
    minValue: -5,
    maxValue: 5,
  },
  {
    name: "sharpen",
    icon: "marker",
    minValue: 0,
    maxValue: 15,
  },
  {
    name: "negative",
    icon: "minus",
    minValue: -2.0,
    maxValue: 2.0,
  },
  {
    name: "contrast",
    icon: "adjust",
    minValue: -10.0,
    maxValue: 10.0,
  },
  {
    name: "saturation",
    icon: "adjust",
    minValue: 0.0,
    maxValue: 2,
  },
  {
    icon: "sun",
    name: "brightness",
    minValue: 0,
    maxValue: 5,
  },
  {
    icon: "temperature-low",
    name: "temperature",
    minValue: 0.0,
    maxValue: 40000.0,
  },
  {
    icon: "moon",
    name: "exposure",
    step: 0.05,
    minValue: -1.0,
    maxValue: 1.0,
  },
];

// alert();
export default class ImageEditor extends Component {
  state = {
    ...settings,
    hue: 0,
    blur: 0,
    sepia: 0,
    sharpen: 0,
    negative: 0,
    contrast: 1,
    saturation: 1,
    brightness: 1,
    temperature: 6500,
    exposure: 0,
    min: 0,
    max: 0,
    name: "",
  };

  saveImage = async () => {
    if (!this.image) return;

    const result = await this.image.glView.capture();
    this.props.navigation.navigate("CameraPreview", { photo: result.uri });
  };

  resetImage = () => {
    this.setState({
      ...Constants.DefaultValues,
    });
  };

  render() {
    const photo = this.props?.route?.params?.photo;

    return (
      <View style={{ height: "100%", width: "100%" }}>
        <Surface
          style={{
            height: height - 150,
            width: width,
          }}
          ref={(ref) => (this.image = ref)}
        >
          <ImageFilters {...this.state} width={width} height={width}>
            {{ uri: photo }}
          </ImageFilters>
        </Surface>
        <View style={{ position: "absolute", bottom: 150, right: 10 }}>
          <TouchableOpacity
            onPress={this.saveImage}
            style={{
              width: 100,
              height: 40,
              alignItems: "center",
              borderRadius: 4,
              backgroundColor: "black",
              padding: 10,
              borderRadius: 15,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                paddingRight: 10,
              }}
            >
              Next
            </Text>
            <FontAwesome5 name="arrow-circle-right" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {this.state.name != "" ? (
          <Slider
            minimumTrackTintColor={"#4169E1"}
            maximumTrackTintColor={"#b3b3b3"}
            thumbTintColor={"#4169E1"}
            thumbTouchSize={{ width: 150, height: 150 }}
            style={{ width: width, top: 20 }}
            minimumValue={this.state.min}
            maximumValue={this.state.max}
            onValueChange={(val) => this.setState({ [this.state.name]: val })}
          />
        ) : null}

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <FlatList
            style={{ backgroundColor: "grey" }}
            data={settings}
            horizontal
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View
                style={{
                  height: 50,
                  flexDirection: "column",
                  marginHorizontal: width * 0.01,
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    height: 50,
                    width: 100,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    this.setState({
                      name: item.name,
                      min: item.minValue,
                      max: item.maxValue,
                    })
                  }
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome5 name={item.icon} size={24} color="black" />
                    <Text
                      style={{
                        fontSize: 14,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}
