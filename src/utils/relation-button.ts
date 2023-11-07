import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import type { DecorationSet, EditorView, ViewUpdate } from "@codemirror/view";
import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";

class RelationWidget extends WidgetType {
  constructor(readonly relationName: string) {
    super();
  }

  eq(other: RelationWidget) {
    return other.relationName == this.relationName;
  }

  toDOM() {
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "scl-relation-button";
    const btn = wrap.appendChild(document.createElement("input"));
    btn.type = "button";
    btn.name = this.relationName;
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
        if (node.name == "RelationIdentifier") {
          const relationName = view.state.doc.sliceString(node.from, node.to);
          const deco = Decoration.widget({
            widget: new RelationWidget(relationName),
            side: 1,
          });
          widgets.push(deco.range(node.to));
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
      mousedown: (e) => {
        const target = e.target as HTMLElement;
        if (
          target.nodeName == "INPUT" &&
          target.parentElement!.classList.contains("scl-relation-button")
        )
          console.log(target.getAttribute("name"));
      },
    },
  },
);
