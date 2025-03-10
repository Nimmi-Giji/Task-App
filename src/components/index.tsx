import React, { memo } from 'react';
import type { NextPage } from 'next';
import { TaskList } from '@prisma/client';

interface CardProps {
  children: React.ReactNode;
}

export const Card: NextPage<CardProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-slate-100">
      {children}
    </div>
  );
};

export const CardContent: NextPage<CardProps>  = ({ children }) => {
  return (
    <div className="bg-white w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/6 rounded-lg drop-shadow-md">
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  listLength: number;
  clearAllFn?: () => void;
  deleteCheckedFn: () => void;
}

export const CardHeader: NextPage<CardHeaderProps> = ({ 
  title, 
  listLength, 
  clearAllFn,
  deleteCheckedFn 
}) => {
  return (
    <div className="flex flex-row items-center justify-between p-3 border-b border-slate-200">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-base font-medium tracking-wide text-gray-900 mr-2">
          {title}
        </h1>
        <span className="h-5 w-5 bg-blue-200 text-blue-600 flex items-center justify-center rounded-full text-xs">
          {listLength}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          className="text-sm font-medium text-gray-600 underline"
          type='button'
          onClick={clearAllFn}
        >
          Clear All
        </button>
        <button
          className="text-sm font-medium text-gray-600 underline"
          type='button'
          onClick={deleteCheckedFn}
        >
          Delete Checked
        </button>
      </div>
    </div>
  )
}

export const List: NextPage<CardProps> = ({ children }) => {
  return <div className="overflow-y-auto h-72">{children}</div>;
};

interface ListItemProps {
  item: TaskList;
  onUpdate?: (item: TaskList) => void;
  onDelete: () => void;
  onEdit: () => void;
}

const ListItemComponent: NextPage<ListItemProps> = ({ item, onUpdate, onDelete, onEdit }) => {
  return (
    <div className="h-12 border-b flex items-center justify-start px-3">
      <input
        type="checkbox"
        className="h-4 w-4 border-gray-300 rounded mr-4"
        checked={item.checked ?? false} 
        onChange={() => onUpdate?.(item)}
      />
      <div className="flex-grow">
        <h2 className="text-gray-600 tracking-wide text-sm">{item.title}</h2>
        {item.description && <p className="text-gray-500 text-xs">{item.description}</p>}
      </div>
      <button
        className="text-blue-600 text-sm mr-2"
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        className="text-red-600 text-sm"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  )
}

export const ListItem = memo(ListItemComponent);

interface CardFormProps {
  value: string;
  description?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submit: () => void;
  editingItemId?: number | null;
}

export const CardForm: NextPage<CardFormProps> = ({ 
  value, 
  description,
  onChange, 
  onDescriptionChange,
  submit,
  editingItemId 
}) => {
  return (
    <div className="bg-white w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/6 rounded-lg drop-shadow-md mt-4">
      <div className="relative">
        <input
          type="text"
          className="w-full py-4 pl-3 pr-16 text-sm rounded-lg"
          placeholder="Task Title..."
          onChange={onChange}
          value={value}
        />
        {onDescriptionChange && (
          <input
            type="text"
            className="w-full py-4 pl-3 pr-16 text-sm rounded-lg mt-2"
            placeholder="Task Description..."
            onChange={onDescriptionChange}
            value={description}
          />
        )}
        <button
          type="button"
          className="absolute p-2 text-white -translate-y-1/2 bg-blue-600 rounded-full top-1/2 right-4"
          onClick={submit}
        >
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
