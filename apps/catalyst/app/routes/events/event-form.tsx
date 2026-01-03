import { Button } from '../../components/button';
import { DrawerActions, DrawerBody, DrawerHeader, DrawerTitle } from '../../components/drawer';
import { Field, FieldGroup, Label } from '../../components/fieldset';
import { Input } from '../../components/input';
import { Select } from '../../components/select';
import type { Event } from '../../data';

export interface EventFormProps {
  title: string;
  submitLabel: string;
  defaultValues?: Partial<Event>;
  onCancel: () => void;
}

export function EventForm({ title, submitLabel, defaultValues, onCancel }: EventFormProps) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <FieldGroup>
          <Field>
            <Label>Event name</Label>
            <Input name="name" required autoFocus defaultValue={defaultValues?.name} />
          </Field>
          <Field>
            <Label>Date</Label>
            <Input
              name="date"
              type="text"
              placeholder="May 20, 2024"
              required
              defaultValue={defaultValues?.date}
            />
          </Field>
          <Field>
            <Label>Time</Label>
            <Input
              name="time"
              type="text"
              placeholder="10 PM"
              required
              defaultValue={defaultValues?.time}
            />
          </Field>
          <Field>
            <Label>Location</Label>
            <Input
              name="location"
              required
              placeholder="Venue, City, State"
              defaultValue={defaultValues?.location}
            />
          </Field>
          <Field>
            <Label>Tickets available</Label>
            <Input
              name="ticketsAvailable"
              type="number"
              min="1"
              required
              defaultValue={defaultValues?.ticketsAvailable}
            />
          </Field>
          <Field>
            <Label>Status</Label>
            <Select name="status" defaultValue={defaultValues?.status ?? 'On Sale'}>
              <option value="On Sale">On Sale</option>
              <option value="Closed">Closed</option>
            </Select>
          </Field>
          <Field>
            <Label>Image URL</Label>
            <Input
              name="imgUrl"
              type="text"
              placeholder="/events/image.jpg"
              defaultValue={defaultValues?.imgUrl}
            />
          </Field>
          <Field>
            <Label>Thumbnail URL</Label>
            <Input
              name="thumbUrl"
              type="text"
              placeholder="/events/thumb.jpg"
              defaultValue={defaultValues?.thumbUrl}
            />
          </Field>
        </FieldGroup>
      </DrawerBody>
      <DrawerActions>
        <Button type="submit">{submitLabel}</Button>
        <Button plain type="button" onClick={onCancel}>
          Cancel
        </Button>
      </DrawerActions>
    </>
  );
}
