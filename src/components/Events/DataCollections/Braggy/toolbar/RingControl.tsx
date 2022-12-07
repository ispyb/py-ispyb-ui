import { ToggleBtn } from '@h5web/lib';
import { Bullseye } from 'react-bootstrap-icons';
import styles from './RingControl.module.css';

interface Props {
  showRings: boolean;
  toggleRings: () => void;
}

function RingControl(props: Props) {
  const { showRings, toggleRings } = props;

  return (
    <div className={styles.container}>
      <ToggleBtn
        value={showRings}
        onToggle={toggleRings}
        label="Rings"
        icon={Bullseye}
      />
    </div>
  );
}

export default RingControl;
