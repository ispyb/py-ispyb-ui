import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useAuth } from 'hooks/useAuth';
import NotificationToast from 'legacy/components/notification/notificationtoast';
import { useState } from 'react';
import { Anchor, Dropdown, Spinner } from 'react-bootstrap';

export default function DownloadOptions({
  title,
  options,
}: {
  title: string;
  options: { href: string; fileName: string; title: string; icon?: IconProp }[];
}) {
  const { site, token } = useAuth();
  const [notif, setNotif] = useState<JSX.Element | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);

  const download = (href: string, fileName: string) => {
    setDownloading(true);
    axios({
      url: href,
      method: 'GET',
      responseType: 'blob',
    }).then(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        setDownloading(false);
      },
      (error) => {
        console.error(error);
        setDownloading(false);
        setNotif(
          <NotificationToast
            type="error"
            message={`Could not download ${fileName}`}
            onClose={() => setNotif(undefined)}
          ></NotificationToast>
        );
      }
    );
  };

  return (
    <>
      {notif}
      <Dropdown>
        <Dropdown.Toggle
          disabled={downloading}
          size="sm"
          variant="primary"
          style={{ marginRight: 2, marginLeft: 2 }}
        >
          {downloading ? (
            <Spinner style={{ marginRight: 5 }} animation="border" size="sm" />
          ) : (
            <FontAwesomeIcon
              icon={faDownload}
              style={{ marginRight: 5 }}
            ></FontAwesomeIcon>
          )}
          {title}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {options.map((option) => {
            const fullUrl = `${site.host}${site.apiPrefix}/${token}${option.href}`;
            return (
              <Dropdown.Item
                as={Anchor}
                onClick={() => download(fullUrl, option.fileName)}
              >
                {option.icon && (
                  <FontAwesomeIcon
                    icon={option.icon}
                    style={{ marginRight: 5 }}
                  ></FontAwesomeIcon>
                )}
                {option.title}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
