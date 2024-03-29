import { syntaxTree } from "@codemirror/language";
import type { EditorState } from "@codemirror/state";
import { type Range } from "@codemirror/state";
import type { DecorationSet, EditorView, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";
import type { SyntaxNodeRef } from "@lezer/common";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";

import type { CurrentRelationProps } from "~/components/scallop-editor";
import type { Fact } from "~/utils/schemas-types";

type Table = {
  name: string;
  from: number;
  to: number;
  facts: Fact[];
};

type ParsedInputProps = {
  relationNode: SyntaxNodeRef;
  table: Table;
};

class RelationWidget extends WidgetType {
  constructor(
    readonly table: Table,
    readonly setTableOpen: Dispatch<SetStateAction<boolean>>,
    readonly setRelationTable: Dispatch<SetStateAction<CurrentRelationProps>>,
    readonly panelGroupRef: React.RefObject<ImperativePanelGroupHandle>,
  ) {
    super();
  }

  eq(other: RelationWidget) {
    return JSON.stringify(other.table) === JSON.stringify(this.table);
  }

  toDOM() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "px-1.5 rounded-full font-bold hover:bg-primary/80 transition-colors text-primary-foreground bg-primary ml-1.5 font-mono text-[0.6rem]";
    btn.innerText = "rel";

    btn.addEventListener("click", () => {
      this.setTableOpen(true);
      this.setRelationTable({ type: "inputs", table: this.table });
      this.panelGroupRef.current!.setLayout([30, 70]);
    });

    return btn;
  }
}

function parseInputRelations(state: EditorState) {
  const nodeTableArr: ParsedInputProps[] = [];

  syntaxTree(state).iterate({
    enter: (node) => {
      const relationIdNode = node.node.getChild("RelationIdentifier");
      const factSetNode = node.node.getChild("FactSet");

      if (node.name == "FactSetDecl" && relationIdNode && factSetNode) {
        const name = state.doc.sliceString(
          relationIdNode.from,
          relationIdNode.to,
        );
        const facts: Fact[] = [];

        factSetNode.getChildren("ListItem").forEach((fact) => {
          const tuple: string[] = [];
          const tagged = fact.getChild("Tagged");
          let tupleNode = fact.getChild("ConstTuple");
          let tag = "";

          if (tagged) {
            const tagNode = tagged.getChild("Tag");
            if (tagNode) {
              tag = state.doc.sliceString(tagNode.from, tagNode.to);
            }
            tupleNode = tagged.getChild("ConstTuple");
          }

          if (tupleNode) {
            const constantNode = tupleNode.getChild("Constant");

            if (constantNode) {
              tuple.push(
                state.doc.sliceString(constantNode.from, constantNode.to),
              );
            } else {
              tupleNode.getChildren("ListItem").forEach((constant) => {
                tuple.push(state.doc.sliceString(constant.from, constant.to));
              });
            }
          }

          facts.push({ tag, tuple });
        });

        nodeTableArr.push({
          relationNode: relationIdNode,
          table: { name, from: factSetNode.from, to: factSetNode.to, facts },
        });
      }
    },
  });

  return nodeTableArr;
}

function relationButtons(
  view: EditorView,
  setTableOpen: Dispatch<SetStateAction<boolean>>,
  setRelationTable: Dispatch<SetStateAction<CurrentRelationProps>>,
  panelGroupRef: RefObject<ImperativePanelGroupHandle>,
) {
  const widgets: Range<Decoration>[] = [];
  const nodeTableArr = parseInputRelations(view.state);

  nodeTableArr.forEach(({ relationNode, table }) => {
    const deco = Decoration.widget({
      widget: new RelationWidget(
        table,
        setTableOpen,
        setRelationTable,
        panelGroupRef,
      ),
      side: 1,
    });

    widgets.push(deco.range(relationNode.to));
  });

  return Decoration.set(widgets);
}

function relationButtonPluginFactory(
  setTableOpen: Dispatch<SetStateAction<boolean>>,
  setRelationTable: Dispatch<SetStateAction<CurrentRelationProps>>,
  panelGroupRef: RefObject<ImperativePanelGroupHandle>,
) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = relationButtons(
          view,
          setTableOpen,
          setRelationTable,
          panelGroupRef,
        );
      }

      update(viewUpdate: ViewUpdate) {
        this.decorations = relationButtons(
          viewUpdate.view,
          setTableOpen,
          setRelationTable,
          panelGroupRef,
        );
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );
}

export {
  parseInputRelations,
  relationButtonPluginFactory,
  type ParsedInputProps,
  type Table,
};
