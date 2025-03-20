export default function AuthInput({ label, name, type, ...props }) {
  return (
    <div className="flex justify-between gap-2">
      <label htmlFor={name}>{label}</label>
      <input className="ml-auto" name={name} type={type} {...props} />
    </div>
  );
}
