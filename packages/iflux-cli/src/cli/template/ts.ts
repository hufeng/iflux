import { tpl } from './index';

// TODO 模板使用prettier自动格式化最终的代码

//=================================app template ===========================
const simpleRnWrapper = (str: string) => {
  return `
    <View style={styles.container}>
      <Text>${str}</Text>
    </View>
  `;
};

export const tsIndex = tpl`
import React from 'react';
import {Provider, Store} from 'iflux';
import store from './store';
import Text from './component/text';

export default function ${props => props.appName}() {
  const onInit = (store: Store) => store.dispatch('onInit');
  
  return (
    <Provider store={store} onMounted={onInit}>
      <Text/>
    </Provider>
  );
}
`;

export const tsStore = tpl`
  import {createStore} from 'iflux';
  import * as action from './action';

  export interface IState {
    text: string;
    loading: boolean;
  }

  export default createStore<IState>({
    action,
    state: {
      loading: true,
      text: 'hello ${props => props.appName}'
    }
    
  })
`;

export const tsRelax = tpl`
  import React from 'react';
  import {useRelax} from 'iflux';
  ${(props: any) => {
    if (props.target === 'rn') {
      return `
import {View, Text, StyleSheet} from 'react-native';
      `;
    } else {
      return '';
    }
  }}

  interface IRelax {
    loading: boolean;
    text: string;
  }

  export default function ${props => props.relaxName}() {
    const {text, loading} = useRelax<IRelax>(['loading', 'text']);

    return (${(props: any) => {
      if (props.target === 'web') {
        return '<div>{loading ? "loading...": text}</div>';
      } else if (props.target === 'rn') {
        return simpleRnWrapper('{loading ? "loading...": text}');
      }
      return '';
    }})
  }

  ${(props: any) => {
    if (props.target === 'rn') {
      return `
      const styles = StyleSheet.create({
        container:{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }
      })
      `;
    } else {
      return '';
    }
  }}
`;

export const tsAction = tpl`
  import {action, Store} from 'iflux';
  import {IState} from './store';

  export const onInit = action('onInit', (store: Store<IState>) => {
    //send request to server
    //....
    store.setState(state => {
      state.loading = false;
    })
    
  });
`;
