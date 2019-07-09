import React from "react";
import "./index.scss";
import moment from "moment";
import DateBlockArr from "./components/dateBlockArr";
import ContentBlockArr from "./components/contentBlockArr";
import listMapAddPosInfo from "./listMapAddPosInfo";
/*
  props:
    list: [
    [
    attr: {
      eventStartTime
      createTime:
      duration:
      name:
      content:
    }
  ]]
    ganteConfig: {
      unitStretch 时间轴上的单位长度
      minInterval 最小时间精度
      type 展示的方式（vertical）
    }
 */
export default function RenderGanteContainer(props) {
  const { list = [], ganteConfig = {} } = props;
  const { type, minInterval } = ganteConfig;
  if (list && list.length) {
    const startCalcTime = moment(list[0].attr.eventStartTime)
      .clone()
      .startOf("h");
    const dataBlockValue = 50; //日期flex长度
    // style1
    const dataContainerStyle = {
      flexBasis: dataBlockValue
    };
    // style2
    let contentContainerStyle = {};
    const diffValue =
      -ganteConfig.unitStretch *
      moment(startCalcTime).diff(
        moment(startCalcTime)
          .clone()
          .startOf("day"),
        minInterval
      );
    if (type === "vertical") {
      contentContainerStyle = {
        left: dataBlockValue,
        top: diffValue
      };
    } else {
      contentContainerStyle = {
        top: dataBlockValue,
        left: diffValue
      };
    }
    return (
      <div className={`${type} gante-container`}>
        <div style={dataContainerStyle} className={`${type} date-container`}>
          {renderDateBlockArr(ganteConfig, startCalcTime)}
        </div>
        <div style={contentContainerStyle} className={`${type} item-container`}>
          {renderContentBlockArr(ganteConfig, list)}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

function renderDateBlockArr(ganteConfig, startCalcTime) {
  const timeRenderInterval = 60; // 时间间隔
  return (
    <DateBlockArr
      {...ganteConfig}
      startCalcTime={startCalcTime}
      timeRenderInterval={timeRenderInterval}
    />
  );
}
function renderContentBlockArr(ganteConfig, list) {
  const { minInterval, ...otherGanteConfig } = ganteConfig;
  const unitContent = 100; // 单位内容长度
  const contentSpaceType = 1; // contentSpace标准采用 1 2 还是calc
  let listWithPosInfo = listMapAddPosInfo(list, minInterval, contentSpaceType);
  return (
    <ContentBlockArr
      {...otherGanteConfig}
      list={listWithPosInfo}
      unitContent={unitContent}
    />
  );
}
