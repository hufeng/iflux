import { useRelax } from 'iflux';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Hello() {
  const { text, like } = useRelax<{ text: string; like: number }>([
    'text',
    '@like.like'
  ]);

  return (
    <div>
      {text}
      <Link to='/like'>Like {like}</Link>
    </div>
  );
}
