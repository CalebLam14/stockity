import {
  Alert,
  AlertColor,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Snackbar
} from "@mui/material";
import { Navigate, useLocation } from "react-router";
import { SyntheticEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ItemParams from "../../interfaces/ItemParams";
import ItemForm from "../ItemForm/ItemForm";
import { ArrowBack, Edit } from "@mui/icons-material";
import { config } from "../../config";

type NotificationInfo = {
  severity: AlertColor;
  content: string;
};

const EditItem = () => {
  const params = useParams();
  const id = params.id != undefined ? parseInt(params.id!) : undefined;

  const [itemUpdateInProgress, setitemUpdateInProgress] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState<NotificationInfo>({
    severity: "error",
    content: "Something went wrong!"
  });

  const onSubmit = (values: ItemParams) => {
    setitemUpdateInProgress(true);
    fetch(config.apiUrl + `/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
      .then(async (resp) => {
        if (resp.ok) {
          setNotificationInfo({
            severity: "success",
            content: `${values.name} successfully updated!`
          });
          setNotify(true);
        } else {
          setNotificationInfo({
            severity: "error",
            content: `Something went wrong while updating ${values.name}!`
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
      .finally(() => setitemUpdateInProgress(false));
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
        to={"/" + id}
        aria-label="back"
      >
        <ArrowBack />
      </IconButton>

      {id != undefined ? (
        <ItemForm
          id={id}
          onSubmit={onSubmit}
          submissionInProgress={itemUpdateInProgress}
        />
      ) : (
        <Navigate to="/" />
      )}
    </Container>
  );
};

export default EditItem;
