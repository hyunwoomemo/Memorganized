import styled from "@emotion/styled";
import React, { useContext, useRef, useEffect } from "react";
import Portal from "../common/Portal";
import { AddContext } from "../../context/AddContext";
import { gsap } from "gsap";
import "@toast-ui/editor/dist/toastui-editor.css";
import TuiEditor from "./TuiEditor";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../service/firbase";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../../context/UserContext";

const AddMemo = ({ selector = "#portal" }) => {
  const { addModal, setAddModal } = useContext(AddContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (addModal) {
      gsap.fromTo(".wrapper", { opacity: 0 }, { opacity: 1, duration: 0.5, pointerEvents: "all" });
    } else {
      // 애니메이션 종료
      gsap.fromTo(".wrapper", { opacity: 1 }, { opacity: 0, duration: 0.5, pointerEvents: "none" });
    }

    return () => {};
  }, [addModal]);

  const ref = useRef<any>(null);

  type FormValues = {
    title: string;
  };

  const resetEditorValue = () => {
    if (ref.current) {
      const editorInstance = ref.current.getInstance();
      editorInstance.setHTML("");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const handleClose = () => {
    setAddModal(false);
    reset({ title: "" });
    resetEditorValue();
  };

  const handleSave = handleSubmit(async (data) => {
    try {
      const editorIns = ref?.current?.getInstance();
      // 에디터 작성 내용 markdown으로 저장
      const contentHTML = editorIns.getHTML();

      // contentMark 길이 체크
      if (contentHTML.replaceAll("p", "").replaceAll("br", "").replaceAll("<", "").replaceAll(">", "").replaceAll("/", "")?.length === 0) {
        toast.error("글을 작성해주세요");
        return;
      }

      // add firestore
      await addDoc(collection(db, "memos"), {
        title: data.title,
        content: contentHTML,
        createdAt: new Date(),
        userId: user.uid,
      });

      toast.success("메모를 추가했습니다.");
      handleClose();
    } catch (e) {
      console.log(e);
      toast.error(`${e}` || "다시 시도해주세요.");
    }
  });

  return (
    <Portal selector={selector}>
      <div>
        <Toaster />
      </div>
      <Wrapper className="wrapper">
        <Overlay></Overlay>
        <Base onSubmit={handleSave}>
          <TitleWrapper>
            <TitleInput {...register("title")} placeholder="제목을 입력해주세요"></TitleInput>
          </TitleWrapper>
          <TuiEditor content="" editorRef={ref} />
          <Footer>
            <GoBack onClick={handleClose}>닫기</GoBack>
            <SubMit type="submit">작성하기</SubMit>
          </Footer>
        </Base>
      </Wrapper>
    </Portal>
  );
};

const Wrapper = styled.div`
  opacity: 0;
  pointer-events: none;
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
  outline: none;
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

export default AddMemo;
