import {
  ExclamationCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill,
} from 'react-bootstrap-icons';
import { AutoProcProgramMessageStatus as AutoProcProgramMessageStatusType } from 'models/AutoProcProgramMessageStatuses.d';

export const messageStatusIcons: Record<string, JSX.Element> = {
  info: <InfoCircleFill color="#198754" />,
  warnings: <ExclamationTriangleFill color="#ffc107" />,
  errors: <ExclamationCircleFill color="#dc3545" />,
};

export default function MessageStatus({
  statuses,
}: {
  statuses?: AutoProcProgramMessageStatusType;
}) {
  return (
    <>
      {statuses &&
        Object.keys(statuses)
          .filter((key) => {
            const typedKey = key as keyof AutoProcProgramMessageStatusType;
            return statuses[typedKey] > 0;
          })
          .map((key) => {
            const typedKey = key as keyof AutoProcProgramMessageStatusType;
            return (
              <span className="me-1" key={key}>
                {messageStatusIcons[typedKey]} {statuses[typedKey]}
              </span>
            );
          })}
    </>
  );
}
