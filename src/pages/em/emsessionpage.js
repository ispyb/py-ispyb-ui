import React from 'react';
import { useParams } from 'react-router-dom';

export default function EMSessionPage() {
  let params = useParams();
  alert(params.sessionId);
  return <div>EMSessionPage</div>;
}
