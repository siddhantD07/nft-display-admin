import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeIcon from "@mui/icons-material/QrCode";

import { actionCreators } from "../state/index";
import { CONTRACT_ADDRESS, ABI } from "../contract";
import { INFURA_ID, CHAIN_ID, NETWORK_NAME } from "../config";

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Web 3 Modal Demo",
      infuraId: INFURA_ID,
    },
  },
};

const pages = [
  {
    pageName: "Create Display",
    pageLink: "/create-display",
  },
  {
    pageName: "Reset Display",
    pageLink: "/reset-display",
  },
  {
    pageName: "Change Rent",
    pageLink: "/change-rent",
  },
];

const CHAIN_ERROR_MSG =
  "Incompatible Chain: Please refresh the page and re-connect with " + NETWORK_NAME + " network";

const Header = ({ render, setRender, loading, setLoading }) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const account = useSelector((state) => state.account);

  const provider = useSelector((state) => state.provider);

  const web3Instance = useSelector((state) => state.web3Instance);

  const chainId = useSelector((state) => state.chainId);

  const dispatch = useDispatch();

  const {
    setAccount,
    setProvider,
    setWeb3Instance,
    setChainId,
    setDisplaysOwned,
  } = bindActionCreators(actionCreators, dispatch);

  const disconnect = async () => {
    setAccount(null);
    setChainId(null);
    setWeb3Instance(null);
    console.log("Disconnect");
  };

  const getDisplaysOwned = async (chain, accounts, web3ModalProvider) => {
    if (!loading) {
      setLoading(true);
      if (chain === CHAIN_ID) {
        try {
          const ctr = new ethers.Contract(
            CONTRACT_ADDRESS,
            ABI,
            web3ModalProvider
          );
          const txn = await ctr.getDisplaysOwned(accounts[0]);
          const displaysOwned = txn.map((num) => num.toString());
          setDisplaysOwned(displaysOwned);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Wrong Chain");
      }
      setLoading(false);
    }
  };

  const getDisplaysOwnedOnChange = async (
    chain,
    accounts,
    web3ModalProvider
  ) => {
    if (!loading) {
      setLoading(true);
      try {
        const ctr = new ethers.Contract(
          CONTRACT_ADDRESS,
          ABI,
          web3ModalProvider
        );
        console.log(ctr);
        const txn = await ctr.getDisplaysOwned(accounts[0]);
        const displaysOwned = txn.map((num) => num.toString());
        setDisplaysOwned(displaysOwned);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }
  };
  const connectToWallet = async () => {
    try {
      let web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });
      const web3ModalInstance = await web3Modal.connect();
      const web3ModalProvider = new ethers.providers.Web3Provider(
        web3ModalInstance
      );

      const accounts = await web3ModalProvider.listAccounts();
      const network = await web3ModalProvider.getNetwork();

      if (network.chainId !== CHAIN_ID) alert(CHAIN_ERROR_MSG);
      setProvider(web3ModalProvider);
      setWeb3Instance(web3ModalInstance);

      if (accounts) {
        setAccount(accounts[0]);
        setChainId(network.chainId);
        await getDisplaysOwned(network.chainId, accounts, web3ModalProvider);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    navigate("/create-display");

    if (web3Instance?.on) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0]);
        getDisplaysOwned(chainId, accounts, provider);
      };

      const handleChainChanged = (chain) => {
        const chainIdParsed = parseInt(chain, 16);
        setChainId(chainIdParsed);
        if (chainIdParsed !== CHAIN_ID) alert(CHAIN_ERROR_MSG);
        else getDisplaysOwnedOnChange(chainId, account, provider);
      };

      const handleDisconnect = () => {
        disconnect();
      };

      web3Instance.on("accountsChanged", handleAccountsChanged);
      web3Instance.on("chainChanged", handleChainChanged);
      web3Instance.on("disconnect", handleDisconnect);

      return () => {
        if (web3Instance.removeListener) {
          web3Instance.removeListener("accountsChanged", handleAccountsChanged);
          web3Instance.removeListener("chainChanged", handleChainChanged);
          web3Instance.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [web3Instance]);

  const getAbbrWalletAddress = (walletAddress) => {
    let abbrWalletAddress =
      " " +
      walletAddress.substring(0, 4) +
      "..." +
      walletAddress.substring(38, 42);
    return abbrWalletAddress.toUpperCase();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <QrCodeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            QR Admin
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ pageName, pageLink }) => (
                <MenuItem key={pageName} onClick={handleCloseNavMenu}>
                  <Link
                    key={pageName}
                    to={pageLink}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography textAlign="center" sx={{ color: "black" }}>
                      {pageName}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <QrCodeIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            QR Admin
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ pageName, pageLink }) => (
              <Link
                key={pageName}
                to={pageLink}
                onClick={handleCloseNavMenu}
                style={{ textDecoration: "none" }}
              >
                <Button
                  key={pageName}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {pageName}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button
              variant="contained"
              onClick={account ? disconnect : connectToWallet}
            >
              {account ? getAbbrWalletAddress(account) : "Connect"}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
