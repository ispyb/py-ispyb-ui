import { useLocation } from 'react-router';

export default function useQueryParams() {
  const dict = {};
  for (const [key, value] of new URLSearchParams(useLocation().search).entries()) {
    dict[key] = value;
  }
  return dict;
}
