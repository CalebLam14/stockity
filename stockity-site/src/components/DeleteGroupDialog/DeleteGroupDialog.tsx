import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import Group from "../../interfaces/Group";

export interface DeleteGroupDialogProps {
  deletingGroup: Group | null;
  open: boolean;
  deletionInProgress: boolean;
  onCancel: () => void;
  onConfirm: (deletingGroup: Group) => void;
}

const DeleteGroupDialog = (props: DeleteGroupDialogProps) => {
  const { open, deletingGroup, deletionInProgress } = props;

  if (deletingGroup == null) {
    return null;
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Delete Group</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {deletingGroup.name}?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onCancel()}>Cancel</Button>
        {!deletionInProgress ? (
          <Button onClick={() => props.onConfirm(deletingGroup)}>Delete</Button>
        ) : (
          <CircularProgress />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteGroupDialog;
