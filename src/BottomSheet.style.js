import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1
  },
  shrink: {
    flexShrink: 1
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  panelContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  panel: {
    flexGrow: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4
  },
  panelHeader: {
    paddingTop: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dcdce0'
  },
  panelHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e6e6ed',
    marginBottom: 10
  },
  panelTitle: {
    fontSize: 12,
    color: '#82828c',
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontWeight: '500'
  },
  rowContainer: {
    flexGrow: 1,
    height: 60,
    marginHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dcdce0',
    alignItems: 'center',
    flexDirection: 'row'
  },
  rowLabelWithImage: {
    fontSize: 15,
    color: '#373741',
    paddingLeft: 12
  },
  rowLabel: {
    fontSize: 15,
    color: '#373741',
  },
  image: {
    height: 32,
    width: 32,
    borderRadius: 16
  },
  footer: {
    height: ifIphoneX(34, 0),
  }
});

module.exports = styles;
