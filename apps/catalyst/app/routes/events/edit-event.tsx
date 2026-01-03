import { useEffect, useRef } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData, useNavigate } from 'react-router';
import { RoutedDrawer } from '../../components/drawer';
import { getEvent, updateEvent } from '../../data';
import { EventForm } from './event-form';

export async function loader({ params }: LoaderFunctionArgs) {
  const { eventId } = params;
  if (!eventId) {
    throw new Error('eventId is required');
  }

  const event = await getEvent(eventId);
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }

  return { event };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { eventId } = params;
  if (!eventId) {
    throw new Error('eventId is required');
  }

  const formData = await request.formData();

  await updateEvent(eventId, {
    name: formData.get('name') as string,
    date: formData.get('date') as string,
    time: formData.get('time') as string,
    location: formData.get('location') as string,
    ticketsAvailable: parseInt(formData.get('ticketsAvailable') as string, 10),
    status: formData.get('status') as string,
    imgUrl: (formData.get('imgUrl') as string) || '',
    thumbUrl: (formData.get('thumbUrl') as string) || '',
  });

  return { success: true };
}

export default function EditEvent() {
  const { event } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof action>();
  const closeRef = useRef<() => void>(null);

  useEffect(() => {
    if (fetcher.data?.success && closeRef.current) {
      closeRef.current();
    }
  }, [fetcher.data]);

  return (
    <RoutedDrawer size="lg" onClosed={() => navigate(`/events/${event.id}`)}>
      {({ close }) => {
        closeRef.current = close;
        return (
          <fetcher.Form method="post" className="contents">
            <EventForm title="Edit event" submitLabel="Save changes" defaultValues={event} onCancel={close} />
          </fetcher.Form>
        );
      }}
    </RoutedDrawer>
  );
}
