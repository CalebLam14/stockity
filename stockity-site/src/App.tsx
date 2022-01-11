import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SingleItem from "./components/SingleItem/SingleItem";
import Items from "./components/Items/Items";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import EditItem from "./components/EditItem/EditItem";
import CreateItem from "./components/CreateItem/CreateItem";
import TopBar from "./components/TopBar/TopBar";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light"
        }
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div>
          <TopBar />
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/:id" element={<SingleItem />} />
            <Route path="/:id/edit" element={<EditItem />} />
            <Route path="/create" element={<CreateItem />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
