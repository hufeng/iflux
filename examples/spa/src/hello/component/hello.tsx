import { useRelax } from 'iflux';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Hello() {
  const { text } = useRelax<{ text: string }>(['text']);

  return (
    <div>
      {text}
      <Link to='/like'>Like</Link>
    </div>
  );
}
