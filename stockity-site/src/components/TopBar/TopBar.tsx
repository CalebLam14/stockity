import { AppBar, MenuItem, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// This creates a simple top bar with EcksDeeNet's name on it.
// Clicking on the name brings you back to the main page.
const TopBar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography
        variant="h6"
        noWrap
        component={Link}
        to="/"
        sx={{
          color: "inherit",
          mr: 2,
          display: { xs: "none", md: "flex" },
          textDecoration: "none"
        }}
      >
        <b>Stockity</b>
      </Typography>
      <MenuItem key="products">
        <Typography
          textAlign="center"
          component={Link}
          to="/"
          sx={{ color: "inherit", textDecoration: "none" }}
          variant="button"
        >
          Products
        </Typography>
      </MenuItem>
    </Toolbar>
  </AppBar>
);

export default TopBar;
