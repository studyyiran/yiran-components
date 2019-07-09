import moment from "moment";
import "./index.scss";
import React from "react";
/*

props: {
  timeRenderInterval: 根据时间跨度，计算出perDateBlockStretch，列表渲染对应的时间累积
  ...ganteConfig
}
 */
export default function RenderDateBlockArr(props) {
  let {
    type,
    startCalcTime,
    unitStretch,
    minInterval,
    timeRenderInterval
  } = props;
  let style = {};
  let timeNow = startCalcTime.clone();
  let timeEnd = startCalcTime.clone().endOf("day");

  let arr = [];
  const perDateBlockStretch = unitStretch * timeRenderInterval;
  Object.assign(
    style,
    type === "vertical"
      ? { height: perDateBlockStretch }
      : { minWidth: perDateBlockStretch, maxWidth: perDateBlockStretch }
  );
  while (moment(timeNow).isBefore(timeEnd)) {
    const contentTime = timeNow
      .clone()
      .add(timeRenderInterval / 2, minInterval)
      .format("HH:mm");
    arr.push(
      <div
        className="zao-flex date-block-container"
        style={style}
        key={contentTime}
      >
        {contentTime}
      </div>
    );
    timeNow.add(timeRenderInterval, minInterval);
  }
  return arr;
}
