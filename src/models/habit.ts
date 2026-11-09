import { InferSchemaType, model, Schema } from 'mongoose';

export const habitSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    observations: {
      type: String,
      trim: true,
      maxlength: 500
    },
    frequency: {
      type: [Number],
      validate: {
        validator: (value: number[]) =>
          value.length > 0 &&
          value.every((day) => Number.isInteger(day) && day >= 0 && day <= 6) &&
          new Set(value).size === value.length,
        message:
          'frequency must be a non-empty list of unique integers from 0 (Sunday) to 6 (Saturday)'
      }
    },
    color: {
      type: String,
      match: /^#([0-9A-Fa-f]{3}){1,2}$/
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 50
    },
    archived: {
      type: Boolean,
      default: false
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

export const Habit = model('Habit', habitSchema);
export type HabitType = InferSchemaType<typeof habitSchema>;
