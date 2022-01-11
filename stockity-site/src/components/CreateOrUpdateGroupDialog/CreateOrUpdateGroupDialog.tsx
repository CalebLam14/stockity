import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import Group from "../../interfaces/Group";

export interface CreateOrUpdateGroupDialogProps {
  editingGroup: Group | null;
  open: boolean;
  creationInProgress: boolean;
  onCancel: () => void;
  onSubmit: (editingId: number | null, groupName: string) => void;
}

const CreateOrUpdateGroupDialog = (props: CreateOrUpdateGroupDialogProps) => {
  const { open, editingGroup } = props;

  const [newGroupName, setNewGroupName] = useState<string>(
    editingGroup != null ? editingGroup.name : ""
  );

  useEffect(() => {
    setNewGroupName(editingGroup != null ? editingGroup.name : "");
  }, [editingGroup]);

  const [dirty, setDirty] = useState(false);

  const hasError = newGroupName.length === 0;
  const validForm = !hasError;

  const handleChange =
    (blurred: boolean) =>
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newGroupName = e.target.value;
      setNewGroupName(blurred ? newGroupName.trim() : newGroupName);
      setDirty(true);
    };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Create New Group</DialogTitle>
      <DialogContent>
        <form>
          <Box marginTop={1}>
            <TextField
              label="Group Name"
              variant="outlined"
              value={newGroupName}
              required
              fullWidth
              error={hasError && dirty}
              helperText={
                hasError && dirty ? "Please provide a group name!" : null
              }
              onChange={handleChange(false)}
              onBlur={handleChange(true)}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onCancel()}>Cancel</Button>
        {!props.creationInProgress ? (
          <Button
            onClick={() =>
              props.onSubmit(
                props.editingGroup != null ? props.editingGroup.id : null,
                newGroupName
              )
            }
            disabled={
              !validForm ||
              (props.editingGroup != null &&
                props.editingGroup.name == newGroupName)
            }
          >
            {props.editingGroup == null ? "Create" : "Update"}
          </Button>
        ) : (
          <CircularProgress />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrUpdateGroupDialog;
