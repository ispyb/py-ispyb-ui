import { useState } from 'react';
import { useNavigate } from 'react-router';
import { NetworkError, useController } from 'rest-hooks';

interface SubmitData {
  /**
   * The resource to create
   */
  resource: any;
  /**
   * Any initial form parameters
   */
  initialFormData: {};
  /**
   * A reference to an alert box to show errors
   */
  alertRef: any;
  /**
   * A reference to an alert box to show success
   */
  successRef?: any;
  /**
   * Timeout to reset success to false
   */
  successTimeout?: number;
  /**
   * Url to redirect
   */

  redirect?: string;
  /**
   * Primary key to append to the url when redirecting
   */
  redirectKey?: string;
  /**
   * The method to call on the resource, default 'create'
   */
  method?: string;
}

/**
 * Create a new resource in an informative way
 *  * Set pending state
 *  * Catch errors
 *  * Redirect
 * @param {SubmitData}
 * @returns
 */
export function useInformativeSubmit({
  resource,
  initialFormData,
  alertRef,
  successRef,
  successTimeout = 5000,
  redirect,
  redirectKey,
  method = 'create',
}: SubmitData) {
  const [lastFormData, setLastFormData] = useState<Record<string, any>>({
    ...initialFormData,
  });
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<NetworkError>();
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const { fetch } = useController();

  const onSubmit = ({ formData }: { formData: {} }) => {
    setPending(true);
    setError(undefined);
    setLastFormData(formData);

    fetch(resource[method](), {}, formData)
      .then((response: any) => {
        setTimeout(() => setPending(false), 500);
        if (redirect && redirectKey)
          navigate(`${redirect}/${response[redirectKey]}`);
        setSuccess(true);
        if (successRef) {
          setTimeout(() => {
            successRef.current?.scrollIntoView(true);
          }, 500);
        }
        setTimeout(() => {
          setSuccess(false);
        }, successTimeout);
      })
      .catch((err: NetworkError) => {
        setTimeout(() => {
          setPending(false);
          setError(err);
          setTimeout(() => {
            alertRef.current?.scrollIntoView(true);
          }, 500);
        }, 500);
      });
  };
  return { onSubmit, pending, error, success, lastFormData };
}
