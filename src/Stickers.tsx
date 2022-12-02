import {
  Canvas,
  Skia,
  useFont,
  useValue,
  runTiming,
} from "@shopify/react-native-skia";
import React from "react";
import { View, SafeAreaView, Button, Easing } from "react-native";
import { GestureHandler } from "./GestureHandler";
import { ChartSticker, ChartStickerDimensions } from "./ChartSticker";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";

const CanvasHeight = 500;
const CanvasWidth = 1000;
const CanvasMargin = 10;

export const Stickers = () => {
  const chartMatrix = useValue(Skia.Matrix());
  const animationState = useValue(0);
  const font = useFont(Roboto_400Regular, 10);

  const animate = () => {
    animationState.current = 0;

    runTiming(animationState, 1, {
      duration: 1600,
      easing: Easing.inOut(Easing.exp),
    });
  };

  if (!font) {
    return null;
  }

  return (
    <SafeAreaView>
      <View>
        <Canvas
          style={{
            width: CanvasWidth,
            height: CanvasHeight,
            margin: CanvasMargin,
          }}
        >
          <ChartSticker
            font={font}
            matrix={chartMatrix}
            animationState={animationState}
          />
        </Canvas>
        <GestureHandler
          matrix={chartMatrix}
          dimensions={ChartStickerDimensions}
        />
      </View>
      <Button title="Animate!" onPress={animate} />
    </SafeAreaView>
  );
};
