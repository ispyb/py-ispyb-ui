import { useLayoutEffect, useRef, useState, useTransition } from 'react';
import { Router } from 'react-router-dom';
import { BrowserHistory, createBrowserHistory, Update } from 'history';

import { IsLoadingContext } from 'isLoadingContext';

// // https://github.com/ntucker/anansi/tree/master/packages/router
// // https://stackoverflow.com/questions/66039626/react-lazy-suspens-react-router-dont-change-route-until-component-is-fetched
// // https://stackoverflow.com/questions/69859509/cannot-read-properties-of-undefined-reading-pathname-when-testing-pages-in

export interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}

export function SuspenseRouter({
  basename,
  children,
  window,
}: BrowserRouterProps) {
  let historyRef = useRef<BrowserHistory>();
  const [isPending, startTransition] = useTransition();

  if (historyRef.current === undefined) {
    //const history = createBrowserHistory(startTransition, { window });
    historyRef.current = createBrowserHistory({ window });
  }

  let history = historyRef.current;
  let [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  function setStateAsync(update: Update) {
    startTransition(() => {
      setState(update);
    });
  }

  useLayoutEffect(() => history.listen(setStateAsync), [history]);

  return (
    <Router
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      <IsLoadingContext.Provider value={isPending}>
        {children}
      </IsLoadingContext.Provider>
    </Router>
  );
}
export default SuspenseRouter;
