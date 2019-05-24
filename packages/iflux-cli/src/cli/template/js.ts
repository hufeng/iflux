import { tpl } from './index';

//=================================app template ===========================
// const simpleRnWrapper = str => {
//   return `
//     <View style={styles.container}>
//       <Text>${str}</Text>
//     </View>
//   `;
// };

export const jsIndex = tpl`
import React from 'react';
import {Provider} from 'iflux';
import store from './store';
import Text from './component/text';

export default function ${props => props.appName}() {
  const onInit = (store) => store.dispatch('onInit');
  
  return (
    <Provider store={store} onMounted={onInit}>
      <Text/>
    </Provider>
  );
}
`;

export const jsStore = tpl`
  import {createStore} from 'iflux';
  import * as action from './action';

  export default createStore({
    action,
    state: {
      loading: true,
      text: 'hello ${props => props.appName}'
    }
  })
`;

export const jsRelax = tpl`
  import React from 'react';
  import {useRelax} from 'iflux';

  ${(props: any) => {
    if (props.target === 'rn') {
      return "import {View, Text, StyleSheet} from 'react-native'";
    }
    return '';
  }}

  export default function ${props => props.relaxName}() {
    const {text, loading} = useRelax(['loading', 'text']);

    return ${(props: any) => {
      if (props.target === 'web') {
        return '<div>{loading ? "loading..." : text}</div>';
      } else if (props.target === 'rn') {
        return '<View style={styles.container}><Text>{loading ? "loadiing" : text}</Text></View>';
      }
      return '';
    }}
  }

  ${(props: any) => {
    if (props.target === 'rn') {
      return `const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }
      })`;
    }
    return '';
  }}

`;

export const jsAction = tpl`
  import {action} from 'iflux';

  export const onInit = action('onInit', (store) => {
    //send request to server
    //....
    store.setState(state => {
      state.loading = false;
    })
    
  });
`;
