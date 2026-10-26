import mongoose, { Schema, Document } from 'mongoose';

export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'pending' | 'completed';

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: PriorityLevel;
  dueDate?: Date | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

// Index for performant querying and filtering
TaskSchema.index({ completed: 1, priority: 1, dueDate: 1 });

export const TaskModel = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
