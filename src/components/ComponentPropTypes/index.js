/* eslint-disable react/forbid-foreign-prop-types */
import { View, Text } from 'react-native';

module.exports = {
  View: require('react-native').ViewPropTypes || View.propTypes,
  Text: require('react-native').TextPropTypes || Text.propTypes,
};
