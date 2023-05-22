import React, { useState, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { collection, doc, onSnapshot, deleteDoc, orderBy, query, where } from "firebase/firestore";
import { db } from "../../service/firbase";
import { UserContext } from "../../context/UserContext";
import { AddContext } from "../../context/AddContext";
import AddMemo from "./AddMemo";
import TuiViewer from "./TuiViewer";
import { ActiveDetailContext } from "../../context/ActiveDetailContext";
import { toast } from "react-hot-toast";
import { GoTrashcan } from "react-icons/go";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import Previewr from "./Previewr";

import { FilterCategory } from "../../context/FilterCategory";
import { SearchMemo } from "../../context/SearchMemo";

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
    title?: string;
    content?: string;
  };

  const [memo, setMemo] = useState<Memo[]>([]);

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

  const { activeDetail, setActiveDetail } = useContext(ActiveDetailContext);
  const [activeId, setActiveId] = useState();
  const [activeTitle, setActiveTitle] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const handleView = (content: any, id: any, title: any, category: any) => {
    setActiveDetail(content);
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

  // search keyword
  const { searchMemo } = useContext(SearchMemo);

  const [searchFilterMemo, setSearchFilterMemo] = useState([]);

  useEffect(() => {
    const filterMemo = memo.filter((v) => (filterCategory === "전체" ? v : v.category === filterCategory));
    const array: any = filterMemo.filter((v) => (v.title && v.title.indexOf(searchMemo) > -1) || (v.content && v.content.indexOf(searchMemo) > -1));
    setSearchFilterMemo(array);
  }, [searchMemo, filterCategory, memo]);

  return (
    <Base>
      {searchFilterMemo.map((memoItem: MemoItem) => {
        const { title, content, id, createdAt, category } = memoItem;

        const { seconds } = createdAt;

        const date = new Date(seconds * 1000).toLocaleDateString();
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
      {activeDetail && <TuiViewer category={activeCategory} title={activeTitle} id={activeId} className="viewer" content={activeDetail} selector="#portal" />}

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
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 2rem 0;
`;

const ItemWrapper = styled.div`
  max-height: 200px;
  background-color: #121212;
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  flex: 1 1 auto;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s;

  @media (min-width: 768px) {
    &:hover {
    }
  }
`;

const ItemTitle = styled.div`
  font-size: 18px;
  border-bottom: 1px solid #ffffff3c;
  padding: 1rem 0;

  max-width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Create = styled.div`
  font-size: 14px;
  color: gray;
  white-space: nowrap;
`;

const TrashBinWrapper = styled.div<{ showTrashBin: boolean }>`
  position: fixed;
  bottom: 15px;
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  left: 0;

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
  background-color: var(--danger-color);
  padding: 2rem;
  border-radius: 50%;
  svg {
    width: 50px;
    height: 50px;
  }

  ${({ deleteAble }) =>
    deleteAble
      ? css`
          background-color: red;
        `
      : css``}
`;

export default MemoWrapper;
