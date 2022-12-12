import { render } from '@testing-library/react';
import App from './App';
import SuspenseRouter from './SuspenseRouter';

test('render app', () => {
  render(
    <SuspenseRouter>
      <App />
    </SuspenseRouter>
  );
});
