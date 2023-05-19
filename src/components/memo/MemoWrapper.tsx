import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { css } from "@emotion/react";

type MemoItem = {
  title?: string | null;
  content?: string | null;
};

type IconProps = {
  show: string | undefined;
};

const memoItems: MemoItem[] = [
  { title: "title1", content: "sdkflskdflksfd" },
  { title: "title2", content: "sdkflskdflksfd" },
  { title: "title3", content: "sdkflskdflksfd" },
  { title: "title4", content: "sdkflskdflksfd" },
  { title: "title5", content: "sdkflskdflksfd" },
  { title: "title6", content: "sdkflskdflksfd" },
  { title: "title7", content: "sdkflskdflksfd" },
  { title: "title8", content: "sdkflskdflksfd" },
  { title: "title9", content: "sdkflskdflksfd" },
];

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

  const memoString = localStorage.getItem("memo");
  const parsedMemos = memoString ? JSON.parse(memoString) : [];

  const [memos, setMemos] = useState<{ title: string | null; content: string | null }[]>(parsedMemos);

  const handleSave = () => {
    if (contentRef.current?.value) {
      const newMemo: { title: string | null; content: string } = {
        title: titleRef.current?.value ?? "",
        content: contentRef.current?.value ?? "",
      };
      setMemos((prev) => [...prev, newMemo]);

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

  return (
    <Base>
      <ItemWrapper>
        <InputTitle placeholder="제목을 입력하세요" ref={titleRef} onKeyDown={handleTitleKeydown}></InputTitle>
        <InputContent placeholder="내용을 입력하세요" ref={contentRef} onChange={handleContentChange} onKeyDown={handleContentKeydown}></InputContent>
        <ItemCreated></ItemCreated>
        <SaveBtn show={ContentFill ? "true" : "false"} />
      </ItemWrapper>
      {memoItems.map((memoItem, index) => {
        const { title, content } = memoItem;
        return (
          <ItemWrapper>
            <ItemTitle>{title}</ItemTitle>
            <ItemContent>{content}</ItemContent>
            <ItemCreated></ItemCreated>
          </ItemWrapper>
        );
      })}
    </Base>
  );
};

const Base = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, auto));
  gap: 1rem;
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
