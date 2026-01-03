import { useEffect, useRef } from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { useFetcher, useNavigate } from 'react-router';
import { RoutedDrawer } from '../../components/drawer';
import { createEvent } from '../../data';
import { EventForm } from './event-form';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  await createEvent({
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

export default function NewEvent() {
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof action>();
  const closeRef = useRef<() => void>(null);

  useEffect(() => {
    if (fetcher.data?.success && closeRef.current) {
      closeRef.current();
    }
  }, [fetcher.data]);

  return (
    <RoutedDrawer size="lg" onClosed={() => navigate('/events')}>
      {({ close }) => {
        closeRef.current = close;
        return (
          <fetcher.Form method="post" className="contents">
            <EventForm title="Create event" submitLabel="Create event" onCancel={close} />
          </fetcher.Form>
        );
      }}
    </RoutedDrawer>
  );
}
