import axios from 'axios';
import { useAuth } from 'hooks/useAuth';
import { useState, useEffect } from 'react';
import { InputGroup, Button } from 'react-bootstrap';

export function EditComments({
  comments,
  proposalName,
  id,
  saveReq,
}: {
  comments: string;
  proposalName: string;
  id: string;
  saveReq: ({
    proposalName,
    id,
    comments,
  }: {
    proposalName: string;
    id: string;
    comments: string;
  }) => {
    url: string;
    data: string;
    headers: any;
  };
}) {
  const [value, setValue] = useState(comments.trim());
  const [saved, setSaved] = useState(comments.trim());
  const changed = value.trim() !== saved.trim();
  const { site, token } = useAuth();

  useEffect(() => {
    if (!changed) {
      setValue(comments.trim());
      setSaved(comments.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments]);

  return (
    <InputGroup style={{ maxWidth: 800, minWidth: 200 }}>
      <textarea
        className="form-control"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Save any comment here..."
      />
      {changed && (
        <Button
          variant="success"
          onClick={() => {
            const req = saveReq({ proposalName, id, comments: value.trim() });
            const fullUrl = `${site.host}${site.apiPrefix}/${token}${req.url}`;
            axios.post(fullUrl, req.data, { headers: req.headers }).then(
              () => {
                setSaved(value.trim());
              },
              () => {
                setSaved(comments.trim());
              }
            );
          }}
        >
          Save
        </Button>
      )}
    </InputGroup>
  );
}
