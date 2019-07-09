import moment from "moment";
/*
根据排布的算法，计算出正确的坐标。
props: {
  list: [],
  minInterval: 时间精度
}
 */
export default function listMapAddPosInfo(
  list = [],
  minInterval,
  contentSpaceType = 1
) {
  const setContentSpace = getCell();
  return list.map(item => {
    const { attr } = item;
    let { eventStartTime, eventEndTime } = attr;
    eventStartTime = moment(eventStartTime);
    eventEndTime = moment(eventEndTime);
    const contentSpace = calcContentSpace(attr);
    let fillByStartEndPos = setContentSpace(contentSpace);
    const timeStart = moment(eventStartTime)
      .clone()
      .startOf("day");
    attr.posInfo = {
      contentSpace,
      startTimePos: eventStartTime.diff(timeStart, minInterval),
      endTimePos: eventEndTime.diff(timeStart, minInterval)
    };
    Object.assign(attr.posInfo, {
      contentPos: fillByStartEndPos(
        attr.posInfo.startTimePos,
        attr.posInfo.endTimePos
      )
    });
    return item;
  });

  /*
   根据设定的type，返回需要的contentSpace
   */
  function calcContentSpace(attr) {
    let { eventStartTime, eventEndTime, content } = attr;
    const perWordWrap = 1;
    // 根据内容长度和空间大小
    let contentSpace =
      contentSpaceType === "calc"
        ? Math.ceil(
            (perWordWrap * content.length) /
              eventEndTime.diff(eventStartTime, minInterval)
          )
        : contentSpaceType;
    if (contentSpace <= 0) {
      contentSpace = 1;
    }
    if (contentSpace > 5) {
      contentSpace = 5;
    }
    return contentSpace;
  }

  /*
  3层科里化。用于根据 冲突占位 进行cell填充。返回contentPos的位置。
   */
  function getCell() {
    const cell = [[]];
    return contentSpace => {
      return (lengthStartPos, lengthEndPos) => {
        let contentPos = 0;
        while (!checkCanFill()) {
          contentPos++;
        }
        fillInto();
        function checkCanFill() {
          let result = true;
          loop((b, a) => {
            if (cell && cell[a] && cell[a][b] && cell[a][b] === true) {
              result = false;
              return "break";
            }
          });
          return result;
        }
        function fillInto() {
          loop((b, a) => {
            if (!cell[a]) {
              cell[a] = [];
            }
            cell[a][b] = true;
          });
        }
        // 这块出现过无法进入的bug 已修复
        function loop(callBack) {
          for (let length = lengthStartPos; length < lengthEndPos; length++) {
            for (let width = 0; width < contentSpace; width++) {
              if (callBack(length, contentPos + width) === "break") {
                break;
              }
            }
          }
        }
        return contentPos;
        // TODO 不想利用闭包。
      };
    };
  }
}
