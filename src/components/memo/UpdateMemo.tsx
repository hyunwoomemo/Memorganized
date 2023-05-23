import styled from "@emotion/styled";
import React, { useContext, useRef, useEffect, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../service/firbase";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import UpdateTuiEditor from "./UpdateTuiEditor";
import { ActiveDetailContext } from "../../context/ActiveDetailContext";
import CategoryModal from "./CategoryModal";

type Update = {
  selector?: string;
  content: string;
  setEditMode: any;
  id: any;
  title: any;
  category: any;
};

const UpdateMemo = ({ content, setEditMode, id, title, category }: Update) => {
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
        userId: user.uid,
        category: categoryInputRef.current.value,
      });

      toast.success("메모를 수정했습니다.");

      setEditMode(false);
      setActiveDetail(false);
    } catch (e) {
      toast.error(`${e}` || "다시 시도해주세요.");
    }
  });

  // 카테고리 모달 보여주기
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // 카테고리 인풋
  const categoryInputRef = useRef<any>(null);

  // 카테고리 onChange 로 모달 필터
  const [categorySearch, setCategorySearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategorySearch(e.target.value);
  };

  return (
    <>
      <Wrapper className="wrapper">
        <Base onSubmit={handleUpdate}>
          <TitleWrapper>
            <TitleInput {...register("title")} placeholder="제목을 입력해주세요 (선택)" defaultValue={title}></TitleInput>
          </TitleWrapper>
          <CategoryWrapper>
            <CategoryInput
              defaultValue={category}
              onChange={(e) => handleChange(e)}
              onFocus={() => setShowCategoryModal(true)}
              autoComplete="off"
              ref={categoryInputRef}
              placeholder="카테고리 (선택)"
            ></CategoryInput>
            {showCategoryModal && (
              <CategoryModal setCategorySearch={setCategorySearch} categorySearch={categorySearch} categoryInputRef={categoryInputRef} setShowCategoryModal={setShowCategoryModal} />
            )}
          </CategoryWrapper>
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

const Wrapper = styled.div`
  z-index: 999;
`;

const Base = styled.form`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--sub-bgc);
  display: flex;
  flex-direction: column;
  z-index: 9;
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

const CategoryWrapper = styled.div`
  padding: 1rem;
  position: relative;
`;

const CategoryInput = styled.input`
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
  background-color: var(--submit-btn-bgc);
  border: 0;
  color: var(--main-text);
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
`;

export default UpdateMemo;
