import { useRelax } from 'iflux';
import React from 'react';

export default function Blog() {
  const { title, content } = useRelax(['title', 'content'], 'Blog');
  console.log('title->', title);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}
