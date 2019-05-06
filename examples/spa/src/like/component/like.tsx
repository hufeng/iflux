import { useRelax } from 'iflux';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Command } from '../command';

function Like(props: any) {
  const { like, dispatch } = useRelax<{ like: number }>(['like']);

  return (
    <div>
      <a
        href={'javascript:void(0);'}
        onClick={() => dispatch(Command.INCREMENT)}
      >
        {`点赞🔥 ${like} `}
      </a>

      <div>
        <a href={'javascript:void(0);'} onClick={props.history.goBack}>
          返回hello
        </a>
      </div>
    </div>
  );
}

export default withRouter(Like);
