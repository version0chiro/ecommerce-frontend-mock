import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  navebar: {
    backgroundColor: "#203040",
    "& a": {
      color: "#fff",
      marginLeft: 10,
    },
  },
  brand: { fontWeight: "bold", fontSize: "1.5em" },
  grow: { flexGrow: 1 },
  main: {
    minHeight: "80vh",
  },
  footer: {
    marginTop: "1.5em",
    textAlign: "center",
  },
  section:{
    marginTop: "1em",
    marginBottom: "1em",
  }
});

export default useStyles;
