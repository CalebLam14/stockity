import {
  Alert,
  AlertColor,
  Container,
  IconButton,
  Snackbar
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ItemParams from "../../interfaces/ItemParams";
import ItemForm from "../ItemForm/ItemForm";
import { ArrowBack } from "@mui/icons-material";
import { config } from "../../config";

type NotificationInfo = {
  severity: AlertColor;
  content: string;
};

const EditItem = () => {
  const [itemCreationInProgress, setItemCreationInProgress] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState<NotificationInfo>({
    severity: "error",
    content: "Something went wrong!"
  });
  const navigate = useNavigate();

  const onSubmit = (values: ItemParams) => {
    setItemCreationInProgress(true);
    fetch(config.apiUrl + `/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
      .then(async (resp) => {
        if (resp.ok) {
          setNotificationInfo({
            severity: "success",
            content: `${values.name} successfully created!`
          });
          setNotify(true);
          navigate("/", { replace: true });
        } else {
          setNotificationInfo({
            severity: "error",
            content: `Something went wrong while creating ${values.name}!`
          });
          setNotify(true);
        }
      })
      .catch(() => {
        setNotificationInfo({
          severity: "error",
          content: `Something went wrong while updating ${values.name}!`
        });
        setNotify(true);
      })
      .finally(() => setItemCreationInProgress(false));
  };

  const handleNotificationClose =
    (callback: () => void) => (_: SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      callback();
    };

  return (
    <Container sx={{ marginY: 2 }} maxWidth="md">
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
      <IconButton
        sx={{ marginBottom: 2 }}
        color="primary"
        component={Link}
        to="/"
        aria-label="back"
      >
        <ArrowBack />
      </IconButton>

      <ItemForm
        id={null}
        onSubmit={onSubmit}
        submissionInProgress={itemCreationInProgress}
      />
    </Container>
  );
};

export default EditItem;
