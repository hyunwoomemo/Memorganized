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
import { gsap } from "gsap";

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
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleClick = (id: string) => {
    toast(
      (t) => (
        <DeleteToast>
          <span>정말 삭제하시겠습니까?</span>
          <button
            onClick={() => {
              handleDelete(id);
              toast.dismiss(t.id);
            }}
          >
            확인
          </button>
          <button onClick={() => toast.dismiss(t.id)}>취소</button>
        </DeleteToast>
      ),
      {
        icon: "🗑️",
        style: {
          background: "var(--danger-color)",
          color: "#fff",
        },
      }
    );
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    toast("복사되었습니다.", {
      icon: "📋",
    });
    setCopied(true);
  };

  const parser = new DOMParser();
  const modifyContent = content
    .replaceAll("</p>", "</p><br/>")
    .replaceAll("</h1>", "</h1><br/>")
    .replaceAll("</h2>", "</h2><br/>")
    .replaceAll("</h3>", "</h3><br/>")
    .replaceAll("</h4>", "</h4><br/>")
    .replaceAll("</h5>", "</h5><br/>")
    .replaceAll("</h6>", "</h6><br/>");
  const parsedHTML = parser.parseFromString(modifyContent, "text/html");

  const plainText = parsedHTML.body.innerHTML.replace(/<br>/g, "\n").replace(/<\/?[^>]+(>|$)/g, "");

  // gsap 애니메이션

  /*   useEffect(() => {
    if (content && baseRef.current) {
      let tl = gsap.timeline(); //순서대로 gsap 사용하기
      tl.from(baseRef.current, {
        right: "50px",
        opacity: 0,
      });
      tl.to(baseRef.current, {
        right: "25px",
        opacity: 0.5,
      });
      tl.to(baseRef.current, {
        right: "0",
        opacity: 0.7,
      });
    }
  }, [content]); */

  return (
    <Portal selector={selector}>
      <Wrapper>
        <Overlay onClick={() => setActiveDetail(false)} content={content}></Overlay>
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
            <Delete onClick={() => handleClick(id)}>
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
  user-select: text;
`;

const Overlay = styled.div<{ content: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: var(--overlay-bgc);
  opacity: 0.5;
  z-index: 9;
  cursor: pointer;
  ${({ content }) =>
    content
      ? css`
          pointer-events: all;
          display: block;
        `
      : css`
          pointer-events: none;
          display: none;
        `}
`;

const Base = styled.div<{ editMode: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  z-index: 998;
  max-width: 50vw;
  width: 100%;
  height: 100vh;
  background-color: var(--memo-viewer-bgc);
  color: var(--main-text);
  padding: 4rem 0 0;
  box-shadow: 0 0 5px 1px var(--text-color);
  transition: opacity 0.3s;

  @media (max-width: 768px) {
    max-width: 100vw;
  }

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
  max-width: 60vw;
  margin-right: auto;
  word-wrap: break-word;
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
  background-color: var(--memo-viewer-bgc);
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

const DeleteToast = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  > button {
    border: 0;
    background: #fff;
    color: #000;
    padding: 3px 6px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background: #ececec;
    }
  }
`;

export default TuiViewer;
