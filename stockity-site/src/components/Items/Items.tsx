import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { config } from "../../config";
import { Link } from "react-router-dom";
import Item from "../../interfaces/Item";
import { Add } from "@mui/icons-material";

const Items = () => {
  // List of all rendered items.
  const [items, setItems] = useState<Item[]>([]);

  // Gets all the items every minute.
  // (I will see if I can implement partial rendering in the future.)
  useEffect(() => {
    const getItems = async () => {
      const resp = await fetch(config.apiUrl + "/items/");
      const itemsResp = (await resp.json()) as Item[];
      itemsResp.sort((a, b) => a.id - b.id);
      setItems(itemsResp);
    };

    getItems();
  }, []);

  return (
    <Container sx={{ width: "md", marginY: 2 }}>
      <IconButton
        component={Link}
        to="/create"
        sx={{ marginBottom: 2 }}
        color="primary"
      >
        <Add />
      </IconButton>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardActionArea component={Link} to={`/${item.id}`}>
                <CardHeader
                  sx={{ display: "block", overflow: "hidden" }}
                  title={
                    <Typography noWrap variant="h5">
                      {item.name}
                    </Typography>
                  }
                  subheader={
                    <Box>
                      <Typography noWrap variant="body2" color="text.secondary">
                        {item.group != null
                          ? item.group?.name
                          : "Uncategorized"}
                      </Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <Typography variant="h4" color="text.primary">
                    {"$" + item.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ wordWrap: "break-word" }}
                    color={item.stock > 0 ? "success.main" : "error.main"}
                  >
                    {item.stock > 0 ? item.stock + " in stock" : "Out of stock"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Items;
