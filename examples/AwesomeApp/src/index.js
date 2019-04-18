import { Provider } from 'iflux';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Like from './component/like';
import store from './store';

export default function LikeApp() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Like />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
