import './Loader.css';

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = 'Loading weather data...' }: LoaderProps) => {
  return (
    <div className="loader-container">
      <div className="loader-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;

