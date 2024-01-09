import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import type { DecorationSet, EditorView, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";

class RelationWidget extends WidgetType {
  constructor(readonly relationStart: number) {
    super();
  }

  eq(other: RelationWidget) {
    return other.relationStart == this.relationStart;
  }

  toDOM() {
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "scl-relation-button";
    const btn = wrap.appendChild(document.createElement("input"));
    btn.type = "button";
    btn.id = this.relationStart.toString();
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

function relationButtons(view: EditorView) {
  const widgets: Range<Decoration>[] = [];
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        const relationIdNode = node.node.getChild("RelationIdentifier");
        const factSetNode = node.node.getChild("FactSet");
        if (node.name == "FactSetDecl" && relationIdNode && factSetNode) {
          const deco = Decoration.widget({
            widget: new RelationWidget(relationIdNode.from),
            side: 1,
          });
          widgets.push(deco.range(relationIdNode.to));
        }
      },
    });
  }
  return Decoration.set(widgets);
}

function getTable(view: EditorView, relationStart: number) {
  let relationName;
  const relationFacts: string[][] = [];

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        const relationIdNode = node.node.getChild("RelationIdentifier");
        const factSetNode = node.node.getChild("FactSet");
        if (node.name == "FactSetDecl" && relationIdNode && factSetNode) {
          if (relationIdNode.from == relationStart) {
            relationName = view.state.doc.sliceString(relationIdNode.from, relationIdNode.to);
            factSetNode.getChildren("ListItem").forEach((fact) => {
              const tuple: string[] = [];
              const tupleNode = fact.getChild("ConstTuple");
              if (tupleNode) {
                tupleNode.getChildren("ListItem").forEach((constant) => {
                  tuple.push(view.state.doc.sliceString(constant.from, constant.to));
                });
              }
              relationFacts.push(tuple);
            });
          }
        }
      },
    });
  }

  console.log(relationName);
  console.log(relationFacts);
}

export const relationButtonPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = relationButtons(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged)
        this.decorations = relationButtons(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,

    eventHandlers: {
      mousedown: (e, view) => {
        const target = e.target as HTMLElement;
        if (
          target.nodeName == "INPUT" &&
          target.parentElement!.classList.contains("scl-relation-button")
        )
          getTable(view, parseInt(target.id ?? ""));
      },
    },
  },
);
