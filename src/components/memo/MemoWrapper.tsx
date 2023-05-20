import React, { ChangeEvent, useState, useRef, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { css } from "@emotion/react";
import { collection, addDoc, setDoc, doc, getDocs, onSnapshot, deleteDoc, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../../service/firbase";
import { UserContext } from "../../context/UserContext";
import { AddContext } from "../../context/AddContext";
import AddMemo from "./AddMemo";
import TuiViewer from "./TuiViewer";
import { ActiveDetailContext } from "../../context/ActiveDetailContext";
import { toast } from "react-hot-toast";

type MemoItem = {
  title?: string | null;
  content?: any;
  id?: any;
  createdAt?: number;
  userId?: string;
};

const MemoWrapper = () => {
  const { user } = useContext(UserContext);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "memos", id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  type Memo = {};

  const [memo, setMemo] = useState<Memo[]>([]);

  useEffect(() => {
    const q = query(collection(db, "memos"), orderBy("createdAt", "desc"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memosArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(memosArray);
      setMemo(memosArray);
    });

    return () => unsubscribe();
  }, []);

  const { setAddModal } = useContext(AddContext);

  const { activeDetail, setActiveDetail } = useContext(ActiveDetailContext);
  const [activeId, setActiveId] = useState();
  const [activeTitle, setActiveTitle] = useState("");
  const [animation, setAnimation] = useState(false);

  const handleView = (content: any, id: any, title: any) => {
    setActiveDetail(content);
    setTimeout(() => {
      setAnimation(true);
    }, 100);
    setActiveId(id);
    setActiveTitle(title);
  };

  console.log(animation);

  return (
    <Base>
      {memo.map((memoItem: MemoItem) => {
        const { title, content, id } = memoItem;
        return (
          <ItemWrapper onClick={() => handleView(content, id, title)}>
            {title ? <ItemTitle>{title}</ItemTitle> : undefined}
            <ItemContent dangerouslySetInnerHTML={content ? { __html: content?.replaceAll(" ", "&nbsp;").replaceAll("\n", "<br />") } : undefined}></ItemContent>
            <ItemCreated></ItemCreated>
            <button
              onClick={(e) => {
                e.stopPropagation();
                id && handleDelete(id);
                toast("삭제되었습니다!", {
                  icon: "🔴",
                });
              }}
            >
              삭제
            </button>
          </ItemWrapper>
        );
      })}
      {activeDetail && <TuiViewer title={activeTitle} id={activeId} show={animation} className="viewer" content={activeDetail} selector="#portal" setAni={setAnimation} />}
      <AddBtn onClick={() => setAddModal(true)}>추가</AddBtn>
      <AddMemo />
    </Base>
  );
};

const Base = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 2rem 0;
`;

const ItemWrapper = styled.div`
  min-height: 200px;
  background-color: #121212;
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  user-select: none;
`;

const ItemTitle = styled.div`
  font-size: 18px;
  border-bottom: 1px solid #ffffff3c;
  padding: 10px 0;
`;

const ItemContent = styled.div`
  line-height: 30px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;

const ItemCreated = styled.div``;

const AddBtn = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 99;
`;

export default MemoWrapper;
