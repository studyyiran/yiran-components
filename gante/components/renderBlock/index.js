import React, { useState } from "react";
import "./index.scss";
/*
进行absolute渲染。
props: {
  posX,posY // 传入坐标有关的信息。
  width, height // 传入大小信息。
  content // 传入内容
}
 */
function RenderBlock(props) {
  const { posX, posY, width, height, content, background } = props;
  const [dialogContent, setDialogContent] = useState(false);
  const [dialogOffsetX, setOffsetX] = useState(0);
  const [dialogOffsetY, setOffsetY] = useState(0);
  const [needUpdate, setNeedUpdate] = useState(true);
  let styleContainer = {
    left: posX,
    top: posY
  };
  let style = {
    maxWidth: width,
    width,
    height,
    background
  };
  function setPos(e, showDialog) {
    // 这块的冒泡有点问题。再看一下
    // 这块还是有抖动。得解决一下
    if (e.target.className === "dialog") {
      return;
    }
    const { nativeEvent } = e;
    const { offsetX, offsetY } = nativeEvent;
    const limit = 100;
    if (
      needUpdate ||
      Math.abs(dialogOffsetX - offsetX) > limit ||
      Math.abs(dialogOffsetY - offsetY) > limit
    ) {
      setNeedUpdate(false);
      setOffsetX(offsetX);
      setOffsetY(offsetY);
    }
  }
  // function内部的绑定，只能箭头吗？有性能问题嘛？
  return (
    <div
      onMouseEnter={e => {
        setNeedUpdate(true);
        setDialogContent(content);
      }}
      onMouseMove={setPos}
      onMouseLeave={() => {
        setDialogContent("");
      }}
      style={styleContainer}
      className="render-block-container"
    >
      <div className="zao-flex zao-line-clamp item-block" style={style}>
        <span>{content}</span>
      </div>
      {dialogContent ? (
        <RenderDialog
          content={dialogContent}
          dialogOffsetX={dialogOffsetX}
          dialogOffsetY={dialogOffsetY}
        />
      ) : null}
    </div>
  );
}

function RenderDialog(props) {
  const { content, dialogOffsetX, dialogOffsetY } = props;
  if (content) {
    return (
      <div
        style={{ left: dialogOffsetX, top: dialogOffsetY }}
        className="dialog"
      >
        {content}
      </div>
    );
  } else {
    return null;
  }
}

export default RenderBlock;
