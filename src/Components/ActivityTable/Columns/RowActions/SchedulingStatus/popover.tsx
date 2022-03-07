import { Button, Form, Input } from "antd";
import { useState } from "react";

// TYPES
type Props = {
  onConfirm: (reservationId: string | undefined) => void;
  onCancel: () => void;
};

const MarkAsScheduledPopover = ({ onConfirm, onCancel }: Props) => {
  const [reservationId, setReservationId] = useState<string | undefined>(
    undefined,
  );
  return (
    <div className='popover-scheduled--wrapper'>
      <Form.Item>
        <Input
          placeholder='Reservation id'
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
        />
      </Form.Item>
      <div className='popover-scheduled--buttons'>
        <Button
          type='default'
          size='small'
          disabled={!reservationId}
          onClick={() => onConfirm(reservationId)}
        >
          Use reservation id
        </Button>
        <Button type='default' size='small' onClick={() => onConfirm(undefined)}>
          No reservation id
        </Button>
        <Button type='default' size='small' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default MarkAsScheduledPopover;