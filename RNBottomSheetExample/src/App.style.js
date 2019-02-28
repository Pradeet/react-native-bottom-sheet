import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    height: 100,
    width: 100
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
  rowLabel: {
    fontSize: 15,
    color: '#373741',
  },
  grow: {
    flexGrow: 1
  },
  headerContainer: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dcdce0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16
  },
  headerTitle: {
    fontSize: 12,
    color: '#82828c',
    alignSelf: 'center',
    fontWeight: '500'
  },
  headerButton: {
    fontSize: 16,
    color: '#40a3f5',
    alignSelf: 'center',
    fontWeight: '500'
  },
  bottomSheetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  bubble: {
    height: 50,
    width: 50,
    margin: 10,
    borderRadius: 25
  },
  bubbleContainer: {}
});

module.exports = styles;
