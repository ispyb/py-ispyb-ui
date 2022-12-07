import { usePath } from 'hooks/usePath';
import EventList from './Events/EventsList';
import SampleChanger from './Samples/SampleChanger';

export default function BeamlineOverview() {
  const beamLineName = usePath('beamLineName');
  return (
    <section>
      <h1>{beamLineName}</h1>
      <SampleChanger beamLineName={beamLineName} />
      <EventList beamLineName={beamLineName} />
    </section>
  );
}
