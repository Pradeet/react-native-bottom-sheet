import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import Interactable from 'react-native-interactable';
import { Animated, TouchableHighlight, Dimensions, StatusBar, ScrollView, Image, View, Text } from 'react-native';

import _map from 'lodash/map';
import _get from 'lodash/get';
import _noop from 'lodash/noop';
import _isEmpty from 'lodash/isEmpty';

import { Button, ComponentPropTypes } from './components';

import styles from './BottomSheet.style';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const SCREEN_HEIGHT = WINDOW_HEIGHT - (StatusBar.currentHeight || 0);
const ANIMATABLE_BACKGROUND_COLOR = '#000';

const DISMISS_AREA = {
  ENTER: 'enter',
  LEAVE: 'leave'
};

const SNAP_POINTS_INDEX = {
  MAXIMUM_POSITION: 0,
  DISMISS_SHEET: 1,
};

const showWarning = (errorString) => {
  if (__DEV__) { console.warn(errorString); } // eslint-disable-line no-console
};

class BottomSheet extends React.Component {
  constructor(props) {
    super(props);
    this.deltaY = new Animated.Value(props.maximumPanelTopMargin);
    this.currentSnap = SNAP_POINTS_INDEX.DISMISS_SHEET;
    this.panelHeaderHeight = 0;
    this.contentHeight = 0;
    this.panelFooterHeight = 0;
    this.state = {
      show: false,
      contentHeight: 0,
      panelTopMargin: props.minimumPanelTopMargin,
      shouldDismissBottomSheet: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (props.show !== state.show) {
      if (props.show) {
        newState = {
          ...newState,
          show: true,
          shouldDismissBottomSheet: false
        };
      } else {
        newState = {
          ...newState,
          shouldDismissBottomSheet: true
        };
      }
    }

    if (props.contentHeight !== state.contentHeight && props.show) {
      newState.contentHeight = props.contentHeight;
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    const maxAvailableContentHeight = this.getMaxAvailableContentHeight();

    if (prevState.shouldDismissBottomSheet !== this.state.shouldDismissBottomSheet && this.state.shouldDismissBottomSheet) {
      this.dismissBottomSheet();
    }

    if (this.state.contentHeight !== prevState.contentHeight && this.state.show) {
      this.setBottomSheetHeight(this.state.contentHeight);
    }

    if (this.state.contentHeight > maxAvailableContentHeight) {
      showWarning(`Given content height (${this.state.contentHeight}), exceeds maximum available content height (${maxAvailableContentHeight}).
      Falling back to maximum available content height.`);
    }
  }

  render() {
    const { renderContent, items } = this.props;
    const { show } = this.state;

    if (!show) {
      return null;
    }

    if (!renderContent && _isEmpty(items)) {
      return null;
    }

    return (
      <TouchableHighlight
        style={styles.container}
        pointerEvents={'box-none'}
        onPress={this.dismissBottomSheet}
        underlayColor="transparent"
        activeOpacity={1}
      >
        <View style={styles.panelContainer} pointerEvents={'box-none'}>
          {this.renderBottomSheetAnimatableBackground()}
          {this.renderBottomSheetPanel()}
        </View>
      </TouchableHighlight>
    );
  }

  renderBottomSheetAnimatableBackground = () => (
    <Animated.View
      pointerEvents={'box-none'}
      style={[styles.panelContainer, {
        backgroundColor: ANIMATABLE_BACKGROUND_COLOR,
        opacity: this.deltaY.interpolate({
          inputRange: [this.state.panelTopMargin, this.props.maximumPanelTopMargin],
          outputRange: [0.6, 0],
        })
      }]}
    />
  );

  renderBottomSheetPanel = () => (
    <Interactable.View
      ref={(interactableViewRef) => { this.interactableViewRef = interactableViewRef; }}
      verticalOnly
      snapPoints={[{ y: this.state.panelTopMargin, tension: 200 }, { y: this.props.maximumPanelTopMargin, tension: 200 }]}
      initialPosition={{ y: this.props.maximumPanelTopMargin }}
      animatedValueY={this.deltaY}
      boundaries={{ top: this.state.panelTopMargin }}
      dragEnabled={this.props.dragEnabled}
      onSnap={this.onSnap}
      alertAreas={[{ id: 'dismissArea', influenceArea: { top: this.props.maximumPanelTopMargin - 10 } }]}
      onAlert={this.onAlert}
      animatedNativeDriver // whether integration with Animated should use native driver
    >
      <Button hasTouchFeedback={false} onPress={_noop} style={styles.grow} onLayout={this.onPanelLayout}>
        {this.renderPanel()}
      </Button>
    </Interactable.View>
  );

  renderPanel = () => {
    const { renderContent, panelStyle } = this.props;
    const contentView = renderContent || this.renderContent;
    return (
      <View style={[styles.panel, panelStyle, { height: this.props.maximumPanelTopMargin - this.state.panelTopMargin }]}>
        {this.renderPanelHeader()}
        {contentView()}
        {this.renderPanelFooter()}
      </View>
    );
  };

  renderPanelHeader = () => {
    const { title, titleStyle, renderHeader } = this.props;

    if (!renderHeader && !title) {
      return null;
    }

    if (renderHeader) {
      return (
        <View onLayout={this.onPanelHeaderLayout}>
          {renderHeader()}
        </View>
      );
    }
    return (
      <View style={styles.panelHeader} onLayout={this.onPanelHeaderLayout}>
        <View style={styles.panelHandle} />
        {title && <Text style={[styles.panelTitle, titleStyle]}>{title}</Text>}
      </View>
    );
  };

  renderContent = () => {
    const { items, renderRow, renderContentHeader, renderContentFooter } = this.props;

    const contentRow = renderRow || this.renderRow;

    const content = _map(items, (item, index) => (
      contentRow(item, index)
    ));

    return (
      <ScrollView
        ref={(scrollViewRef) => { this.scrollViewRef = scrollViewRef; }}
        style={styles.grow}
        scrollEnabled={false}
        onScroll={this.onScroll}
        scrollEventThrottle={64}
        showsVerticalScrollIndicator={false}
        overScrollMode={'never'} // For android
      >
        <View onLayout={this.onScrollViewContentLayout} style={styles.grow}>
          {renderContentHeader()}
          {content}
          {renderContentFooter()}
        </View>
      </ScrollView>
    );
  };


  renderRow = item => (
    <Button key={item.key} onPress={item.onPress || _noop}>
      <View style={styles.rowContainer}>
        {this.renderImage(item.image)}
        <Text style={item.image ? styles.rowLabelWithImage : styles.rowLabel}>{item.label}</Text>
      </View>
    </Button>
  );

  renderImage = (url) => {
    if (!url) {
      return null;
    }

    return (
      <Image
        source={{ uri: url }}
        style={styles.image}
      />
    );
  };

  renderPanelFooter = () => {
    const { renderFooter } = this.props;
    if (!renderFooter) {
      return null;
    }

    return (
      <View onLayout={this.onPanelFooterLayout}>
        {renderFooter()}
      </View>
    );
  };

  onPanelLayout = () => {
    if (this.contentHeight === 0) {
      const contentHeightFromProps = _get(this.props, 'contentHeight');
      this.contentHeight = this.getContentHeight(contentHeightFromProps);
    }
    this.updatePanelTopMargin();
  };

  onPanelHeaderLayout = (event) => {
    this.panelHeaderHeight = _get(event, 'nativeEvent.layout.height', 0);
  };

  onPanelFooterLayout = (event) => {
    this.panelFooterHeight = _get(event, 'nativeEvent.layout.height', 0);
  };

  onScroll = (event) => {
    const { disableScrollOffset } = this.props;
    const scrollVerticalOffset = event.nativeEvent.contentOffset.y;
    if (scrollVerticalOffset <= disableScrollOffset) {
      this.interactableViewRef.snapTo({ index: SNAP_POINTS_INDEX.DISMISS_SHEET });
    }
  };

  onScrollViewContentLayout = (event) => {
    if (this.props.contentHeight <= 0) {
      this.contentHeight = _get(event, 'nativeEvent.layout.height', 0);
    }
  };

  onAlert = (event) => { // TODO: Generalize onAlert logic
    if (this.currentSnap === SNAP_POINTS_INDEX.MAXIMUM_POSITION && event.nativeEvent.dismissArea === DISMISS_AREA.ENTER) {
      this.currentSnap = SNAP_POINTS_INDEX.DISMISS_SHEET;
      this.setScrollViewState(false);
      this.panelHeaderHeight = 0;
      this.contentHeight = 0;
      this.panelFooterHeight = 0;
      this.setState({
        panelTopMargin: this.props.minimumPanelTopMargin,
        show: false
      }, () => {
        this.props.onDismiss();
      });
    } else if (this.currentSnap === SNAP_POINTS_INDEX.DISMISS_SHEET && event.nativeEvent.dismissArea === DISMISS_AREA.LEAVE) {
      this.currentSnap = SNAP_POINTS_INDEX.MAXIMUM_POSITION;
      this.setScrollViewState(true);
    }
  };

  onSnap = () => {
    // TODO: Add functionalities on Snap event
  };

  dismissBottomSheet = () => {
    if (this.interactableViewRef) {
      this.interactableViewRef.snapTo({ index: SNAP_POINTS_INDEX.DISMISS_SHEET });
    }
  };

  scrollToCurrentTopMarginPosition = () => {
    requestAnimationFrame(() => {
      if (this.interactableViewRef) {
        this.interactableViewRef.snapTo({ index: SNAP_POINTS_INDEX.MAXIMUM_POSITION });
      }
    });
  };

  getMaxAvailableContentHeight = () => (this.props.maximumPanelTopMargin - (this.props.minimumPanelTopMargin + this.panelHeaderHeight + this.panelFooterHeight));

  getContentHeight = (contentHeight) => {
    if (contentHeight > 0) {
      return contentHeight;
    }

    if (this.props.renderContent) {
      return this.getMaxAvailableContentHeight();
    }

    return this.contentHeight;
  };

  setBottomSheetHeight = (contentHeight) => {
    this.contentHeight = this.getContentHeight(contentHeight);
    this.updatePanelTopMargin();
  };

  setScrollViewState = (state) => {
    if (this.scrollViewRef) {
      this.scrollViewRef.setNativeProps({
        scrollEnabled: state,
      });
    }
  };

  shouldOpenBottomSheet = (updatedPanelTopMargin) => {
    const { minimumPanelTopMargin } = this.props;
    const curentPanelTopMargin = this.state.panelTopMargin;

    return (
      // if bottom sheet current state is dismissed state
      this.currentSnap === SNAP_POINTS_INDEX.DISMISS_SHEET

      // if currentTopMargin is equal to initial declared state
      && curentPanelTopMargin === minimumPanelTopMargin

      // if the bottom sheet content height is large, the new panel margin will be less than or equal to the minimumPanelTopMargin
      // and hence there is no need to update panelTopMargin, so just scroll to the panelTopMargin position
      && updatedPanelTopMargin <= minimumPanelTopMargin
    );
  };

  shouldScrollToNewPosition = () => {
    const { shouldScrollToNewPosition } = this.props;

    return shouldScrollToNewPosition || this.currentSnap === SNAP_POINTS_INDEX.DISMISS_SHEET;
  };

  updatePanelTopMargin = () => {
    const { minimumPanelTopMargin } = this.props;
    const panelTopMargin = this.props.maximumPanelTopMargin - (this.contentHeight + this.panelHeaderHeight + this.panelFooterHeight);
    if (this.shouldOpenBottomSheet(panelTopMargin)) {
      this.scrollToCurrentTopMarginPosition();
    } else if (panelTopMargin >= minimumPanelTopMargin && panelTopMargin !== this.state.panelTopMargin) {
      this.setState({
        panelTopMargin,
      }, this.shouldScrollToNewPosition() && this.scrollToCurrentTopMarginPosition);
    } else if (panelTopMargin < minimumPanelTopMargin && this.state.panelTopMargin !== minimumPanelTopMargin) {
      this.setState({
        panelTopMargin: minimumPanelTopMargin,
      }, this.shouldScrollToNewPosition() && this.scrollToCurrentTopMarginPosition);
    }
  }
}

BottomSheet.propTypes = {
  // show: PropTypes.bool, // TODO: uncomment this.
  title: PropTypes.string,
  onDismiss: PropTypes.func,
  renderRow: PropTypes.func,
  dragEnabled: PropTypes.bool,
  renderHeader: PropTypes.func,
  renderFooter: PropTypes.func,
  panelStyle: ComponentPropTypes.View.style,
  contentHeight: (props, propName, componentName) => {
    if (props.contentHeight > SCREEN_HEIGHT) {
      showWarning(`contentHeight cannot be more than device screen height in '${componentName}'.`);
    }
    if (props.contentHeight < 0) {
      showWarning(`contentHeight cannot be negative in '${componentName}'.`);
    }
    if (typeof props.contentHeight !== 'number') {
      showWarning(`Invalid prop '${propName}' of type '${typeof props.contentHeight}' supplied to '${componentName}', expected 'number'`);
    }
  },
  titleStyle: ComponentPropTypes.Text.style,
  renderContentFooter: PropTypes.func,
  renderContentHeader: PropTypes.func,
  disableScrollOffset: PropTypes.number,
  maximumPanelTopMargin: PropTypes.number,
  minimumPanelTopMargin: (props, propName, componentName) => {
    if (props.maximumPanelTopMargin < props.minimumPanelTopMargin) {
      showWarning(`maximumPanelTopMargin can not be less than minimumPanelTopMargin in '${componentName}'.`);
    }
    if (typeof props.maximumPanelTopMargin !== 'number') {
      showWarning(`Invalid prop '${propName}' of type '${typeof props.maximumPanelTopMargin}' supplied to '${componentName}', expected 'number'`);
    }
  },
  shouldScrollToNewPosition: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    image: PropTypes.string
  })),
  renderContent: (props, propName, componentName) => {
    if (!props.renderContent && _isEmpty(props.items)) {
      showWarning(`One of props 'items' or 'renderContent' was not specified in '${componentName}'.`);
    }
  }
};

BottomSheet.defaultProps = {
  title: '',
  items: [],
  show: false,
  titleStyle: {},
  panelStyle: {},
  renderRow: null,
  onDismiss: _noop,
  contentHeight: 0,
  dragEnabled: true,
  renderHeader: null,
  renderFooter: null,
  renderContent: null,
  disableScrollOffset: -50,
  renderContentHeader: _noop,
  renderContentFooter: _noop,
  shouldScrollToNewPosition: true,
  maximumPanelTopMargin: SCREEN_HEIGHT,
  minimumPanelTopMargin: WINDOW_HEIGHT / 4,
};

module.exports = polyfill(BottomSheet);
