import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import Svg, { Line } from "react-native-svg";

import { Dot } from "./internal/Dot";

import styles from "./style";

const DEFAULT_CIRCLE_SIZE = 16;
const DEFAULT_CIRCLE_COLOR = "#007AFF";
const DEFAULT_LINE_WIDTH = 2;
const DEFAULT_LINE_COLOR = "#007AFF";
const DEFAULT_DOT_COLOR = "white";
const DEFAULT_COLUMN_FORMAT = "single-column-left";
const DEFAULT_INACTIVE_COLOR = "lightgray";

const { Value, timing } = Animated;

const AnimatedLine = Animated.createAnimatedComponent(Line);

const getAnimatedValues = ({ data = [], animateOnMount }) => {
  const animatedValues = {};

  data.forEach((_, index) => {
    animatedValues[index] = new Value(animateOnMount ? 0 : 1);
  });

  return animatedValues;
};

const Timeline = (props) => {
  let list = null;
  const [state, setState] = useState({ x: 0, width: 0 });
  // const [itemsState, setItemsState] = useState(() =>
  //   props?.data?.map(() => ({
  //     height: -1
  //   }))
  // )
  const [animatedValues, setAnimatedValues] = useState(() =>
    getAnimatedValues(props)
  );

  const getLastActiveItemIndex = () => {
    const { data } = props;

    return data.findIndex(({ active }) => active === false) - 1;
  };

  const runAnimations = (animation, index, length, last) => {
    const { animateOnMountConfig } = props;
    const next = index + 1;
    timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
      ...(animateOnMountConfig || {}),
    }).start(() => {
      if (index <= last) {
        list.scrollToIndex({
          index,
          viewOffset: 25,
        });
      }
      if (index < length) {
        runAnimations(animatedValues[next], next, length, last);
      }
    });
  };

  const animateAll = () => {
    const { data } = props;
    const lastActiveItemIndex = getLastActiveItemIndex();
    const resetAnimations = true;

    if (resetAnimations) {
      data.forEach((_, index) => {
        animatedValues[index].setValue(0);
      });
    }

    runAnimations(animatedValues[0], 0, data.length - 1, lastActiveItemIndex);
  };

  const renderLine = ({ item, index, isFirst, isLast }) => {
    if (isLast) {
      return null;
    }

    const { lineWidth, lineStyle = {}, circleColor } = props;
    const { x } = state;

    const { active: isActive } = item;

    const lastActiveItemIndex = getLastActiveItemIndex();
    const circleColorToUse = !isActive
      ? DEFAULT_INACTIVE_COLOR
      : item.circleColor || circleColor || DEFAULT_CIRCLE_COLOR;
    const lineColorToUse =
      index === lastActiveItemIndex ? DEFAULT_INACTIVE_COLOR : circleColorToUse;
    const lineWidthToUse = item.lineWidth || lineWidth || DEFAULT_LINE_WIDTH;
    const path = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    return (
      <View
        style={{
          flex: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
          left: x,
          ...(x === 0 ? { opacity: 0 } : {}), // hide the line if x is not yet defined
          ...lineStyle,
        }}
      >
        <Svg height="100%" width="100%">
          <AnimatedLine
            x="0"
            y="0"
            x1="0"
            x2="0"
            y1="0"
            // y1={isFirst ? '25' : '0'}
            y2={path}
            stroke={lineColorToUse}
            strokeWidth={lineWidthToUse * 2}
          />
        </Svg>
      </View>
    );
  };

  // TODO: make more modular this function
  const renderCircle = ({ item, index }) => {
    const { renderCircle: customRenderCircle } = props;
    const { active: isActive } = item;
    const { x, width } = state; // TODO: document `x` or find it a better name...

    if (customRenderCircle) {
      return customRenderCircle({ item, index });
    }

    // TODO: refactor & simplify
    /*
      dotProps: {
        color
        size
        style
        ...props
      }
      circleProps: {
        color
        size
        style
        ...props
      }
      lineProps: {
        width
        ...
      }
    */

    const {
      circleSize,
      circleColor,
      lineWidth,
      columnFormat,
      innerCircleType,
      iconStyle,
      icon,
      dotColor,
      dotSize,
      dotStyle,
      dotProps,
      circleStyle,
    } = props;

    const lastActiveItemIndex = getLastActiveItemIndex();
    const lineWidthToUse = item.lineWidth || lineWidth || DEFAULT_LINE_WIDTH;
    const dotStyleToUse = item.dotStyle || dotStyle;
    const dotSizeToUse = item.dotSize || dotSize || circleSize;
    const dotColorToUse = item.dotColor || dotColor || DEFAULT_DOT_COLOR;
    const dotPropsToUse = item.dotProps || dotProps || {};
    const innerCircleTypeToUse = item.innerCircleType || innerCircleType;
    let circleSizeToUse = item.circleSize || circleSize || DEFAULT_CIRCLE_SIZE;
    let circleColorToUse =
      item.circleColor || circleColor || DEFAULT_CIRCLE_COLOR;
    let innerCircleElement = null;
    let localCircleStyle = null;

    if (index === lastActiveItemIndex) {
      circleSizeToUse = circleSize * 1.3;
    }
    if (!isActive) {
      circleColorToUse = DEFAULT_INACTIVE_COLOR;
    }

    if (columnFormat === "single-column-left") {
      localCircleStyle = {
        width: x ? circleSizeToUse : 0,
        height: x ? circleSizeToUse : 0,
        borderRadius: circleSizeToUse / 2,
        backgroundColor: circleColorToUse,
        left: x - circleSizeToUse / 2 + (lineWidthToUse - 1) / 2,
      };
    }

    if (columnFormat === "single-column-right") {
      localCircleStyle = {
        width: width ? circleSizeToUse : 0,
        height: width ? circleSizeToUse : 0,
        borderRadius: circleSizeToUse / 2,
        backgroundColor: circleColorToUse,
        left: width - circleSizeToUse / 2 - (lineWidthToUse - 1) / 2,
      };
    }

    if (columnFormat === "two-column") {
      localCircleStyle = {
        width: width ? circleSizeToUse : 0,
        height: width ? circleSizeToUse : 0,
        borderRadius: circleSizeToUse / 2,
        backgroundColor: circleColorToUse,
        left: width - circleSizeToUse / 2 - (lineWidthToUse - 1) / 2,
      };
    }

    if (innerCircleTypeToUse === "icon") {
      const IconElement = item.icon || icon;

      if (IconElement === null) {
        console.warn(
          "Expecting `icon` for item but found nothing on both the item and the Timeline."
        );
      }

      if (typeof IconElement === "string") {
        innerCircleElement = (
          <Image
            source={iconSource}
            defaultSource={iconDefault}
            style={[iconStyle, props.iconStyle]}
          />
        );
      } else {
        const localIconStyle = {
          height: circleSizeToUse,
          width: circleSizeToUse,
        };

        innerCircleElement = (
          <IconElement style={[localIconStyle, iconStyle]} />
        );
      }
    }

    if (innerCircleTypeToUse === "dot") {
      localCircleStyle = {
        ...localCircleStyle,
        backgroundColor: "transparent",
      };
      innerCircleElement = (
        <Dot
          style={dotStyleToUse}
          width={dotSizeToUse}
          height={dotSizeToUse}
          color={dotColorToUse}
          {...dotPropsToUse}
        />
      );
    }

    return (
      <Animated.View style={[styles.circle, localCircleStyle, circleStyle]}>
        {innerCircleElement}
      </Animated.View>
    );
  };

  const renderSeparator = (item) => {
    const {
      data,
      separator,
      separatorStyle,
      renderSeparator: customRenderSeparator,
    } = props;

    if (customRenderSeparator) {
      return customRenderSeparator({
        isLast: data.indexOf(item) === data.length - 1,
      });
    }

    if (!separator) {
      return null;
    }

    if (data.indexOf(item) === data.length - 1) {
      // if it's the last item, just render a invisible spacing
      return <View style={{ marginBottom: 50 }} />;
    }

    return <View style={[styles.separator, separatorStyle]} />;
  };

  const renderItem = ({ item, index }) => {
    const {
      columnFormat = DEFAULT_COLUMN_FORMAT,
      rowContainerStyle,
      endWithCircle,
      data,
    } = props;
    let content = null;
    const isLast = index + 1 === data.length;
    const isFirst = index === 0;
    const extendFinishLine = index + 2 === data.length;

    if (columnFormat === "single-column-left") {
      content = (
        <View style={[styles.rowContainer, rowContainerStyle]}>
          {renderLine({ item, index, extendFinishLine, isFirst, isLast })}
          {renderTime({ item, index, isFirst, isLast })}
          {renderEvent({ item, index, isFirst, isLast })}
          {renderCircle({ item, index, isFirst, isLast })}
        </View>
      );
    }

    if (columnFormat === "two-column") {
      if (index % 2 === 0) {
        content = (
          <View style={[styles.rowContainer, rowContainerStyle]}>
            {renderTime({ item, index })}
            {renderEvent({ item, index })}
            {renderCircle({ item, index })}
          </View>
        );
      } else {
        content = (
          <View style={[styles.rowContainer, rowContainerStyle]}>
            {renderEvent({ item, index })}
            {renderTime({ item, index })}
            {renderCircle({ item, index })}
          </View>
        );
      }
    }

    return content;
  };

  const renderTime = ({ item, index }) => {
    const { showTime = true } = props;

    if (!showTime) {
      return null;
    }

    if (props.renderTime) {
      return props.renderTime({ item, index });
    }

    const {
      columnFormat = DEFAULT_COLUMN_FORMAT,
      timeContainerStyle,
      timeStyle,
    } = props;
    let timeWrapper = null;

    if (columnFormat === "single-column-left") {
      timeWrapper = {
        alignItems: "flex-end",
      };
    }

    if (columnFormat === "single-column-right") {
      timeWrapper = {
        alignItems: "flex-start",
      };
    }

    if (columnFormat === "two-column") {
      timeWrapper = {
        flex: 1,
        alignItems: index % 2 === 0 ? "flex-end" : "flex-start",
      };
    }

    return (
      <View style={timeWrapper}>
        <View style={[styles.timeContainer, timeContainerStyle]}>
          <Text style={[styles.time, timeStyle]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  const renderDetail = ({ item, index }) => {
    const {
      renderDetail: customRenderDetail,
      titleStyle,
      descriptionStyle,
    } = props;

    if (customRenderDetail) {
      return customRenderDetail({ item, index });
    }

    const title = item.description ? (
      <View>
        <Text style={[styles.title, titleStyle]}>{item.title}</Text>
        <Text style={[styles.description, descriptionStyle]}>
          {item.description}
        </Text>
      </View>
    ) : (
      <Text style={[styles.title, titleStyle]}>{item.title}</Text>
    );

    return <View style={styles.container}>{title}</View>;
  };

  const renderEvent = ({ item, index }) => {
    const { renderEvent: customRenderEvent } = props;
    const { active: isActive } = item;

    if (customRenderEvent) {
      return customRenderEvent({ item, index });
    }

    const {
      columnFormat = DEFAULT_COLUMN_FORMAT,
      lineWidth,
      renderFullLine,
      data,
      lineColor,
    } = props;

    const lineColorToUse = item.lineColor || lineColor || DEFAULT_LINE_COLOR;
    const lineWidthToUse = item.lineWidth || lineWidth || DEFAULT_LINE_WIDTH;

    const isLast = renderFullLine ? !renderFullLine : index + 1 === data.length;
    // eslint-disable-next-line
    const borderColor = !isActive
      ? DEFAULT_INACTIVE_COLOR
      : isLast
      ? "transparent"
      : lineColorToUse;

    let opStyle = null;

    if (columnFormat === "single-column-left") {
      opStyle = {
        // borderColor,
        // borderLeftWidth: isLast ? 0 : lineWidthToUse,
        borderLeftWidth: 0,
        marginLeft: 20,
        paddingLeft: 20,
      };
    }

    if (columnFormat === "single-column-right") {
      opStyle = {
        borderColor,
        borderLeftWidth: 0,
        borderRightWidth: isLast ? 0 : lineWidthToUse,
        marginRight: 20,
        paddingRight: 20,
      };
    }

    if (columnFormat === "two-column") {
      if (index % 2 === 0) {
        opStyle = {
          borderColor,
          borderLeftWidth: isLast ? 0 : lineWidthToUse,
          borderRightWidth: 0,
          marginLeft: 20,
          paddingLeft: 20,
        };
      } else {
        opStyle = {
          borderColor,
          borderLeftWidth: 0,
          borderRightWidth: lineWidthToUse,
          marginRight: 20,
          paddingRight: 20,
        };
      }
    }
    const { onEventPress, detailContainerStyle } = props;
    const { width: stateWidth, x: stateX } = state;
    const onPress = () => onEventPress(item);

    return (
      <Animated.View
        style={[styles.details, opStyle]}
        onLayout={(evt) => {
          if (!stateX && !stateWidth) {
            // NOTE: maybe we have to keep in state the height of every item
            const { x, width, height } = evt.nativeEvent.layout;
            setState({ x, width });
            // const newItemsState = [...itemsState]
            // newItemsState[index].height = height
            // setItemsState(newItemsState)
          }
        }}
      >
        <TouchableOpacity
          disabled={onEventPress === null}
          style={detailContainerStyle}
          onPress={onPress}
        >
          <View style={styles.detail}>{renderDetail({ item, index })}</View>
        </TouchableOpacity>
        {renderSeparator(item)}
      </Animated.View>
    );
  };

  const {
    style,
    flatListProps,
    keyExtractor,
    animateOnMount,
    animateOnMountDelay = 1000,
  } = props;

  useEffect(() => {
    if (animateOnMount) {
      setTimeout(() => {
        animateAll();
      }, animateOnMountDelay);
    }
  }, []);

  return (
    <FlatList
      data={props.data}
      ref={(ref) => {
        list = ref;
      }}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={[styles.listview, style]}
      automaticallyAdjustContentInsets={false}
      {...flatListProps}
    />
  );
};

Timeline.defaultProps = {
  style: null,
  animateOnMount: false,
  animateOnMountDelay: 1000,
  animateOnMountConfig: {},
  flatListProps: null,
  columnFormat: DEFAULT_COLUMN_FORMAT,
  rowContainerStyle: null,
  lastCircleContainerStyle: null,
  showTime: true,
  renderTime: null,
  timeContainerStyle: null,
  timeStyle: null,
  renderEvent: null,
  lineWidth: DEFAULT_LINE_WIDTH,
  renderFullLine: false,
  endWithCircle: false,
  lineStyle: undefined,
  lineColor: DEFAULT_LINE_COLOR,
  onEventPress: null,
  detailContainerStyle: null,
  renderDetail: null,
  titleStyle: null,
  descriptionStyle: null,
  renderCircle: null,
  circleSize: DEFAULT_CIRCLE_SIZE,
  circleColor: DEFAULT_CIRCLE_COLOR,
  innerCircleType: null,
  iconStyle: null,
  icon: null,
  dotSize: undefined,
  dotColor: DEFAULT_DOT_COLOR,
  circleStyle: null,
  renderSeparator: null,
  separator: true,
  separatorStyle: null,
  keyExtractor: (item) => item.id,
};

Timeline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      lineWidth: PropTypes.number,
      lineColor: PropTypes.string,
      circleSize: PropTypes.number,
      circleColor: PropTypes.string,
      dotColor: PropTypes.number,
      icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    })
  ).isRequired,
  keyExtractor: PropTypes.func,
  style: PropTypes.any,
  flatListProps: PropTypes.object,
  columnFormat: PropTypes.oneOf([
    "single-column-left",
    "single-column-right",
    "two-column",
  ]),
  animateOnMount: PropTypes.bool,
  animateOnMountDelay: PropTypes.number,
  animateOnMountConfig: PropTypes.object,
  rowContainerStyle: PropTypes.any,
  lastCircleContainerStyle: PropTypes.any,
  showTime: PropTypes.bool,
  renderTime: PropTypes.func,
  timeContainerStyle: PropTypes.any,
  timeStyle: PropTypes.any,
  renderEvent: PropTypes.func,
  lineWidth: PropTypes.number,
  renderFullLine: PropTypes.bool,
  endWithCircle: PropTypes.bool,
  lineStyle: PropTypes.style,
  lineColor: PropTypes.string,
  onEventPress: PropTypes.func,
  detailContainerStyle: PropTypes.any,
  renderDetail: PropTypes.func,
  titleStyle: PropTypes.any,
  descriptionStyle: PropTypes.any,
  renderCircle: PropTypes.func,
  renderSeparator: PropTypes.func,
  dotSize: PropTypes.number,
  circleSize: PropTypes.number,
  circleColor: PropTypes.string,
  innerCircleType: PropTypes.oneOf(["icon", "dot"]),
  iconStyle: PropTypes.any,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  dotColor: PropTypes.string,
  circleStyle: PropTypes.any,
  separator: PropTypes.bool,
  separatorStyle: PropTypes.any,
};

export { Timeline };
