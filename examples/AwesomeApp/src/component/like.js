import { useRelax } from 'iflux';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Like() {
  const { count, setState } = useRelax(['count']);

  const inc = () =>
    setState(state => {
      state.count++;
    });

  const dec = () =>
    setState(state => {
      state.count--;
    });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={dec}>
        <Text>-</Text>
      </TouchableOpacity>

      <Text>❤️{count}</Text>

      <TouchableOpacity onPress={inc}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  }
});
