import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Grid } from "@mui/material";

import Header from "./components/Header";
import Landing from "./pages/Landing";
import CreateDisplay from "./pages/CreateDisplay";
import ResetDisplay from "./pages/ResetDisplay";
import ChangeRent from "./pages/ChangeRent";

function App() {
  const [render, setRender] = useState(false);

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Header
        setRender={setRender}
        render={render}
        loading={loading}
        setLoading={setLoading}
      />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create-display" element={<CreateDisplay />} />
          <Route
            path="/reset-display"
            element={<ResetDisplay loading={loading} />}
          />
          <Route path="/change-rent" element={<ChangeRent />} />
        </Routes>
      </Grid>
    </>
  );
}

export default App;
