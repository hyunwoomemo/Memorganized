import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";

interface Props {
  content: string;
  editorRef: React.MutableRefObject<any>;
  onFocus: any;
}

const TuiEditor = ({ content = "", editorRef, onFocus }: Props) => {
  const toolbarItems = [["heading", "bold", "italic", "strike"], ["hr"], ["ul", "ol"], ["table", "link"], ["image"], ["code"]];

  return (
    <>
      {editorRef && (
        <Editor
          ref={editorRef}
          initialValue={content || " "} // 글 수정 시 사용
          initialEditType="wysiwyg" // wysiwyg & markdown
          previewStyle={window.innerWidth > 1000 ? "vertical" : "tab"} // tab, vertical
          hideModeSwitch={true}
          height="100%"
          theme={"dark"}
          usageStatistics={false}
          toolbarItems={toolbarItems}
          useCommandShortcut={true}
          onFocus={onFocus}
        />
      )}
    </>
  );
};

export default TuiEditor;
