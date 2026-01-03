import { useEffect, useRef } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData, useNavigate } from 'react-router';
import { Button } from '../../components/button';
import { DialogActions, DialogDescription, DialogTitle, RoutedDialog } from '../../components/dialog';
import { deleteEvent, getEvent } from '../../data';

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

export async function action({ params }: ActionFunctionArgs) {
  const { eventId } = params;
  if (!eventId) {
    throw new Error('eventId is required');
  }

  const deleted = await deleteEvent(eventId);
  if (!deleted) {
    throw new Response('Not Found', { status: 404 });
  }

  return { deleted: true };
}

export function shouldRevalidate({ actionResult }: { actionResult?: Awaited<ReturnType<typeof action>> }) {
  // Don't revalidate after successful delete - the event no longer exists
  if (actionResult?.deleted) {
    return false;
  }
  return true;
}

export default function DeleteEvent() {
  const { event } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof action>();
  const closeRef = useRef<() => void>(null);

  useEffect(() => {
    if (fetcher.data?.deleted && closeRef.current) {
      closeRef.current();
    }
  }, [fetcher.data]);

  return (
    <RoutedDialog
      size="sm"
      onClosed={() => {
        if (fetcher.data?.deleted) navigate(`/events`, { replace: true });
        else navigate(`/events/${event.id}`);
      }}
    >
      {({ close }) => {
        closeRef.current = close;
        return (
          <fetcher.Form method="post">
            <DialogTitle>Delete "{event.name}"?</DialogTitle>
            <DialogDescription>This action cannot be undone. The event will be permanently removed.</DialogDescription>
            <DialogActions>
              <Button plain onClick={close}>
                Cancel
              </Button>
              <Button color="red" type="submit">
                Delete
              </Button>
            </DialogActions>
          </fetcher.Form>
        );
      }}
    </RoutedDialog>
  );
}
