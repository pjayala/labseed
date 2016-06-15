import * as React from 'react';
import { Link } from 'react-router';

export const App = ({ content }) => (
  <div>
    <h1>Plant Seeds</h1>
    <Link to={{ pathname: `/` }}>Seeds</Link>
    |
    <Link to={{ pathname: `/users` }}>Users</Link>
    <div className='Content'>
      {content}
    </div>
  </div>
);
