import React from 'react';
import { TouchableOpacity, Text, View, Dimensions, ScrollView, Image } from 'react-native';
import BottomSheet from 'react-native-bottom-sheet';

import _map from 'lodash/map';

import styles from './App.style';


const screenHeight = Dimensions.get('window').height;

const items = [{
  image: 'https://static.pexels.com/photos/39803/pexels-photo-39803.jpeg',
  label: 'Apple',
  key: 'Apple'
}, {
  image: 'https://www.premierleague.com/resources/ver//i/nike-ball-hub/index/9.png',
  label: 'Ball',
  key: 'Ball'
}, {
  image: 'https://www.petfinder.com/wp-content/uploads/2012/11/91615172-find-a-lump-on-cats-skin-632x475.jpg',
  label: 'Cat',
  key: 'Cat'
}, {
  image: 'https://www.what-dog.net/Images/faces2/scroll0015.jpg',
  label: 'Dog',
  key: 'Dog'
}, {
  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/African_Forest_Elephant.jpg/220px-African_Forest_Elephant.jpg',
  label: 'Elephant',
  key: 'Elephant'
}, {
  image: 'https://www.takemefishing.org/tmf/assets/images/fish/american-shad-464x170.png',
  label: 'Fish',
  key: 'Fish'
}];

const bottomSheetTypes = [
  'Bottom sheet without render row',
  'Bottom sheet with render row and title',
  'Bottom sheet with render row and header',
  'Bottom sheet with content and title',
  'Bottom sheet with content and header',
  'Bottom sheet with only content',
  'Bottom sheet with render row and title and multiple snap points',
  'Bottom sheet with render row and title and fixed multiple snap points',
  'Bottom sheet render content and fixed multiple snap points',
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.selectedButton = 0;
    this.state = {
      showBottomSheet: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {bottomSheetTypes.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <TouchableOpacity onPress={() => this.onPressBottomSheetButton(index)} key={index}>
            <View style={styles.bottomSheetButton}><Text>{item}</Text></View>
          </TouchableOpacity>
        ))}
        {this.renderBottomSheet()}
      </View>
    );
  }

  renderBottomSheet = () => {
    switch (this.selectedButton) {
      case 0: {
        return (
          <BottomSheet
            items={items}
            show={this.state.showBottomSheet}
            title={'Alphabets'}
            onDismiss={this.dismissBottomSheet}
          />
        );
      }

      case 1: {
        return (
          <BottomSheet
            items={items}
            show={this.state.showBottomSheet}
            title={'Alphabets'}
            onDismiss={this.dismissBottomSheet}
            renderRow={this.renderBottomSheetRow}
          />
        );
      }

      case 2: {
        return (
          <BottomSheet
            renderRow={this.renderBottomSheetRow}
            items={items}
            show={this.state.showBottomSheet}
            renderHeader={this.renderBottomSheetHeader}
            onDismiss={this.dismissBottomSheet}
          />
        );
      }

      case 3: {
        return (
          <BottomSheet
            renderContent={this.renderBottomSheetContent}
            contentHeight={this.state.contentHeight}
            show={this.state.showBottomSheet}
            title={'Alphabets'}
            onDismiss={this.dismissBottomSheet}
          />
        );
      }

      case 4: {
        return (
          <BottomSheet
            renderContent={this.renderBottomSheetContent}
            contentHeight={this.state.contentHeight}
            show={this.state.showBottomSheet}
            onDismiss={this.dismissBottomSheet}
            renderHeader={this.renderBottomSheetHeader}
          />
        );
      }

      case 5: { // To render your content, do not send renderHeader and title
        return (
          <BottomSheet
            renderContent={this.renderBottomSheetContent}
            contentHeight={this.state.contentHeight}
            show={this.state.showBottomSheet}
            onDismiss={this.dismissBottomSheet}
          />
        );
      }

      case 6: {
        return (
          <BottomSheet
            items={items}
            show={this.state.showBottomSheet}
            title={'Alphabets'}
            onDismiss={this.dismissBottomSheet}
            renderRow={this.renderBottomSheetRow}
            additionalSnapPoints={1}
          />
        );
      }

      case 7: {
        return (
          <BottomSheet
            items={items}
            show={this.state.showBottomSheet}
            title={'Alphabets'}
            onDismiss={this.dismissBottomSheet}
            renderRow={this.renderBottomSheetRow}
            additionalSnapPoints={[600]}
            initialSnapPointIndex={1}
          />
        );
      }

      case 8: {
        return (
          <BottomSheet
            items={items}
            show={this.state.showBottomSheet}
            onDismiss={this.dismissBottomSheet}
            renderContent={this.renderMultipleSnapPointContent}
            additionalSnapPoints={[screenHeight - 70]}
            initialSnapPointIndex={1}
          />
        );
      }

      default: {
        return null;
      }
    }
  };

  renderBottomSheetContent = () => (
    <ScrollView style={styles.grow}>
      <View style={styles.grow} onLayout={this.onLayout}>
        {_map(items, item => this.renderBottomSheetRow(item))}
      </View>
    </ScrollView>
  );

  renderBottomSheetRow = item => (
    <TouchableOpacity key={item.key} onPress={() => {}}>
      <View style={styles.rowContainer}>
        <Text style={styles.rowLabel}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  renderBottomSheetHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={this.dismissBottomSheet}>
        <View><Text style={styles.headerButton}>{'Cancel'}</Text></View>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{'CUSTOM HEADER'}</Text>
      <TouchableOpacity onPress={this.dismissBottomSheet}>
        <View><Text style={styles.headerButton}>{'Save'}</Text></View>
      </TouchableOpacity>
    </View>
  );

  renderMultipleSnapPointContent = ({ scrollHandlers }) => (
    <ScrollView style={styles.grow} {...scrollHandlers}>
      <ScrollView horizontal>
        {_map(items, item => (
          <TouchableOpacity key={`bubble-${item.key}`}>
            <View style={styles.bubbleContainer}>
              <Image source={{ uri: item.image }} style={styles.bubble} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.grow} onLayout={this.onLayout}>
        {_map(items, item => this.renderBottomSheetRow(item))}
      </View>
    </ScrollView>
  );


  onPressBottomSheetButton = (index) => {
    this.selectedButton = index;
    this.setState({
      showBottomSheet: true,
    });
  };

  dismissBottomSheet = () => {
    this.selectedButton = null;
    this.setState({
      showBottomSheet: false,
      contentHeight: 0
    });
  }
}
