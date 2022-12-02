import {
  Path,
  useComputedValue,
  Skia,
  Text,
  SkiaMutableValue,
} from "@shopify/react-native-skia";
import type { SkFont, SkiaValue, SkMatrix } from "@shopify/react-native-skia";
import { Group, rect } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

const { height } = Dimensions.get("window");
export const ChartStickerDimensions = rect(0, 0, 1000, height);
import * as d3 from "d3";

interface baseDataPoint {
  label: string;
  startTime: number;
  endTime: number;
  hour: number;
}

interface time {
  label: string;
}
const baseData: baseDataPoint[] = [
  { label: "a", startTime: 6, endTime: 24, hour: 18 },
  { label: "b", startTime: 6, endTime: 12, hour: 18 },
  { label: "c", startTime: 8.5, endTime: 13, hour: 4.5 },
  { label: "d", startTime: 9, endTime: 14, hour: 7 },
  { label: "e", startTime: 10, endTime: 15, hour: 7 },
  { label: "f", startTime: 11, endTime: 16, hour: 5 },
  { label: "g", startTime: 11, endTime: 16, hour: 5 },
];

const time: time[] = [
  { label: "06" },
  { label: "07" },
  { label: "08" },
  { label: "09" },
  { label: "10" },
  { label: "11" },
  { label: "12" },
  { label: "13" },
  { label: "14" },
  { label: "15" },
  { label: "16" },
  { label: "17" },
  { label: "18" },
  { label: "19" },
  { label: "20" },
  { label: "21" },
  { label: "22" },
  { label: "23" },
  { label: "24" },
];

const openRange = { startTime: 6, endTime: 24 };

const GRAPH_MARGIN = 5;
const GRAPH_BAR_WIDTH = 15;
const TIME_BAR_WIDTH = 0.5;

const CanvasHeight = 350;

const yMinRange = 0;
const yMaxRange = 350;

const timeMinRange = 0;
const timeMaxRange = 500;

const xMinDomain = 0;
const xMaxDomain = 18;

interface ChartStickerProps {
  matrix: SkiaValue<SkMatrix>;
  font: SkFont;
  animationState: SkiaMutableValue<number>;
}

export const ChartSticker = ({
  font,
  matrix,
  animationState,
}: ChartStickerProps) => {
  const yDomain = baseData.map((dataPoint: baseDataPoint) => dataPoint.label);
  const yRange = [yMinRange, yMaxRange];

  const y = d3.scalePoint().domain(yDomain).range(yRange).padding(1);

  const timeDomain = time.map((dataPoint) => dataPoint.label);
  const timeRange = [timeMinRange, timeMaxRange];
  const timex = d3.scalePoint().domain(timeDomain).range(timeRange);

  const xDomain = [xMinDomain, xMaxDomain];
  const xRange = [timeMinRange, timeMaxRange];
  const x = d3.scaleLinear().domain(xDomain).range(xRange);

  const mainPath = useComputedValue(() => {
    const newPath = Skia.Path.Make();

    baseData.forEach((dataPoint: baseDataPoint) => {
      const rect = Skia.XYWHRect(
        x(dataPoint.startTime - openRange.startTime) + x(1),
        y(dataPoint.label) - GRAPH_BAR_WIDTH - GRAPH_MARGIN,
        x(dataPoint.hour * animationState.current),
        GRAPH_BAR_WIDTH
      );
      const rrect = Skia.RRectXY(rect, 0, 0);
      newPath.addRRect(rrect);
    });

    return newPath;
  }, [animationState]);

  const timePath = useComputedValue(() => {
    const newPath = Skia.Path.Make();

    time.forEach((dataPoint: time) => {
      const rect = Skia.XYWHRect(
        timex(dataPoint.label) + x(1),
        CanvasHeight,
        TIME_BAR_WIDTH,
        -CanvasHeight
      );

      const rrect = Skia.RRectXY(rect, 8, 8);
      newPath.addRRect(rrect);
    });

    return newPath;
  }, []);

  return (
    <Group matrix={matrix}>
      <Path path={timePath} color="gray" />
      <Path path={mainPath} color="blue" />

      {baseData.map((dataPoint, index) => {
        return (
          <Text
            key={index}
            font={font}
            y={y(dataPoint.label) - 10}
            text={dataPoint && dataPoint.label}
          />
        );
      })}
      {time.map((timePoint, index) => {
        return (
          <Text
            key={index}
            font={font}
            x={timex(timePoint.label) + x(1) - GRAPH_MARGIN}
            y={CanvasHeight}
            text={timePoint.label}
          />
        );
      })}
    </Group>
  );
};
