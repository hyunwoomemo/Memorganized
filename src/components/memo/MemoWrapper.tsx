import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { css } from "@emotion/react";

type MemoItem = {
  title?: string | null;
  content?: string | null;
  id?: Number | null;
};

type IconProps = {
  show: string | undefined;
};

const MemoWrapper = () => {
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

  let memoString = localStorage.getItem("memo");
  let parsedMemos = memoString ? JSON.parse(memoString) : [];

  const [memos, setMemos] = useState<{ title: string | null; content: string | null; id: Number | null }[]>(parsedMemos);

  const handleSave = () => {
    if (contentRef.current?.value) {
      const newMemo: { title: string | null; content: string; id: Number | null } = {
        title: titleRef.current?.value ?? "",
        content: contentRef.current?.value ?? "",
        id: Date.now(),
      };
      setMemos((prev) => [newMemo, ...prev]);

      if (titleRef.current) {
        titleRef.current.value = "";
      }
      if (contentRef.current) {
        contentRef.current.value = "";
      }
    }
  };

  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.localStorage.setItem("memo", JSON.stringify(memos));
  }, [memos]);

  const [ContentFill, setContentFill] = useState<boolean>(false);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value) {
      setContentFill(true);
    } else {
      setContentFill(false);
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.parentElement?.id;
    const filterArr = memos.filter((v) => v.id !== Number(id));
    setMemos(filterArr);
    parsedMemos = window.localStorage.getItem("memo");
  };

  return (
    <Base>
      <ItemWrapper>
        <InputTitle placeholder="제목을 입력하세요" ref={titleRef} onKeyDown={handleTitleKeydown}></InputTitle>
        <InputContent placeholder="내용을 입력하세요" ref={contentRef} onChange={handleContentChange} onKeyDown={handleContentKeydown}></InputContent>
        <ItemCreated></ItemCreated>
        <SaveBtn show={ContentFill ? "true" : "false"} />
      </ItemWrapper>
      {memos.map((memoItem: MemoItem, index: number) => {
        const { title, content, id } = memoItem;
        return (
          <ItemWrapper id={String(id)}>
            <ItemTitle>{title}</ItemTitle>
            <ItemContent>{content}</ItemContent>
            <ItemCreated></ItemCreated>
            <button onClick={handleDelete}>삭제</button>
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

const ItemContent = styled.div``;

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
