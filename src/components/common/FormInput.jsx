const FormInput = ({ id, type, placeholder, icon }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
      {icon}
    </span>
    <input
      type={type}
      id={id}
      name={id}
      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-white placeholder-slate-400"
      placeholder={placeholder}
    />
  </div>
);

export default FormInput;
