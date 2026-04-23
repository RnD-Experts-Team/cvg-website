"use client";

import { useEffect, useCallback, useState } from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $getRoot,
  $insertNodes,
  EditorState,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { HeadingNode, QuoteNode, $createHeadingNode } from "@lexical/rich-text";
import {
  ListItemNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import { LinkNode } from "@lexical/link";
import { $createParagraphNode } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import "@/components/editor/themes/editor-theme.css";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Pilcrow,
} from "lucide-react";

/* ── Editor Config ────────────────────────────────────────────────── */

const editorNodes = [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode];

/* ── HTML Initializer Plugin ──────────────────────────────────────── */

function HtmlInitializerPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || !html) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();

      root.clear();

      if (nodes.length === 0) {
        root.append($createParagraphNode());
        return;
      }

      root.select();
      $insertNodes(nodes);
    });

    setInitialized(true);
  }, [editor, html, initialized]);

  return null;
}

/* ── HTML onChange bridge ─────────────────────────────────────────── */

function HtmlOnChangePlugin({
  onChange,
}: {
  onChange: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const handleChange = useCallback(
    (_editorState: EditorState) => {
      editor.read(() => {
        const html = $generateHtmlFromNodes(editor);
        onChange(html);
      });
    },
    [editor, onChange],
  );

  return (
    <OnChangePlugin ignoreSelectionChange={true} onChange={handleChange} />
  );
}

/* ── Toolbar ──────────────────────────────────────────────────────── */

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));
          setIsStrikethrough(selection.hasFormat("strikethrough"));

          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === "root"
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();
          const type = element.getType();

          if (type === "heading") {
            const tag = (element as any).getTag?.();
            setBlockType(tag || "paragraph");
          } else if (type === "list") {
            const listType = (element as any).getListType?.();
            setBlockType(listType === "number" ? "ol" : "ul");
          } else if (type === "quote") {
            setBlockType("quote");
          } else {
            setBlockType("paragraph");
          }
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  const formatHeading = (tag: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === tag) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === "quote") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          const { $createQuoteNode } = require("@lexical/rich-text");
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const btn =
    "inline-flex items-center justify-center rounded-md p-1.5 sm:p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50";
  const active = "bg-accent text-accent-foreground";
  const divider = "mx-0.5 sm:mx-1 h-6 w-px bg-border";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5 sm:px-3 sm:py-2">
      {/* Undo / Redo */}
      <button
        type="button"
        className={btn}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </button>

      <div className={divider} />

      {/* Block type */}
      <button
        type="button"
        className={`${btn} ${blockType === "paragraph" ? active : ""}`}
        onClick={formatParagraph}
        title="Paragraph"
      >
        <Pilcrow className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${btn} ${blockType === "h1" ? active : ""}`}
        onClick={() => formatHeading("h1")}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${btn} ${blockType === "h2" ? active : ""}`}
        onClick={() => formatHeading("h2")}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${btn} ${blockType === "h3" ? active : ""}`}
        onClick={() => formatHeading("h3")}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className={divider} />

      {/* Inline format */}
      <button
        type="button"
        className={`${btn} ${isBold ? active : ""}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${btn} ${isItalic ? active : ""}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${btn} ${isUnderline ? active : ""}`}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${btn} ${isStrikethrough ? active : ""}`}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>

      <div className={divider} />

      {/* Lists & Quote */}
      <button
        type="button"
        className={`${btn} ${blockType === "bullet" ? active : ""}`}
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${btn} ${blockType === "number" ? active : ""}`}
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${btn} ${blockType === "quote" ? active : ""}`}
        onClick={formatQuote}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── Content Editable ─────────────────────────────────────────────── */

function EditorContentEditable() {
  return (
    <div className="relative min-h-[200px] px-3 py-3 sm:px-4 sm:py-4">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="editor-shell prose prose-sm sm:prose max-w-none focus:outline-none min-h-[180px]"
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </div>
  );
}

/* ── Main RichTextEditor Component ────────────────────────────────── */

interface RichTextEditorProps {
  /** Initial HTML content to populate the editor */
  initialHtml?: string;
  /** Called with the HTML string whenever the editor content changes */
  onChange: (html: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

export default function RichTextEditor({
  initialHtml = "",
  onChange,
}: RichTextEditorProps) {
  const editorConfig: InitialConfigType = {
    namespace: "RichTextEditor",
    theme: editorTheme,
    nodes: editorNodes,
    onError: (error: Error) => {
      console.error("Editor error:", error);
    },
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
      <LexicalComposer initialConfig={editorConfig}>
        <Toolbar />
        <EditorContentEditable />
        <HistoryPlugin />
        <ListPlugin />
        <HtmlInitializerPlugin html={initialHtml} />
        <HtmlOnChangePlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}
