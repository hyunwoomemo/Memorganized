import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import { Editor } from "@toast-ui/react-editor";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import React, { useEffect, useContext } from "react";
import { IsDark } from "../../context/IsDark";

/* interface Props {
  content: string;
  editorRef: React.MutableRefObject<any>;
} */

const UpdateTuiEditor = ({ content, editorRef } /* : Props */) => {
  console.log(document.querySelector(".toastui-editor-defaultUI"));
  const { isDark, setIsDark } = useContext(IsDark);

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
          theme={isDark ? "dark" : ""} // '' & 'dark'
          usageStatistics={false}
          toolbarItems={toolbarItems}
          useCommandShortcut={true}
          plugins={[colorSyntax]}
        />
      )}
    </>
  );
};

export default UpdateTuiEditor;
