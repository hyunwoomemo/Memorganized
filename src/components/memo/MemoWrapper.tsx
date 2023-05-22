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
import { GoTrashcan } from "react-icons/go";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import Previewr from "./Previewr";
import { IoIosAddCircle } from "react-icons/io";
import { FilterCategory } from "../../context/FilterCategory";

type MemoItem = {
  title?: string | null;
  content?: any;
  id?: any;
  createdAt?: any;
  userId?: string;
  category?: string;
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

  type Memo = {
    category?: string;
    id: string;
  };

  const [memo, setMemo] = useState<Memo[]>([]);
  console.log(memo);

  useEffect(() => {
    const q = query(collection(db, "memos"), orderBy("createdAt", "desc"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memosArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemo(memosArray);
    });

    return () => unsubscribe();
  }, []);

  const { setAddModal } = useContext(AddContext);

  const { activeDetail, setActiveDetail } = useContext(ActiveDetailContext);
  const [activeId, setActiveId] = useState();
  const [activeTitle, setActiveTitle] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [animation, setAnimation] = useState(false);

  const handleView = (content: any, id: any, title: any, category: any) => {
    setActiveDetail(content);
    setTimeout(() => {
      setAnimation(true);
    }, 100);
    setActiveId(id);
    setActiveTitle(title);
    setActiveCategory(category);
  };

  // 드래그 앤 드랍 삭제 기능 구현

  const [draggedMemo, setDraggedMemo] = useState<string | null>(null);
  const [showTrashBin, setShowTrashBin] = useState<boolean>(false);
  const [deleteAble, setDeleteAble] = useState<boolean>(false);

  const handleDragStart = (id: string) => {
    setDraggedMemo(id);
    setShowTrashBin(true);
  };

  const handleDragEnd = () => {
    setShowTrashBin(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDeleteAble(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("삭제!");
    draggedMemo && handleDelete(draggedMemo);
    setDeleteAble(false);
    toast("삭제되었습니다!", {
      icon: "🗑️",
    });
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDeleteAble(false);
  };

  // filter category

  const { filterCategory } = useContext(FilterCategory);

  console.log(filterCategory);

  const filterMemo = memo.filter((v) => (filterCategory === "전체" ? v : v.category === filterCategory));
  console.log(filterMemo);

  return (
    <Base>
      {filterMemo.map((memoItem: MemoItem) => {
        const { title, content, id, createdAt, category } = memoItem;

        const { seconds } = createdAt;

        const date = new Date(seconds * 1000).toLocaleDateString();
        console.log(date);
        return (
          <ItemWrapper key={id} onClick={() => handleView(content, id, title, category)} draggable={true} onDragStart={() => handleDragStart(id)} onDragEnd={() => handleDragEnd()}>
            {title && <ItemTitle>{title}</ItemTitle>}
            {content && <Previewr content={content} />}
            <Footer>
              {category && <CategoryItem>{category}</CategoryItem>}
              <Create>{date}</Create>
            </Footer>
          </ItemWrapper>
        );
      })}
      {activeDetail && <TuiViewer category={activeCategory} title={activeTitle} id={activeId} show={animation} className="viewer" content={activeDetail} selector="#portal" setAni={setAnimation} />}
      <AddBtn onClick={() => setAddModal(true)}>
        <IoIosAddCircle />
      </AddBtn>
      <AddMemo />
      <TrashBinWrapper showTrashBin={showTrashBin}>
        {showTrashBin && (
          <TrashBinItem
            deleteAble={deleteAble}
            onDragLeave={handleDragLeave}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
          >
            <GoTrashcan />
          </TrashBinItem>
        )}
      </TrashBinWrapper>
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
  height: 200px;
  background-color: #121212;
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  user-select: none;
  cursor: pointer;
  &:hover:before {
    width: 100%;
  }
  &:before {
    content: "";
    position: absolute;
    top: 1px;
    left: 0;
    width: 5%;
    height: 3px;
    background-color: var(--primary-color);
    transition: all 0.3s;
  }
`;

const ItemTitle = styled.div`
  font-size: 18px;
  border-bottom: 1px solid #ffffff3c;
  padding: 10px 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
`;

const CategoryItem = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 5px;
  background-color: var(--main-bgc);
  align-self: flex-start;
`;

const Create = styled.div`
  font-size: 14px;
  color: gray;
`;

const AddBtn = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  cursor: pointer;
  font-size: 60px;
  color: #3e3e3e;

  &:hover {
    color: var(--primary-color);
  }
`;

const TrashBinWrapper = styled.div<{ showTrashBin: boolean }>`
  position: absolute;
  bottom: 15px;
  width: 100%;
  height: 20%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(-50%);
  transition: all 0.3s;

  ${({ showTrashBin }) =>
    showTrashBin
      ? css`
          pointer-events: all;
          opacity: 1;
        `
      : css`
          pointer-events: none;
          opacity: 0;
        `}
`;

const TrashBinItem = styled.div<any>`
  background-color: var(--sub-bgc);
  padding: 2rem;
  border-radius: 50%;
  svg {
    width: 50px;
    height: 50px;
  }

  ${({ deleteAble }) =>
    deleteAble
      ? css`
          color: var(--danger-color);
        `
      : css``}
`;

export default MemoWrapper;
