const ArcadeIcon = ({ 
  width = "24",
  height = "24",
  disabled = false,
  direction = 'up', // set default to 'up'
  className = ""
}) => {
  const getRotationClass = () => {
    switch (direction) {
      case 'right':
        return 'rotate-90';
      case 'down':
        return 'rotate-180';
      case 'left':
        return 'rotate-270';
      case 'up':
        return 'rotate-0'; 
      default:
        return 'rotate-0'; // default to no rotation (upright)
    }
  };

  return (
    <div className={`inline-block ${getRotationClass()} ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-auto"
      >
        <path
          d="M3.18714 15.5319L6.20241 24.2622C6.53887 25.2364 7.35183 25.9696 8.35543 26.2041L16.9156 28.2044C17.8312 28.4183 18.6463 27.5829 18.4099 26.6729L15.8468 16.8063C15.748 16.4261 15.4358 16.139 15.0487 16.0722L4.30221 14.22C3.55248 14.0908 2.93878 14.8128 3.18714 15.5319Z"
          fill="#F5F5F5"
        />
        <path
          d="M3.18714 15.5319L6.20241 24.2622C6.53887 25.2364 7.35183 25.9696 8.35543 26.2041L16.9156 28.2044C17.8312 28.4183 18.6463 27.5829 18.4099 26.6729L15.8468 16.8063C15.748 16.4261 15.4358 16.139 15.0487 16.0722L4.30221 14.22C3.55248 14.0908 2.93878 14.8128 3.18714 15.5319Z"
          fill={disabled ? "#F5F5F5" : "#161419"}
        />
        <path
          d="M28.0843 18.1215L26.2415 9.56218C26.0789 8.80665 25.1572 8.51332 24.5878 9.03586L17.9066 15.1671C17.6352 15.4161 17.5227 15.7942 17.6138 16.1511L20.1301 26.0104C20.271 26.5622 20.9511 26.7619 21.3679 26.3739L27.1956 20.9487C27.9691 20.2286 28.3067 19.1547 28.0843 18.1215Z"
          fill="#F5F5F5"
        />
        <path
          d="M28.0843 18.1215L26.2415 9.56218C26.0789 8.80665 25.1572 8.51332 24.5878 9.03586L17.9066 15.1671C17.6352 15.4161 17.5227 15.7942 17.6138 16.1511L20.1301 26.0104C20.271 26.5622 20.9511 26.7619 21.3679 26.3739L27.1956 20.9487C27.9691 20.2286 28.3067 19.1547 28.0843 18.1215Z"
          fill={disabled ? "#F5F5F5" : "#161419"}
        />
        <path
          d="M11.0648 4.16858L3.44933 10.3709C2.61257 11.0524 2.97455 12.4027 4.03999 12.5743L15.5273 14.4239C15.826 14.472 16.1304 14.3823 16.3552 14.18L24.1147 7.19645C24.8852 6.50299 24.5254 5.22699 23.5061 5.03823L14.3192 3.33695C13.1649 3.1232 11.975 3.42727 11.0648 4.16858Z"
          fill="#F5F5F5"
        />
        <path
          d="M11.0648 4.16858L3.44933 10.3709C2.61257 11.0524 2.97455 12.4027 4.03999 12.5743L15.5273 14.4239C15.826 14.472 16.1304 14.3823 16.3552 14.18L24.1147 7.19645C24.8852 6.50299 24.5254 5.22699 23.5061 5.03823L14.3192 3.33695C13.1649 3.1232 11.975 3.42727 11.0648 4.16858Z"
          fill={disabled ? "#F5F5F5" : "#886FFF"}
        />
      </svg>
    </div>
  );
};

export default ArcadeIcon;
