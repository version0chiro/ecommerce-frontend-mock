import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import useStyles from "../utils/styles";
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";

import { useSnackbar } from "notistack";

export default function Payment() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [payment, setPayment] = useState("");
  const {
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    } else {
      setPayment(Cookies.get("paymentMethod") || "");
    }
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    closeSnackbar();

    if (!payment) {
      enqueueSnackbar("Please select a payment method", { variant: "error" });
    } else {
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: payment });
      Cookies.set("paymentMethod", payment);
      router.push("/confirmation");
    }
  };
  return (
    <Layout>
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth variant="contained" color="primary" type="submit">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              onClick={() => router.push("/shipping")}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
