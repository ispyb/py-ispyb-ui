import React from 'react';
import { useParams } from 'react-router-dom';
import { useSession } from 'hooks/ispyb';

export default function EMSessionPage() {
  let params = useParams();
  const { data, error } = useSession(params.sessionId);

  console.log(data);
  if (error) throw Error(error);
  return <div>{data.length}</div>;
}
