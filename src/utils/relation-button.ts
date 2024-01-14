import { syntaxTree } from "@codemirror/language";
import type { EditorState } from "@codemirror/state";
import { type Range } from "@codemirror/state";
import type { DecorationSet, EditorView, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";

type TableCell = {
  content: string;
  from: number;
  to: number;
};

type Table = {
  name: string;
  facts: TableCell[][];
};

// because `SyntaxNodeRef` isn't exposed to us for some reason, thanks lezer
type SyntaxNodeRef = Parameters<
  Parameters<ReturnType<typeof syntaxTree>["iterate"]>["0"]["enter"]
>["0"];

type NodeTableProps = {
  relationNode: SyntaxNodeRef;
  table: Table;
};

class RelationWidget extends WidgetType {
  constructor(
    readonly table: Table,
    readonly setTableOpen: React.Dispatch<React.SetStateAction<boolean>>,
    readonly setRelationTable: React.Dispatch<React.SetStateAction<Table>>,
    readonly panelGroupRef: React.RefObject<ImperativePanelGroupHandle>,
  ) {
    super();
  }

  eq(other: RelationWidget) {
    return other.table.name === this.table.name;
  }

  toDOM() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "px-1.5 rounded-full font-bold hover:bg-primary/80 transition-colors text-primary-foreground bg-primary ml-1.5 font-mono text-[0.6rem]";
    btn.innerText = "rel";

    btn.addEventListener("click", () => {
      this.setTableOpen(true);
      this.setRelationTable(this.table);
      this.panelGroupRef.current!.setLayout([30, 70]);
    });

    return btn;
  }
}

function parseInputRelations(state: EditorState) {
  const nodeTableArr: NodeTableProps[] = [];

  syntaxTree(state).iterate({
    enter: (node) => {
      const relationIdNode = node.node.getChild("RelationIdentifier");
      const factSetNode = node.node.getChild("FactSet");

      if (node.name == "FactSetDecl" && relationIdNode && factSetNode) {
        const name = state.doc.sliceString(
          relationIdNode.from,
          relationIdNode.to,
        );
        const facts: TableCell[][] = [];

        factSetNode.getChildren("ListItem").forEach((fact) => {
          const tuple: TableCell[] = [];
          const tupleNode = fact.getChild("ConstTuple");

          if (tupleNode) {
            const constantNode = tupleNode.getChild("Constant");

            if (constantNode) {
              tuple.push({
                content: state.doc.sliceString(
                  constantNode.from,
                  constantNode.to,
                ),
                from: constantNode.from,
                to: constantNode.to,
              });
            } else {
              tupleNode.getChildren("ListItem").forEach((constant) => {
                tuple.push({
                  content: state.doc.sliceString(constant.from, constant.to),
                  from: constant.from,
                  to: constant.to,
                });
              });
            }
          }

          facts.push(tuple);
        });

        nodeTableArr.push({
          relationNode: relationIdNode,
          table: { name, facts },
        });
      }
    },
  });

  return nodeTableArr;
}

function relationButtons(
  view: EditorView,
  setTableOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setRelationTable: React.Dispatch<React.SetStateAction<Table>>,
  panelGroupRef: React.RefObject<ImperativePanelGroupHandle>,
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
  setTableOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setRelationTable: React.Dispatch<React.SetStateAction<Table>>,
  panelGroupRef: React.RefObject<ImperativePanelGroupHandle>,
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
        if (viewUpdate.docChanged) {
          this.decorations = relationButtons(
            viewUpdate.view,
            setTableOpen,
            setRelationTable,
            panelGroupRef,
          );
        }
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
  type NodeTableProps,
  type Table,
};
