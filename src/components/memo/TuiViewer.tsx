import React, { useContext, useEffect, useState, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import styled from "@emotion/styled";
import Portal from "../common/Portal";
import { ActiveDetailContext } from "../../context/ActiveDetailContext";
import { css } from "@emotion/react";
import UpdateTuiEditor from "./UpdateTuiEditor";
import UpdateMemo from "./UpdateMemo";

interface Props {
  content: string;
  selector: string;
  className: string;
  show: any;
  setAni: any;
  id: any;
  title: any;
}

const TuiViewer = ({ content, selector = "#portal", show, setAni, id, title }: Props) => {
  const { activeDetail, setActiveDetail } = useContext(ActiveDetailContext);

  const [editMode, setEditMode] = useState(false);
  const handleUpdate = () => {
    setEditMode(!editMode);
  };

  const ref = useRef<any>();

  return (
    <Portal selector={selector}>
      <Wrapper show={show}>
        <Overlay></Overlay>
        <Base>
          <Update onClick={() => handleUpdate()}>수정하기</Update>
          {editMode && <UpdateMemo id={id} title={title} content={content} setEditMode={setEditMode} />}
          <Viewer initialValue={content || ""} theme="dark" />
          <Close
            onClick={() => {
              setActiveDetail("");
              setAni(false);
            }}
          >
            닫기
          </Close>
        </Base>
      </Wrapper>
    </Portal>
  );
};

const Wrapper = styled.div<any>`
  transition: all 0.3s;
  ${({ show }) =>
    show
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
        `}
`;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #00000086;
`;

const Base = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 1rem;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 90vmin;
  height: 90vmin;
  background-color: var(--sub-bgc);
  color: var(--main-text);
  overflow-y: scroll;

  transition: all 0.3s;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Update = styled.div``;

export default TuiViewer;
