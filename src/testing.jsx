// Toggle mic for wake word
const ToggleSwitch = () => {
    const [isChecked, setIsChecked] = useState(false);
  
    const handleToggle = () => {
      setIsChecked(!isChecked);
      
    };
  
    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={isChecked}
          onChange={handleToggle}
        />
        <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ease-in-out ${isChecked ? 'bg-red-600 ' : 'bg-gray-300'}`}>
          <span
            className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-4 w-4 transition-transform duration-200 ease-in-out transform ${ isChecked ? 'translate-x-full border-white' : '' }`}
          />
        </div>
        <span className="ms-3 text-sm font-medium text-gray-900">Mic</span>
      </label>
    );
  };