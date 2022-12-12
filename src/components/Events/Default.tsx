import { EventHeader } from './Events';
import { Event } from 'models/Event.d';

export default function Default(event: Event) {
  return (
    <>
      <EventHeader event={event} title="Experiment" />
      <span>Default</span>
    </>
  );
}
