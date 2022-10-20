import { useState, useEffect } from "react";
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

import { CONTRACT_ADDRESS, ABI } from "../contract";

const ChangeRent = ({ loading }) => {
  const [rentValueEth, setRentValueEth] = useState(0);

  const [minRent, setMinRent] = useState(0);

  const [displaySelected, setDisplaySelected] = useState("");

  const account = useSelector((state) => state.account);

  const displaysOwned = useSelector((state) => state.displaysOwned);

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

  const handleChangeRent = async () => {
    console.log(displaySelected);
    try {
      const displayId = displaySelected;
      const _rentPer10Mins = ethers.utils.parseEther(rentValueEth);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      await contract.setRent(displayId, _rentPer10Mins);
    } catch (error) {
      alert(error.reason);
    }
  };

  useEffect(() => {
    const getMinimumRent = async () => {
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const txn = await contract.minimumRent();
        const minimumRentWei = txn.toString();
        const minimumRentEth = ethers.utils.formatEther(minimumRentWei);
        setMinRent(minimumRentEth);
      } catch (error) {
        const errMessage = error.reason;
        console.log("Error: " + errMessage);
      }
    };
    if (minRent === 0 && account !== "") {
      getMinimumRent();
    }
  }, [provider]);
  //render
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
  } else if (loading) {
    <CircularProgress />;
  } else if (account !== "" && displaysOwned.length > 0) {
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        maxWidth={"200px"}
        marginTop={7}
      >
        <Grid item xs={12} paddingTop={10} paddingBottom={2} textAlign={"center"}>
          {minRent === 0 ? (
            <CircularProgress />
          ) : (
            <Typography variant="h5" style={{ wordWrap: "break-word" }}>Minimum Rent: {minRent} ETH</Typography>
          )}
        </Grid>
        <Grid item xs={12} marginBottom={2}>
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
        <TextField
          id="outlined-basic"
          label="Rent Per 10 minutes (in Eth)"
          variant="outlined"
          value={rentValueEth}
          onChange={(e) => {
            setRentValueEth(e.target.value);
          }}
        />
        <Grid item xs={12} marginTop={2}>
          <Button fullWidth variant="contained" onClick={handleChangeRent}>
            Change Rent
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

export default ChangeRent;
