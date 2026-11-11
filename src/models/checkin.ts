import { InferSchemaType, model, Schema } from 'mongoose';

export const checkinSchema = new Schema(
  {
    habit: {
      type: Schema.Types.ObjectId,
      ref: 'Habit',
      required: true
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      trim: true,
      validate: {
        validator: (value: string) => {
          const date = new Date(value);
          return (
            !isNaN(date.getTime()) && value === date.toISOString().split('T')[0]
          );
        },
        message: 'date must be a valid date in the format YYYY-MM-DD'
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (_doc, ret: Record<string, unknown>) {
        delete ret._id;
      }
    }
  }
);

checkinSchema.index({ habit: 1, date: 1 }, { unique: true });

export const Checkin = model('Checkin', checkinSchema);
export type CheckinType = InferSchemaType<typeof checkinSchema>;
