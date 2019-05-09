import { useRelax } from 'iflux';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Hello() {
  const { text, count } = useRelax<{ text: string; count: number }>([
    'text',
    'count'
  ]);

  return (
    <div>
      {text}
      <Link to='/like'>Like {count}</Link>
    </div>
  );
}
