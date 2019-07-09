/*
根据坐标，进行渲染。
传入相对坐标，计算出绝对坐标，和绝对大小
 */

import RenderBlock from "../renderBlock/index";
import React from "react";
import moment from "moment";

export default function RenderContentBlockArr(props) {
  const { list = [], unitStretch, unitContent, type = "vertical" } = props;
  return list.map(item => {
    const { attr } = item;
    const { contentPos, startTimePos, endTimePos, contentSpace } = attr.posInfo;

    const stretchLength = unitStretch * (endTimePos - startTimePos);
    const contentLength = unitContent * contentSpace;
    const stretchPosWithUnit = startTimePos * unitStretch;
    const contentPosWithUnit = contentPos * unitContent;
    let posX, posY, width, height;
    if (type === "vertical") {
      posX = contentPosWithUnit;
      posY = stretchPosWithUnit;
      width = contentLength;
      height = stretchLength;
    } else if (type === "horizontal") {
      posX = stretchPosWithUnit;
      posY = contentPosWithUnit;
      width = stretchLength;
      height = contentLength;
    }

    const { eventStartTime, eventEndTime } = attr;
    const { content, _id, eventType } = attr;
    return (
      <RenderBlock
        key={_id}
        content={
          <div>
            <span>
              {moment(eventStartTime).format("HH:mm")}—
              {moment(eventEndTime).format("HH:mm")}
            </span>
            <br />
            <span>{content}</span>
          </div>
        }
        posX={posX}
        posY={posY}
        background={getColorByType(eventType)}
        width={width}
        height={height}
      />
    );
  });
}
/*
不同类别渲染不同颜色
 */
function getColorByType(type) {
  console.log(type)
  let color;
  switch (type) {
    case "dream":
      color = "#FFE3E9";
      break;
    case "studytodo":
      color = "#E4E1FF";
      break;
    case "review":
      color = "#E7F3E7";
      break;
    default:
      color = "#E1F3FF";
  }
  return color;
}
