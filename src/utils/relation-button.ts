import { syntaxTree } from "@codemirror/language";
import type { EditorState } from "@codemirror/state";
import { type Range } from "@codemirror/state";
import type { DecorationSet, EditorView, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";

type TableCell = {
  content: string;
  from: number;
  to: number;
};

export type Table = {
  name: string;
  facts: TableCell[][];
};

// because `SyntaxNodeRef` isn't exposed to us for some reason, thanks lezer
type SyntaxNodeRef = Parameters<
  Parameters<ReturnType<typeof syntaxTree>["iterate"]>["0"]["enter"]
>["0"];

export type RelationTableProps = {
  relationNode: SyntaxNodeRef;
  table: Table;
};

class RelationWidget extends WidgetType {
  constructor(readonly table: string) {
    super();
  }

  eq(other: RelationWidget) {
    return other.table == this.table;
  }

  toDOM() {
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");

    const btn = wrap.appendChild(document.createElement("input"));
    btn.type = "button";
    btn.name = "scl-relation-button";
    btn.setAttribute("table", this.table);
    btn.setAttribute(
      "style",
      "vertical-align: middle; font-size: 8px; font-weight: bold; margin-left: 4px; border: 1px solid black; border-radius: 20px; cursor: pointer;",
    );
    btn.value = " ↪ ";

    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

export function parseRelationTables(state: EditorState) {
  const nodeTableArr: RelationTableProps[] = [];

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

function relationButtons(view: EditorView) {
  const widgets: Range<Decoration>[] = [];
  const nodeTableArr = parseRelationTables(view.state);

  nodeTableArr.forEach(({ relationNode, table }) => {
    const deco = Decoration.widget({
      widget: new RelationWidget(JSON.stringify(table)),
      side: 1,
    });

    widgets.push(deco.range(relationNode.to));
  });

  return Decoration.set(widgets);
}

export const relationButtonPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = relationButtons(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = relationButtons(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,

    eventHandlers: {
      mousedown: (e, view) => {
        const target = e.target as HTMLElement;
        if (
          target.nodeName == "INPUT" &&
          target.getAttribute("name") == "scl-relation-button"
        ) {
          const obj = JSON.parse(target.getAttribute("table") ?? "") as Table;
          view.dispatch({
            changes: [
              {
                from: obj.facts[0]?.[0]?.from ?? -1,
                to: obj.facts[0]?.[0]?.to ?? -1,
                insert: '"Neelay"',
              },
              {
                from: obj.facts[1]?.[0]?.from ?? -1,
                to: obj.facts[1]?.[0]?.to ?? -1,
                insert: '"Velingker"',
              },
            ],
          });
        }
      },
    },
  },
);
