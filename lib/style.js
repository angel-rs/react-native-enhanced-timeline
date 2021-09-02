import { StyleSheet } from "react-native";

const DEFAULT_CIRCLE_SIZE = 16;
const DEFAULT_LINE_WIDTH = 2;
const DEFAULT_TIME_TEXT_COLOR = "black";
const DEFAULT_DOT_COLOR = "white";

export default StyleSheet.create({
  listview: {
    flex: 1,
    width: "100%",
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  lastCircleContainerStyle: {
    marginBottom: 25,
  },
  timeContainer: {
    minWidth: 45,
  },
  time: {
    textAlign: "right",
    color: DEFAULT_TIME_TEXT_COLOR,
  },
  circle: {
    width: DEFAULT_CIRCLE_SIZE,
    height: DEFAULT_CIRCLE_SIZE,
    borderRadius: 10,
    position: "absolute",
    left: -8,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DEFAULT_DOT_COLOR,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    borderLeftWidth: DEFAULT_LINE_WIDTH,
    flexDirection: "column",
    flex: 1,
  },
  detail: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  description: {
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#aaa",
    marginTop: 10,
    marginBottom: 10,
  },
});
