import { render, screen } from '@testing-library/react';
import { LayeraProvider } from 'layera';
import App from './App';

test('renders the employee directory heading', () => {
  render(
    <LayeraProvider>
      <App />
    </LayeraProvider>
  );
  expect(screen.getByText(/Employee Directory/i)).toBeInTheDocument();
});
