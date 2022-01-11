import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Typography
} from "@mui/material";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../../config";
import Item from "../../interfaces/Item";
import { Link } from "react-router-dom";
import { NotificationInfo } from "../../interfaces/NotificationInfo";
import DeleteItemDialog from "../DeleteItemDialog/DeleteItemDialog";

const SingleItem = () => {
  const params = useParams();
  const id = params.id!;
  const [item, setItem] = useState<Item | null>(null);
  const [openDeleteItemDialog, setOpenDeleteItemDialog] = useState(false);
  const [deletionInProgress, setDeletionInProgress] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState<NotificationInfo>({
    severity: "error",
    content: "Something went wrong!"
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getItem = async () => {
      fetch(config.apiUrl + `/items/${id}`)
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((respJson) => {
              const itemResp = respJson as Item;
              setItem(itemResp);
            });
          } else {
            setItem(null);
          }
        })
        .catch(() => setItem(null));
    };

    getItem();
  }, [id]);

  const handleNotificationClose =
    (callback: () => void) =>
    (_: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      callback();
    };

  const onDeleteItemDialogCancel = () => {
    setOpenDeleteItemDialog(false);
  };

  const onDeleteItemDialogConfirm = (deletingItem: Item) => {
    setDeletionInProgress(true);
    deleteItem(deletingItem);
  };

  const deleteItem = (deletingItem: Item) => {
    fetch(config.apiUrl + `/items/${deletingItem.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(async (resp) => {
        if (resp.ok) {
          setNotificationInfo({
            severity: "success",
            content: `${deletingItem.name} successfully deleted!`
          });
          setNotify(true);
          setOpenDeleteItemDialog(false);
          navigate("/", { replace: true });
        } else {
          setNotificationInfo({
            severity: "error",
            content: `Something went wrong while deleting ${deletingItem.name}!`
          });
          setNotify(true);
        }
      })
      .catch(() => {
        setNotificationInfo({
          severity: "error",
          content: `Something went wrong while deleting ${deletingItem.name}!`
        });
        setNotify(true);
      })
      .finally(() => setDeletionInProgress(false));
  };

  if (item == null) {
    return (
      <Container sx={{ marginY: 2 }}>
        <IconButton
          sx={{ marginBottom: 2 }}
          color="primary"
          component={Link}
          to="/"
          aria-label="back"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h1">404</Typography>
        <Typography variant="h3">Whoops! We can't find your item!</Typography>
      </Container>
    );
  }

  return (
    <div>
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
      <DeleteItemDialog
        open={openDeleteItemDialog}
        deletingItem={item}
        deletionInProgress={deletionInProgress}
        onCancel={onDeleteItemDialogCancel}
        onConfirm={onDeleteItemDialogConfirm}
      />
      <Container sx={{ marginY: 2 }} maxWidth="md">
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Grid item>
            <IconButton
              sx={{ marginBottom: 2 }}
              color="primary"
              component={Link}
              to="/"
              aria-label="back"
            >
              <ArrowBack />
            </IconButton>
          </Grid>

          <Grid item>
            <Box>
              <IconButton
                sx={{ marginBottom: 2 }}
                color="primary"
                component={Link}
                to="edit"
                aria-label="edit"
              >
                <Edit />
              </IconButton>
              <IconButton
                sx={{ marginBottom: 2 }}
                color="primary"
                aria-label="delete"
                onClick={() => setOpenDeleteItemDialog(true)}
              >
                <Delete />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <CircularProgress
          sx={{ visibility: item != undefined ? "hidden" : "visible" }}
        />
        <Card
          sx={{
            visibility: item == undefined ? "hidden" : "visible",
            wordWrap: "break-word"
          }}
        >
          <CardHeader
            title={<Typography variant="h5">{item?.name}</Typography>}
            subheader={
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {item?.group != null ? item?.group!.name : "Uncategorized"}
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <Typography
              variant="body1"
              sx={{ wordWrap: "break-word" }}
              color="text.primary"
            >
              {item?.description}
            </Typography>
            <Typography variant="h4" color="text.primary" align="right">
              {"$" + item?.price.toFixed(2)}
            </Typography>
            <Typography
              variant="h6"
              sx={{ wordWrap: "break-word" }}
              color={
                item != undefined && item.stock > 0
                  ? "success.main"
                  : "error.main"
              }
              align="right"
            >
              {item != undefined && item.stock > 0
                ? item?.stock + " in stock"
                : "Out of stock"}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default SingleItem;
