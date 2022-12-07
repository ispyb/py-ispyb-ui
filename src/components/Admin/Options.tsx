import { useRef } from 'react';
import { useSuspense } from 'rest-hooks';
import { Alert, Button, Spinner } from 'react-bootstrap';
import Form from 'components/RJSF/Form';

import { OptionsResource } from 'api/resources/Options';
import { useSchema } from 'hooks/useSpec';
import { useInformativeSubmit } from 'hooks/useInformativeSubmit';
import ParsedError from 'components/ParsedError';

export default function Options() {
  const optionsSchema = useSchema('Options', 'Admin Options');
  const options = useSuspense(OptionsResource.detail(), {});
  const uiSchema = {};
  const alertRef = useRef<HTMLDivElement | undefined>();
  const successRef = useRef<HTMLDivElement | null>(null);

  const { onSubmit, pending, error, success, lastFormData } =
    useInformativeSubmit({
      resource: OptionsResource,
      alertRef,
      successRef,
      method: 'partialUpdate',
      initialFormData: options,
    });

  return (
    <section>
      {success && (
        <Alert variant="success" ref={successRef}>
          Options updated
        </Alert>
      )}
      <ParsedError error={error} ref={alertRef} />
      <Form
        liveValidate
        schema={optionsSchema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        formData={lastFormData}
        disabled={pending}
      >
        <div className="d-grid">
          <Button type="submit" disabled={pending}>
            <>
              {pending && (
                <Spinner
                  size="sm"
                  animation="border"
                  role="status"
                  variant="light"
                  className="me-1"
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              Save Options
            </>
          </Button>
        </div>
      </Form>
    </section>
  );
}
