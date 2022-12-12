import { useController } from 'rest-hooks';
import { SignResource } from 'api/resources/Sign';
import { MouseEventHandler } from 'react';

/**
 * Generate a one time token to sign a url
 */
export function useSign() {
  const { fetch } = useController();

  /**
   * Sign a url and return the onetime token
   * @param {{ url: string }} - the url to sign
   * @returns {string} - the onetime token
   */
  async function sign({ url }: { url: string }) {
    const resource = await fetch(SignResource.create(), {}, { validity: url });
    return resource.token;
  }

  /**
   * Sign a href from an anchor automatically and redirect to the new url
   * @example <a href="/link/to/file" onClick={signHandler}>link</a>
   * @param {MouseEventHandler<HTMLAnchorElement, MouseEvent>} e - the mouse event
   */
  async function signHandler(
    // @ts-ignore
    e: MouseEventHandler<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    const target = e.target as HTMLAnchorElement;
    const link = target.tagName === 'A' ? target : target.closest('a');

    if (link) {
      const token = await sign({ url: link.href });
      window.location.href = `${link.href}?onetime=${token}`;
    }
  }

  return {
    sign: sign,
    signHandler: signHandler,
  };
}
