import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { ethers } from "ethers";

import { ABI, CONTRACT_ADDRESS } from "../contract";

const CreateDisplay = () => {
  const [rentValueEth, setRentValueEth] = useState(0);

  const [minRent, setMinRent] = useState(0);

  const account = useSelector((state) => state.account);

  const provider = useSelector((state) => state.provider);

  const createNewDislpay = async () => {
    try {
      const _rentPer10Mins = ethers.utils.parseEther(rentValueEth);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const txn = await contract.isWhitelisted(account);
      if (!txn) {
        alert("Wallet not whitelisted!");
        return;
      } else {
        const result = await contract.createDisplay(_rentPer10Mins);
        console.log(result);
      }
    } catch (error) {
      const errMessage = error.reason;
      alert("Error: " + errMessage);
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
  } else {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} paddingTop={10} paddingBottom={2} textAlign={"center"}>
          {minRent === 0 ? (
            <CircularProgress />
          ) : (
            <Typography variant="h5" style={{ wordWrap: "break-word" }} maxWidth={"200px"}>Minimum Rent: {minRent} ETH</Typography>
          )}
        </Grid>
        <Grid item xs={12} paddingTop={5} paddingBottom={2}>
          <TextField
            id="outlined-basic"
            label="Rent Per 10 minutes (in Eth)"
            variant="outlined"
            value={rentValueEth}
            onChange={(e) => {
              setRentValueEth(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} paddingTop={"10px"} paddingBottom={"10px"}>
          <Button variant="contained" onClick={createNewDislpay}>
            Create New Display
          </Button>
        </Grid>
      </Grid>
    );
  }
};

export default CreateDisplay;
