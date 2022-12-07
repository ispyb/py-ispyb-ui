import { CSSProperties } from 'react';
import { Container } from 'react-bootstrap';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import routes, { TitledBreadcrumbsRoute } from 'routes';

interface CustomCSS extends CSSProperties {
  '--bs-breadcrumb-divider': string;
}

export default function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs(routes);

  document.title =
    'ISPyB  » ' +
    breadcrumbs
      .map(({ match }) => {
        const route: TitledBreadcrumbsRoute | undefined = match.route;
        if (route?.titleBreadcrumb) return route.titleBreadcrumb({ match });
        return route?.breadcrumb;
      })
      .join(' » ');

  return (
    <div className="breadcrumbs sticky-top">
      <Container>
        <nav
          style={{ '--bs-breadcrumb-divider': "'»'" } as CustomCSS}
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb mb-0 p-0">
            {breadcrumbs.map(({ breadcrumb }, bid) => (
              <li
                key={`bread-${bid}`}
                className="breadcrumb-item"
                aria-current="page"
              >
                {breadcrumb}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </div>
  );
}
