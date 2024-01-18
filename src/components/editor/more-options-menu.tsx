import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Columns2, MoreHorizontal, PanelLeft, PanelRight } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import { toast } from "sonner";

import type { ScallopEditorProps } from "~/components/scallop-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";

const DestructiveAlertDialog = ({
  children,
  editor,
  cmRef,
  projectTitle,
  open,
  onOpenChange,
  setMenuOpen,
}: {
  children: React.ReactNode;
  editor: ScallopEditorProps;
  cmRef: React.RefObject<ReactCodeMirrorRef>;
  projectTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { mutate } = api.project.deleteProjectById.useMutation({
    onSuccess: async ({ title }) => {
      toast.success(
        <p>
          Project <b>{title}</b> successfully deleted!
        </p>,
      );
      await router.push("/dashboard");
    },
    onError: (error) =>
      toast.error(`Failed to delete project! Reason: ${error.message}`),
  });

  const { type, project } = editor;

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === "playground" ? "Reset editor state?" : `Delete project?`}
          </AlertDialogTitle>
          <AlertDialogDescription>{`This action cannot be undone. This will completely ${
            type === "playground"
              ? "clean and reset the editor, just like a browser refresh."
              : `delete your project "${projectTitle}" and associated data.`
          }`}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setMenuOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            onClick={() => {
              setMenuOpen(false);

              if (type === "project" && editor.isAuthor) {
                mutate({
                  id: project.id,
                });
              } else {
                cmRef.current!.view?.dispatch({
                  changes: {
                    from: 0,
                    to: cmRef.current!.view.state.doc.toString().length,
                    insert: "",
                  },
                });
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const MoreOptionsMenu = ({
  editor,
  panelGroupRef,
  cmRef,
  projectTitle,
}: {
  editor: ScallopEditorProps;
  panelGroupRef: React.RefObject<ImperativePanelGroupHandle>;
  cmRef: React.RefObject<ReactCodeMirrorRef>;
  projectTitle: string;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <DropdownMenu
      open={menuOpen}
      onOpenChange={setMenuOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="sr-only">More options</span>
          <MoreHorizontal size={18} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        hidden={alertOpen}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Layout...</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => panelGroupRef.current?.setLayout([25, 75])}
              >
                <PanelLeft
                  className="mr-1.5"
                  size={16}
                />{" "}
                25%—75%
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => panelGroupRef.current?.setLayout([50, 50])}
              >
                <Columns2
                  className="mr-1.5"
                  size={16}
                />{" "}
                50%—50%
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => panelGroupRef.current?.setLayout([75, 25])}
              >
                <PanelRight
                  className="mr-1.5"
                  size={16}
                />{" "}
                75%—25%
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {editor.type === "project" && !editor.isAuthor ? null : (
          <>
            <DropdownMenuSeparator />

            <DestructiveAlertDialog
              editor={editor}
              cmRef={cmRef}
              projectTitle={projectTitle}
              open={alertOpen}
              onOpenChange={setAlertOpen}
              setMenuOpen={setMenuOpen}
            >
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => e.preventDefault()}
              >
                {editor.type === "project" ? <>Delete project</> : <>Reset</>}
              </DropdownMenuItem>
            </DestructiveAlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { MoreOptionsMenu };
