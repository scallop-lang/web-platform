import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import type { DecorationSet, EditorView, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";

class RelationWidget extends WidgetType {
  constructor(readonly json: string) {
    super();
  }

  eq(other: RelationWidget) {
    return other.json == this.json;
  }

  toDOM() {
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");

    const btn = wrap.appendChild(document.createElement("input"));
    btn.type = "button";
    btn.name = "scl-relation-button";
    btn.setAttribute("json", this.json);
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
          const relationName = view.state.doc.sliceString(relationIdNode.from, relationIdNode.to);
          const relationFacts: string[][] = [];

          factSetNode.getChildren("ListItem").forEach((fact) => {
            const tuple: string[] = [];
            const tupleNode = fact.getChild("ConstTuple");
            if (tupleNode) {
              const constantNode = tupleNode.getChild("Constant");
              if (constantNode) {
                tuple.push(view.state.doc.sliceString(constantNode.from, constantNode.to));
              } else {
                tupleNode.getChildren("ListItem").forEach((constant) => {
                  tuple.push(view.state.doc.sliceString(constant.from, constant.to));
                });
              }
            }
            relationFacts.push(tuple);
          });

          const relationObj = { name: relationName, facts: relationFacts };
          const deco = Decoration.widget({
            widget: new RelationWidget(JSON.stringify(relationObj)),
            side: 1,
          });
          widgets.push(deco.range(relationIdNode.to));
        }
      },
    });
  }
  return Decoration.set(widgets);
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
          target.getAttribute("name") == "scl-relation-button"
        )
          console.log(JSON.parse(target.getAttribute("json") ?? ""));
      },
    },
  },
);
