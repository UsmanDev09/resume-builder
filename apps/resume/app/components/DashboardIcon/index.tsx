import React from 'react';

const DashboardIcon = ({
  width = 24,
  height = 24,
  disabled = false,
  direction = 'up',
  className = '',
  ...props
}) => {
  const getRotationClass = () => {
    switch (direction) {
      case 'right':
        return 'rotate-90';
      case 'down':
        return 'rotate-180';
      case 'left':
        return 'rotate-270';
      default:
        return 'rotate-0';
    }
  };

  const baseColor = disabled ? '#E5E7EB' : undefined; // Tailwind gray-200 equivalent

  return (
    <div 
      className={`inline-flex ${getRotationClass()} transform ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="w-full h-full"
        {...props}
      >
        <path
          d="M5 9.8C5 8.11984 5 7.27976 5.32698 6.63803C5.6146 6.07354 6.07354 5.6146 6.63803 5.32698C7.27976 5 8.11984 5 9.8 5H13.4C13.9601 5 14.2401 5 14.454 5.10899C14.6422 5.20487 14.7951 5.35785 14.891 5.54601C15 5.75992 15 6.03995 15 6.6V16.4C15 16.9601 15 17.2401 14.891 17.454C14.7951 17.6422 14.6422 17.7951 14.454 17.891C14.2401 18 13.9601 18 13.4 18H6.6C6.03995 18 5.75992 18 5.54601 17.891C5.35785 17.7951 5.20487 17.6422 5.10899 17.454C5 17.2401 5 16.9601 5 16.4V9.8Z"
          fill={disabled ? baseColor : '#886FFF'}
        />
        <path
          d="M5 21.6C5 21.0399 5 20.7599 5.10899 20.546C5.20487 20.3578 5.35785 20.2049 5.54601 20.109C5.75992 20 6.03995 20 6.6 20H13.4C13.9601 20 14.2401 20 14.454 20.109C14.6422 20.2049 14.7951 20.3578 14.891 20.546C15 20.7599 15 21.0399 15 21.6V25.4C15 25.9601 15 26.2401 14.891 26.454C14.7951 26.6422 14.6422 26.7951 14.454 26.891C14.2401 27 13.9601 27 13.4 27H9.8C8.11984 27 7.27976 27 6.63803 26.673C6.07354 26.3854 5.6146 25.9265 5.32698 25.362C5 24.7202 5 23.8802 5 22.2V21.6Z"
          fill={disabled ? baseColor : '#161419'}
        />
        <path
          d="M17 6.6C17 6.03995 17 5.75992 17.109 5.54601C17.2049 5.35785 17.3578 5.20487 17.546 5.10899C17.7599 5 18.0399 5 18.6 5H22.2C23.8802 5 24.7202 5 25.362 5.32698C25.9265 5.6146 26.3854 6.07354 26.673 6.63803C27 7.27976 27 8.11984 27 9.8V10.4C27 10.9601 27 11.2401 26.891 11.454C26.7951 11.6422 26.6422 11.7951 26.454 11.891C26.2401 12 25.9601 12 25.4 12H18.6C18.0399 12 17.7599 12 17.546 11.891C17.3578 11.7951 17.2049 11.6422 17.109 11.454C17 11.2401 17 10.9601 17 10.4V6.6Z"
          fill={disabled ? baseColor : '#161419'}
        />
        <path
          d="M17 15.6C17 15.0399 17 14.7599 17.109 14.546C17.2049 14.3578 17.3578 14.2049 17.546 14.109C17.7599 14 18.0399 14 18.6 14H25.4C25.9601 14 26.2401 14 26.454 14.109C26.6422 14.2049 26.7951 14.3578 26.891 14.546C27 14.7599 27 15.0399 27 15.6V22.2C27 23.8802 27 24.7202 26.673 25.362C26.3854 25.9265 25.9265 26.3854 25.362 26.673C24.7202 27 23.8802 27 22.2 27H18.6C18.0399 27 17.7599 27 17.546 26.891C17.3578 26.7951 17.2049 26.6422 17.109 26.454C17 26.2401 17 25.9601 17 25.4V15.6Z"
          fill={disabled ? baseColor : '#161419'}
        />
      </svg>
    </div>
  );
};

export default DashboardIcon;