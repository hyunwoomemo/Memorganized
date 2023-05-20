import styled from "@emotion/styled";
import React, { useContext, useRef, useEffect } from "react";
import Portal from "../common/Portal";
import { AddContext } from "../../context/AddContext";
import { gsap } from "gsap";
import "@toast-ui/editor/dist/toastui-editor.css";
import TuiEditor from "./TuiEditor";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../service/firbase";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import UpdateTuiEditor from "./UpdateTuiEditor";
import { ActiveDetailContext } from "../../context/ActiveDetailContext";

type Update = {
  selector?: string;
  content: string;
  setEditMode: any;
  id: any;
  title: any;
};

const UpdateMemo = ({ content, setEditMode, id, title }: Update) => {
  const { user } = useContext(UserContext);
  const { setActiveDetail } = useContext(ActiveDetailContext);

  const ref = useRef<any>(null);

  type FormValues = {
    title: string;
  };

  const { register, handleSubmit } = useForm<FormValues>();

  const handleUpdate = handleSubmit(async (data) => {
    try {
      const editorIns = ref?.current?.getInstance();
      // 에디터 작성 내용 markdown으로 저장
      const contentHTML = editorIns.getHTML();

      // contentMark 길이 체크
      if (contentHTML?.length === 0) {
        throw new Error("내용을 입력해주세요.");
      }

      const docRef = doc(db, "memos", id);

      // add firestore
      await updateDoc(docRef, {
        // Pass the DocumentReference to updateDoc
        title: data.title,
        content: contentHTML,
        createdAt: new Date(),
        userId: user.uid,
      });

      toast.success("메모를 수정했습니다.");

      setEditMode(false);
      setActiveDetail(false);
    } catch (e) {
      toast.error(`${e}` || "다시 시도해주세요.");
    }
  });

  return (
    <>
      <div>
        <Toaster />
      </div>
      <Wrapper className="wrapper">
        <Overlay></Overlay>
        <Base onSubmit={handleUpdate}>
          <TitleWrapper>
            <TitleInput {...register("title")} placeholder="제목을 입력해주세요" defaultValue={title}></TitleInput>
          </TitleWrapper>
          <UpdateTuiEditor content={content} editorRef={ref} />
          <Footer>
            <GoBack onClick={() => setEditMode(false)}>닫기</GoBack>
            <SubMit type="submit">수정하기</SubMit>
          </Footer>
        </Base>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div``;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #00000086;
`;

const Base = styled.form`
  width: 90vmin;
  height: 90vmin;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--sub-bgc);
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const TitleInput = styled.input`
  padding: 10px 0;
  border: 0;
  background: none;
  color: var(--main-color);
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
`;

const GoBack = styled.div`
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
`;

const SubMit = styled.button`
  height: 100%;
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2563ec;
  border: 0;
  color: var(--main-text);
  cursor: pointer;
`;

export default UpdateMemo;
