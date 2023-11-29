import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { selectErrorOpen, selectErrorMessage, setErrorOpen } from "../app/errorSlice";

function ErrorSnackbar() {
  const errorOpen = useSelector(selectErrorOpen);
  const errorMessage = useSelector(selectErrorMessage);
  const dispatch = useDispatch();

  const location = {
    vertical: "top", 
    horizontal: "center"
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    dispatch(setErrorOpen(false));
  }

  return (
    <Snackbar open={errorOpen} onClose={handleClose} anchorOrigin={location}>
      <Alert onClose={handleClose} severity="warning">
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}

export default ErrorSnackbar;