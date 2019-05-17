export const tpl = (strs: TemplateStringsArray, ...value: Array<Function>) => {
  return (props: Object) => {
    const merge = [] as Array<any>;
    const params = value.map(v => v(props));
    const pLen = params.length;
    const sLen = strs.length;

    for (let i = 0; i < sLen; i++) {
      merge.push(strs[i]);
      if (i < pLen) {
        merge.push(params[i]);
      }
    }

    return merge.join('');
  };
};
