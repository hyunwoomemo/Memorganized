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
import { AiOutlineCloseCircle, AiOutlineCopy } from "react-icons/ai";
import { GoTrashcan } from "react-icons/go";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../service/firbase";
import { toast } from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { createBrowserHistory } from "history";

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

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "memos", id));
      console.log("Document successfully deleted!");
      setActiveDetail("");
      toast("삭제되었습니다!", {
        icon: "🗑️",
        style: {
          background: "var(--danger-color)",
          color: "var(--main-text)",
        },
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    toast("복사되었습니다.", {
      icon: "📋",
    });
    setCopied(true);
  };

  const parser = new DOMParser();
  const parsedHTML = parser.parseFromString(content, "text/html");

  const plainText = parsedHTML.body.innerHTML.replace(/<br>/g, "\n").replace(/<\/?[^>]+(>|$)/g, "");

  /*  window.addEventListener("popstate", (e) => {
    e.preventDefault();

    console.log("sdf");
    setActiveDetail("");
  });

  useEffect(() => {
    const handleBackButton = (e: any) => {
      console.log("back");
      setActiveDetail("");
    };

    window.onpopstate = handleBackButton;

    return () => {
      window.onpopstate = null;
    };
  }, []); */

  return (
    <Portal selector={selector}>
      <Wrapper>
        <Overlay></Overlay>
        <Base editMode={editMode} ref={baseRef}>
          {category && <Category>{category}</Category>}
          <Util>
            {title && <Title>{title}</Title>}
            <CopyToClipboard text={plainText} onCopy={handleCopy}>
              <Copy>
                <AiOutlineCopy />
              </Copy>
            </CopyToClipboard>
            <Update onClick={() => handleUpdate()}>
              <FiEdit />
            </Update>
            <Delete onClick={() => handleDelete(id)}>
              <GoTrashcan />
            </Delete>
            <Close
              onClick={() => {
                setActiveDetail("");
              }}
            >
              <AiOutlineCloseCircle />
            </Close>
          </Util>
          {editMode && <UpdateMemo category={category} id={id} title={title} content={content} setEditMode={setEditMode} />}
          <ViewerStyle>
            <Viewer initialValue={content || ""} theme="dark" />
          </ViewerStyle>
        </Base>
      </Wrapper>
    </Portal>
  );
};

const Wrapper = styled.div<any>`
  transition: all 0.3s;
  user-select: text;
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
  z-index: 998;
  width: 100vw;
  height: 100vh;
  background-color: var(--sub-bgc);
  color: var(--main-text);
  padding: 4rem 0 0;

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
  flex: 1 1 auto;
`;

const Category = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 5px;
  background-color: var(--main-bgc);
  margin: 0 2rem;
`;

const Util = styled.div`
  display: flex;
  min-height: 60px;
  justify-content: flex-end;
  font-size: 20px;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 2rem 2rem 4rem;

  > div:hover {
    color: var(--primary-color);
  }

  border-bottom: 1px solid var(--primary-color);
`;

const UtilItem = styled.div`
  cursor: pointer;
  position: relative;

  @media (min-width: 768px) {
    font-size: 30px;
  }

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

const ViewerStyle = styled.div`
  padding: 1rem;
  background-color: #1f1f1f;
`;

const Copy = styled(UtilItem)`
  &:before {
    content: "복사";
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

const Delete = styled(UtilItem)`
  &:before {
    content: "삭제";
  }
`;

export default TuiViewer;
