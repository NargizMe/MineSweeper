import { StyleSheet, Text, View } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 20,
  },
  dropDownContainer: {
    width: 90,
  },
  // dropDown: {
  //   backgroundColor: "#fafafa",
  // },
  // dropDownItems: {
  //   backgroundColor: "#e5e5e5",
  // },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  revealed: {
    backgroundColor: "#bbb",
  },
  mine: {
    backgroundColor: "#f00",
  },
  cellText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  oddCell: {
    backgroundColor: "#c1e086",
  },
  evenCell: {
    backgroundColor: "#a2d149",
  },
  openedCell: {
    backgroundColor: "#e5c29f",
  },
  bombedCell: {
    backgroundColor: "red",
  },
});
