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
  } from "@/components/ui/alert-dialog";
  
  interface ConfirmDialogProps {
    trigger: React.ReactNode;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }
  
  const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    trigger,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
  }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default ConfirmDialog;
  