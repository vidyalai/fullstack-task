// components/InputField.js
export default function InputField({ label, type, value, onChange, id,name }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        id={id}
        required
        value={value}
        name={name}
        onChange={onChange}
        className="mt-1 p-2 w-full border border-gray-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
