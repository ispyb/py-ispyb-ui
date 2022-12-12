import { LineVis, useDomain } from '@h5web/lib';
import ndarray from 'ndarray';
import { CIRCLE_PROFILE_KEY, LINE_PROFILE_KEY } from './utils';

interface Props {
  data?: number[];
}

function ProfileView(props: Props) {
  const { data } = props;
  const dataArray = ndarray(data || [0]);
  const domain = useDomain(dataArray);

  return (
    <>
      <LineVis dataArray={dataArray} domain={domain} />
      {!data && (
        <div className="profile-tip">
          <span>
            Press <kbd>{LINE_PROFILE_KEY}</kbd> to draw a profile selection line
            or <kbd>{CIRCLE_PROFILE_KEY}</kbd> for a profile selection circle
          </span>
        </div>
      )}
    </>
  );
}

export default ProfileView;
