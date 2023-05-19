import React, { ChangeEvent, useState, useRef, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { css } from "@emotion/react";
import { collection, addDoc, setDoc, doc, getDocs, onSnapshot, deleteDoc, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../../service/firbase";
import { UserContext } from "../../context/UserContext";
type MemoItem = {
  title?: string | null;
  content?: string | null;
  id?: string;
  createdAt?: number;
  userId?: string;
};

type IconProps = {
  show: string | undefined;
};

const MemoWrapper = () => {
  const { user } = useContext(UserContext);

  const handleTitleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && contentRef.current) {
      e.preventDefault();
      contentRef.current.focus();
    }
  };

  const handleContentKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (contentRef.current?.value) {
      const newMemo: MemoItem = {
        title: titleRef.current?.value ?? "",
        content: contentRef.current?.value ?? "",
        createdAt: Date.now(),
        userId: user.uid,
      };

      if (titleRef.current) {
        titleRef.current.value = "";
      }
      if (contentRef.current) {
        contentRef.current.value = "";
      }

      setContentFill(false);

      await addDoc(collection(db, "memos"), newMemo);
    }
  };

  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const [ContentFill, setContentFill] = useState<boolean>(false);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value) {
      setContentFill(true);
    } else {
      setContentFill(false);
    }
  };

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

  return (
    <Base>
      <ItemWrapper>
        <InputTitle placeholder="제목을 입력하세요" ref={titleRef} onKeyDown={handleTitleKeydown}></InputTitle>
        <InputContent placeholder="내용을 입력하세요" ref={contentRef} onChange={handleContentChange} onKeyDown={handleContentKeydown}></InputContent>
        <ItemCreated></ItemCreated>
        <SaveBtn show={ContentFill ? "true" : "false"} onClick={handleSave} />
      </ItemWrapper>
      {memo.map((memoItem: MemoItem) => {
        const { title, content, id } = memoItem;
        return (
          <ItemWrapper>
            {title ? <ItemTitle>{title}</ItemTitle> : undefined}
            <ItemContent dangerouslySetInnerHTML={content ? { __html: content?.replaceAll(" ", "&nbsp;").replaceAll("\n", "<br />") } : undefined}></ItemContent>

            <ItemCreated></ItemCreated>
            <button onClick={() => id && handleDelete(id)}>삭제</button>
          </ItemWrapper>
        );
      })}
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

const InputStyle = styled.input`
  background: none;
  border: 0;
  color: #fff;
  outline: none;
`;

const TextareaStyle = styled.textarea`
  background: none;
  border: 0;
  color: #fff;
  outline: none;
  resize: none;
`;

const InputTitle = styled(InputStyle)`
  font-size: 18px;
  border-bottom: 1px solid #ffffff3c;
  padding: 10px 0;
`;

const InputContent = styled(TextareaStyle)`
  flex: 1 1 auto;
`;

const SaveBtn = styled(AiOutlineCheckCircle)<IconProps>`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  transition: all 0.3s;
  cursor: pointer;
  color: var(--primary-color);

  ${({ show }) =>
    show === "true"
      ? css`
          opacity: 1;
          pointer-events: all;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;

export default MemoWrapper;
