// components/Notification.js
const Notification = ({ message, type, onClose }) => {
    return (
      <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
        <div>{message}
        <button onClick={onClose} className="ml-4 text-sm underline">Close</button>
        </div>
        
      </div>
    );
  };
  
  export default Notification;
  