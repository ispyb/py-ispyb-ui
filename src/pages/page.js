import React from 'react';
import Menu from './menu/menu';

export default function Page(props) {
  return (
    <>
      <Menu />
      <div style={{ fontSize: 13, marginTop: 120, marginRight: 10, marginLeft: 10 }}>{props.children}</div>
    </>
  );
}
