import { TRelaxProps, useRelax } from 'iflux';
import React from 'react';
import { IState } from '../store';

let id = 0;

export default function Editor(props) {
  const { title, content, setState, dispatch } = useRelax<TRelaxProps<IState>>([
    'title',
    'content'
  ]);

  const onChange = (type: string) => (e: any) =>
    setState(state => {
      state[type] = e.target.value;
    });

  const onSubmit = () => {
    //global dispatch
    dispatch(
      'blog-new-save',
      {
        id: ++id,
        title,
        content
      },
      true
    );
    props.history.goBack();
  };

  return (
    <div>
      <div>
        <label htmlFor='title'>title</label>
        <br />
        <input
          type='text'
          name='title'
          value={title}
          onChange={onChange('title')}
        />
      </div>
      <div>
        <label htmlFor='content'>content</label>
        <br />
        <textarea
          name='content'
          value={content}
          onChange={onChange('content')}
        />
      </div>
      <button type='submit' onClick={onSubmit}>
        Save
      </button>
    </div>
  );
}
