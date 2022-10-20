import { useState } from "react";
import { useSelector } from "react-redux";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";

// import { CHAIN_ID } from "../config";
import { CONTRACT_ADDRESS, ABI } from "../contract";

const ResetDisplay = ({ loading }) => {
  const [displaySelected, setDisplaySelected] = useState("");

  const account = useSelector((state) => state.account);

  const displaysOwned = useSelector((state) => state.displaysOwned);

  // const chainId = useSelector((state) => state.chainId);

  const provider = useSelector((state) => state.provider);

  const handleChange = (event) => {
    setDisplaySelected(event.target.value);
  };

  const getMenuItem = (key) => {
    return (
      <MenuItem value={key} key={key}>
        {key}
      </MenuItem>
    );
  };

  const handleReset = async () => {
    console.log(displaySelected);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const txn = await contract.resetDisplay(displaySelected);
    } catch (error) {
      alert(error.reason);
    }
  };

  if (account === "") {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginTop={5}
      >
        <Typography variant="h5">Connect Wallet</Typography>
      </Grid>
    );
  } else if (loading === true) {
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        maxWidth={"200px"}
        marginTop={7}
      >
        <Grid item xs={12} marginTop={2}>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  } else if (account !== "" && displaysOwned.length > 0) {
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        maxWidth={"200px"}
        marginTop={7}
      >
        <Grid item xs={12}>
          <TextField
            label="Display Id"
            select
            value={displaySelected}
            onChange={handleChange}
            fullWidth
          >
            {displaysOwned.map((key) => getMenuItem(key))}
          </TextField>
        </Grid>
        <br />
        <Grid item xs={12} marginTop={2}>
          <Button fullWidth variant="contained" onClick={handleReset}>
            Reset
          </Button>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        maxWidth={"50%"}
        marginTop={7}
      >
        <Typography variant="h5">NO DISPLAYS OWNED</Typography>
      </Grid>
    );
  }
};

export default ResetDisplay;
