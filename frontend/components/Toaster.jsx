import { useSelector } from "react-redux";

const Toaster = () => {
  const toasts = useSelector((state) => state.ui.toasts);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((item) => (
        <div key={item.id} className={`toast ${item.kind}`}>
          {item.message}
        </div>
      ))}
    </div>
  );
};

export default Toaster;
