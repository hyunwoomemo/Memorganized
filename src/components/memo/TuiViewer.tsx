import { useContext, useEffect, useState, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import styled from "@emotion/styled";
import Portal from "../common/Portal";
import { ActiveDetailContext } from "../../context/ActiveDetailContext";
import { css } from "@emotion/react";
import UpdateMemo from "./UpdateMemo";
import { FiEdit } from "react-icons/fi";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface Props {
  content: string;
  selector: string;
  className: string;
  id: any;
  title: any;
  category: string;
}

const TuiViewer = ({ content, selector = "#portal", id, title, category }: Props) => {
  const { setActiveDetail } = useContext(ActiveDetailContext);

  const [editMode, setEditMode] = useState(false);
  const handleUpdate = () => {
    setEditMode(!editMode);
  };

  const baseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editMode && baseRef.current) {
      baseRef.current.scrollTo({ top: 0 });
    }
  }, [editMode]);

  return (
    <Portal selector={selector}>
      <Wrapper>
        <Overlay></Overlay>
        <Base editMode={editMode} ref={baseRef}>
          <Util>
            {title && <Title>{title}</Title>}
            {category && <Category>{category}</Category>}
            <Update onClick={() => handleUpdate()}>
              <FiEdit />
            </Update>
            <Close
              onClick={() => {
                setActiveDetail("");
              }}
            >
              <AiOutlineCloseCircle />
            </Close>
          </Util>
          {editMode && <UpdateMemo category={category} id={id} title={title} content={content} setEditMode={setEditMode} />}
          <Viewer initialValue={content || ""} theme="dark" />
        </Base>
      </Wrapper>
    </Portal>
  );
};

const Wrapper = styled.div<any>`
  transition: all 0.3s;
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

const Base = styled.div<{ editMode: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 1rem;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background-color: var(--sub-bgc);
  color: var(--main-text);

  transition: all 0.3s;

  ${({ editMode }) =>
    editMode
      ? css`
          overflow-y: hidden;
        `
      : css`
          overflow-y: scroll;
        `}
`;

const Title = styled.div`
  font-size: 20px;
  padding: 1rem 0;
  flex: 1 1 auto;
`;

const Category = styled.div`
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 5px;
  background-color: var(--main-bgc);
`;

const Util = styled.div`
  display: flex;
  min-height: 60px;
  justify-content: flex-end;
  font-size: 20px;
  gap: 1rem;
  align-items: center;

  > div:hover {
    color: var(--primary-color);
  }

  border-bottom: 1px solid var(--primary-color);
`;

const UtilItem = styled.div`
  cursor: pointer;
  position: relative;

  &:before {
    position: absolute;
    font-size: 12px;
    bottom: 120%;
    white-space: nowrap;
    padding: 5px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: all 0.3s;
    background-color: var(--primary-color);
    border-radius: 10px;
  }

  &:hover:before {
    color: #000;
    opacity: 1;
  }
`;

const Close = styled(UtilItem)`
  &:before {
    content: "닫기";
  }
`;

const Update = styled(UtilItem)`
  &:before {
    content: "수정";
  }
`;

export default TuiViewer;
