import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Snackbar,
  AlertColor
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState, MouseEvent } from "react";
import { config } from "../../config";
import Group from "../../interfaces/Group";
import CreateOrUpdateGroupDialog from "../CreateOrUpdateGroupDialog/CreateOrUpdateGroupDialog";
import GroupParams from "../../interfaces/GroupParams";
import { NotificationInfo } from "../../interfaces/NotificationInfo";
import DeleteGroupDialog from "../DeleteGroupDialog/DeleteGroupDialog";

export interface GroupSelectionListProps {
  selectedGroup: Group | null;
  onSelectionChanged: (group: Group | null) => void;
}

const GroupSelectionList = (props: GroupSelectionListProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(
    props.selectedGroup
  );
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [openDeleteGroupDialog, setOpenDeleteGroupDialog] = useState(false);
  const [listUpdateInProgress, setListUpdateInProgress] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState<NotificationInfo>({
    severity: "error",
    content: "Something went wrong!"
  });

  const groupSortingFunc = (a: Group, b: Group) => a.id - b.id;

  const handleGroupSelectionClick = (e: MouseEvent, group: Group) => {
    const newSelectedGroup =
      selectedGroup == null || selectedGroup.id != group.id ? group : null;
    setSelectedGroup(newSelectedGroup);
    props.onSelectionChanged(newSelectedGroup);
    e.stopPropagation();
  };

  const handleAddGroupOptionClick = (e: MouseEvent) => {
    setEditingGroup(null);
    setOpenGroupDialog(true);
    e.stopPropagation();
  };

  const handleEditGroupClick = (e: MouseEvent, group: Group) => {
    setEditingGroup(group);
    setOpenGroupDialog(true);
    e.stopPropagation();
  };

  const handleDeleteGroupClick = (e: MouseEvent, group: Group) => {
    setEditingGroup(group);
    setOpenDeleteGroupDialog(true);
    e.stopPropagation();
  };

  const handleNotificationClose =
    (callback: () => void) =>
    (_: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      callback();
    };

  const createNewGroup = (groupName: string) => {
    const body: GroupParams = {
      name: groupName
    };
    fetch(config.apiUrl + "/groups/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(async (resp) => {
        if (resp.ok) {
          const newGroup = (await resp.json()) as Group;
          groups.push(newGroup);
          groups.sort(groupSortingFunc);
          setGroups(groups);
          setNotificationInfo({
            severity: "success",
            content: `${newGroup.name} successfully created!`
          });
          setNotify(true);
          setOpenGroupDialog(false);
        } else {
          setNotificationInfo({
            severity: "error",
            content: `Something went wrong while creating ${groupName}!`
          });
          setNotify(true);
        }
      })
      .catch(() => {
        setNotificationInfo({
          severity: "error",
          content: `Something went wrong while creating ${groupName}!`
        });
        setNotify(true);
      })
      .finally(() => setListUpdateInProgress(false));
  };

  const editGroup = (id: number, groupName: string) => {
    const body: GroupParams = {
      name: groupName
    };
    fetch(config.apiUrl + `/groups/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(async (resp) => {
        if (resp.ok) {
          const groupInListIndex = groups.findIndex((g) => g.id == id);
          if (groupInListIndex != undefined) {
            groups[groupInListIndex].name = groupName;
            setGroups(groups);
            setNotificationInfo({
              severity: "success",
              content: `${groupName} successfully updated!`
            });
            setNotify(true);
            setOpenGroupDialog(false);
          } else {
            setNotificationInfo({
              severity: "error",
              content: `Something went wrong while updating ${groupName} in the selections list!`
            });
            setNotify(true);
          }
        } else {
          setNotificationInfo({
            severity: "error",
            content: `Something went wrong while updating ${groupName}!`
          });
          setNotify(true);
        }
      })
      .catch(() => {
        setNotificationInfo({
          severity: "error",
          content: `Something went wrong while updating ${groupName}!`
        });
        setNotify(true);
      })
      .finally(() => setListUpdateInProgress(false));
  };

  const deleteGroup = (deletingGroup: Group) => {
    fetch(config.apiUrl + `/groups/${deletingGroup.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(async (resp) => {
        if (resp.ok) {
          const newGroups = groups.filter((g) => g.id != deletingGroup.id);
          setGroups(newGroups);
          setNotificationInfo({
            severity: "success",
            content: `${deletingGroup.name} successfully deleted!`
          });
          setNotify(true);
          setOpenDeleteGroupDialog(false);
        } else {
          setNotificationInfo({
            severity: "error",
            content: `Something went wrong while deleting ${deletingGroup.name}!`
          });
          setNotify(true);
        }
      })
      .catch(() => {
        setNotificationInfo({
          severity: "error",
          content: `Something went wrong while deleting ${deletingGroup.name}!`
        });
        setNotify(true);
      })
      .finally(() => setListUpdateInProgress(false));
  };

  const onGroupDialogCancel = () => {
    setOpenGroupDialog(false);
  };
  const onGroupDialogSubmit = (editingId: number | null, groupName: string) => {
    setListUpdateInProgress(true);
    if (editingId != null) {
      editGroup(editingId, groupName);
    } else {
      createNewGroup(groupName);
    }
  };

  const onDeleteGroupDialogCancel = () => {
    setOpenDeleteGroupDialog(false);
  };
  const onDeleteGroupDialogConfirm = (deletingGroup: Group) => {
    setListUpdateInProgress(true);
    deleteGroup(deletingGroup);
  };

  useEffect(() => {
    const getGroups = async () => {
      const resp = await fetch(config.apiUrl + "/groups/");
      const postsResp = (await resp.json()) as Group[];
      postsResp.sort(groupSortingFunc);
      setGroups(postsResp);
    };

    getGroups();
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: 400, bgcolor: "background.paper" }}>
      <Snackbar
        open={notify}
        autoHideDuration={6000}
        onClose={handleNotificationClose(() => setNotify(false))}
      >
        <Alert
          onClose={handleNotificationClose(() => setNotify(false))}
          severity={notificationInfo.severity}
          sx={{ width: "100%" }}
        >
          {notificationInfo.content}
        </Alert>
      </Snackbar>
      <CreateOrUpdateGroupDialog
        editingGroup={editingGroup}
        open={openGroupDialog}
        creationInProgress={listUpdateInProgress}
        onCancel={onGroupDialogCancel}
        onSubmit={onGroupDialogSubmit}
      />
      <DeleteGroupDialog
        deletingGroup={editingGroup!}
        open={openDeleteGroupDialog}
        deletionInProgress={listUpdateInProgress}
        onCancel={onDeleteGroupDialogCancel}
        onConfirm={onDeleteGroupDialogConfirm}
      />
      <List
        aria-label="main groups"
        style={{ maxHeight: "100%", overflow: "auto" }}
      >
        {groups.map((group) => (
          <ListItemButton
            selected={selectedGroup != null && selectedGroup.id == group.id}
            onClick={(e) => handleGroupSelectionClick(e, group)}
            key={group.id.toString()}
          >
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={(e) => handleEditGroupClick(e, group)}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => handleDeleteGroupClick(e, group)}
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
            <ListItemText primary={group.name} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List aria-label="secondary options">
        <ListItemButton selected={false} onClick={handleAddGroupOptionClick}>
          <ListItemText primary="New Group..." />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default GroupSelectionList;
