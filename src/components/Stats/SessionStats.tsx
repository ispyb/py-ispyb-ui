import TimesPie from './TimesPie';
import Hourlies from './Hourlies';
import HistoryBreakdown from './HistoryBreakdown';
import SessionOverview from './SessionOverview';
import StatusOverview from './StatusOverview';

export default function SessionStats() {
  return (
    <section>
      <h1>Session Statistics</h1>
      <HistoryBreakdown />
      <SessionOverview />
      <div className="d-flex">
        <TimesPie />
        <Hourlies />
      </div>
      <StatusOverview />
    </section>
  );
}
