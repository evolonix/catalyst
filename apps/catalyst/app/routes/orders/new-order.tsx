import cardValidator from 'card-validator';
import { useEffect, useRef } from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { useFetcher, useLoaderData, useNavigate } from 'react-router';
import { RoutedDrawer } from '../../components/drawer';
import { createOrder, getEvents } from '../../data';
import { OrderForm } from './order-form';

export async function loader() {
  const events = await getEvents();
  return { events };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const eventId = formData.get('eventId') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const customerName = (formData.get('customerName') as string).trim();
  const customerEmail = formData.get('customerEmail') as string;
  const customerAddress = (formData.get('customerAddress') as string).trim();
  const customerCountry = formData.get('customerCountry') as string;
  const cardNumber = formData.get('cardNumber') as string;
  const cardExpiry = formData.get('cardExpiry') as string;
  const cardTypeFromForm = formData.get('cardType') as string;

  // Derive card type from card number
  const cardInfo = cardValidator.number(cardNumber);
  const cardType = cardTypeFromForm || cardInfo.card?.niceType || 'Unknown';

  await createOrder({
    eventId,
    quantity,
    customerName,
    customerEmail,
    customerAddress,
    customerCountry,
    cardNumber,
    cardType,
    cardExpiry,
  });

  return { success: true };
}

export default function NewOrder() {
  const { events } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof action>();
  const closeRef = useRef<() => void>(null);

  useEffect(() => {
    if (fetcher.data?.success && closeRef.current) {
      closeRef.current();
    }
  }, [fetcher.data]);

  return (
    <RoutedDrawer size="lg" onClosed={() => navigate('/orders')}>
      {({ close }) => {
        closeRef.current = close;
        return (
          <fetcher.Form method="post" className="contents">
            <OrderForm events={events} onCancel={close} />
          </fetcher.Form>
        );
      }}
    </RoutedDrawer>
  );
}
