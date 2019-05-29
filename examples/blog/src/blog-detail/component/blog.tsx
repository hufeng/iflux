import { useRelax } from 'iflux';
import React from 'react';

export default function Blog() {
  const { title, content } = useRelax(['title', 'content'], 'Blog');

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}
