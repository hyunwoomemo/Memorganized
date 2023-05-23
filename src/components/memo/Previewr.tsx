import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import styled from "@emotion/styled";

interface Props {
  content: string;
}

const Previewr = ({ content = "" }: Props) => {
  return (
    <Wrapper>
      <Base>{content && <Viewer key={content} initialValue={content} theme="dark" />}</Base>
    </Wrapper>
  );
};

const Wrapper = styled.div<any>`
  max-width: 60vw;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;

const Base = styled.div``;

export default Previewr;
