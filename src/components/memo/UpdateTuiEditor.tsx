import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import React, { useEffect } from "react";

interface Props {
  content: string;
  editorRef: React.MutableRefObject<any>;
}

const UpdateTuiEditor = ({ content, editorRef }: Props) => {
  const toolbarItems = [["heading", "bold", "italic", "strike"], ["hr"], ["ul", "ol"], ["table", "link"], ["image"], ["code"]];

  useEffect(() => {
    const htmlString = content;

    editorRef.current?.getInstance().setHTML(htmlString);
  }, []);

  return (
    <>
      {editorRef && (
        <Editor
          ref={editorRef}
          initialValue={content} // 글 수정 시 사용
          initialEditType="wysiwyg" // wysiwyg & markdown
          previewStyle={window.innerWidth > 1000 ? "vertical" : "tab"} // tab, vertical
          hideModeSwitch={true}
          height="100%"
          theme={"dark"} // '' & 'dark'
          usageStatistics={false}
          toolbarItems={toolbarItems}
          useCommandShortcut={true}
        />
      )}
    </>
  );
};

export default UpdateTuiEditor;
