'use client';

import cardValidator from 'card-validator';
import { useState } from 'react';
import { Button } from '../../components/button';
import { DrawerActions, DrawerBody, DrawerHeader, DrawerTitle } from '../../components/drawer';
import { Description, Field, FieldGroup, Label } from '../../components/fieldset';
import { Input } from '../../components/input';
import { Select } from '../../components/select';
import type { Event } from '../../data';
import { getCountries } from '../../data';

export interface OrderFormProps {
  events: Event[];
  onCancel: () => void;
}

export function OrderForm({ events, onCancel }: OrderFormProps) {
  const countries = getCountries();

  // Local state for formatting and card type display
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardType, setCardType] = useState('');

  // Card number formatting handler
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(value);
    const cardInfo = cardValidator.number(value);
    setCardType(cardInfo.card?.niceType || '');
  };

  // Expiry formatting handler (adds slash automatically)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardExpiry(value);
  };

  // CVV formatting handler (limits length)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(value);
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Create order</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <FieldGroup>
          <Field>
            <Label>Event</Label>
            <Select name="eventId" defaultValue="" required>
              <option value="" disabled>
                Select an event&hellip;
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </Select>
            <input type="hidden" name="cardType" value={cardType} />
          </Field>

          <Field>
            <Label>Quantity</Label>
            <Input name="quantity" type="number" min="1" defaultValue="1" required />
          </Field>

          <Field>
            <Label>Customer name</Label>
            <Input name="customerName" autoComplete="name" required />
          </Field>

          <Field>
            <Label>Email</Label>
            <Input name="customerEmail" type="email" autoComplete="email" required />
          </Field>

          <Field>
            <Label>Address</Label>
            <Input name="customerAddress" autoComplete="street-address" required />
          </Field>

          <Field>
            <Label>Country</Label>
            <Select name="customerCountry" defaultValue="" required>
              <option value="" disabled>
                Select a country
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Card number</Label>
            <Input
              name="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4242 4242 4242 4242"
              autoComplete="cc-number"
              required
              minLength={13}
              maxLength={19}
              pattern="[0-9]*"
            />
            {cardType && <Description>Card type: {cardType}</Description>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Expiry</Label>
              <Input
                name="cardExpiry"
                value={cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                autoComplete="cc-exp"
                required
                pattern="[0-9]{2}/[0-9]{2}"
              />
            </Field>

            <Field>
              <Label>CVV</Label>
              <Input
                name="cardCvv"
                value={cardCvv}
                onChange={handleCvvChange}
                placeholder="123"
                autoComplete="cc-csc"
                required
                minLength={3}
                maxLength={4}
                pattern="[0-9]*"
              />
            </Field>
          </div>
        </FieldGroup>
      </DrawerBody>
      <DrawerActions>
        <Button type="submit">Create order</Button>
        <Button plain type="button" onClick={onCancel}>
          Cancel
        </Button>
      </DrawerActions>
    </>
  );
}
