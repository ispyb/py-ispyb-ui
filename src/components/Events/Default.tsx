import { EventHeader } from './Events';
import { Event } from 'models/Event';

export default function Default(event: Event) {
  return (
    <>
      <EventHeader event={event} title="Experiment" />
      <span>Default</span>
    </>
  );
}
