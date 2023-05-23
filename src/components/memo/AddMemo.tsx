import styled from "@emotion/styled";
import { useContext, useRef, useState } from "react";
import Portal from "../common/Portal";
import { AddContext } from "../../context/AddContext";
import "@toast-ui/editor/dist/toastui-editor.css";
import TuiEditor from "./TuiEditor";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../service/firbase";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import CategoryModal from "./CategoryModal";
import { css } from "@emotion/react";
import { FilterCategory } from "../../context/FilterCategory";

const AddMemo = ({ selector = "#portal" }) => {
  const { addModal, setAddModal } = useContext(AddContext);
  const { setFilterCategory } = useContext(FilterCategory);
  const { user } = useContext(UserContext);

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

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const handleClose = () => {
    setAddModal(false);
    reset({ title: "" });
    resetEditorValue();
    categoryInputRef.current.value = "";
    setCategorySearch("");
    setShowCategoryModal(false);
  };

  // 데이터 저장

  const handleSave = handleSubmit(async (data) => {
    try {
      const editorIns = ref?.current?.getInstance();
      // 에디터 작성 내용 markdown으로 저장
      const contentHTML = editorIns.getHTML();

      const contentLength = contentHTML.replaceAll("p", "").replaceAll("br", "").replaceAll("<", "").replaceAll(">", "").replaceAll("/", "")?.length === 0;

      // contentMark 길이 체크
      if (contentLength) {
        toast.error("글을 작성해주세요");
        return;
      }

      // add firestore
      await addDoc(collection(db, "memos"), {
        title: data.title,
        category: categoryInputRef.current.value,
        content: contentHTML,
        createdAt: new Date(),
        userId: user.uid,
      });

      toast.success("메모를 추가했습니다.");
      handleClose();
      categoryInputRef.current.value = "";
      setCategorySearch("");
      setShowCategoryModal(false);
      setFilterCategory("전체");
    } catch (e) {
      toast.error(`${e}` || "다시 시도해주세요.");
    }
  });

  /* 카테고리 추가 및 적용
    - 인풋창 focus 되면 firebase에서 category들 불러오기
    - 카테고리 선택하면 input value로 입력
    - (수동) 대분류 중분류 인풋에 값을 적어서 firebase에 넘겨주기 + input value 입력
  */

  // 카테고리 모달 관리

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
    <Portal selector={selector}>
      <Wrapper show={addModal}>
        <Base onSubmit={handleSave}>
          <TitleWrapper>
            <TitleInput onFocus={() => setShowCategoryModal(false)} {...register("title")} placeholder="제목을 입력해주세요 (선택)"></TitleInput>
          </TitleWrapper>
          <CategoryWrapper>
            <CategoryInput onChange={(e) => handleChange(e)} onFocus={() => setShowCategoryModal(true)} autoComplete="off" ref={categoryInputRef} placeholder="카테고리 (선택)"></CategoryInput>
            {showCategoryModal && (
              <CategoryModal setCategorySearch={setCategorySearch} categorySearch={categorySearch} categoryInputRef={categoryInputRef} setShowCategoryModal={setShowCategoryModal} />
            )}
          </CategoryWrapper>
          <TuiEditor content="" editorRef={ref} onFocus={() => setShowCategoryModal(false)} />
          <Footer>
            <GoBack onClick={handleClose}>닫기</GoBack>
            <SubMit type="submit">작성하기</SubMit>
          </Footer>
        </Base>
      </Wrapper>
    </Portal>
  );
};

const Wrapper = styled.div<{ show: boolean }>`
  ${({ show }) =>
    show
      ? css`
          display: block;
        `
      : css`
          display: none;
        `}
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
  border-radius: 5px;
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
  position: relative;
  border-radius: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
`;

export default AddMemo;
