
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";

interface TextDialogProps {
  title: string;
  content: string;
  buttonLabel?: string;
}

const TextDialog = ({ title, content, buttonLabel = "Ver" }: TextDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2 py-1 h-auto text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
          <Eye className="h-3 w-3 mr-1" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="text-sm text-gray-700 whitespace-pre-wrap">
          {content}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default TextDialog;
