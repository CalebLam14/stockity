import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import Item from "../../interfaces/Item";

export interface DeleteItemDialogProps {
  deletingItem: Item;
  open: boolean;
  deletionInProgress: boolean;
  onCancel: () => void;
  onConfirm: (deletingItem: Item) => void;
}

const DeleteItemDialog = (props: DeleteItemDialogProps) => {
  const { open, deletingItem, deletionInProgress } = props;

  if (deletingItem == null) {
    return null;
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Delete Item</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {deletingItem.name}?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onCancel()}>Cancel</Button>
        {!deletionInProgress ? (
          <Button onClick={() => props.onConfirm(deletingItem)}>Delete</Button>
        ) : (
          <CircularProgress />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteItemDialog;
