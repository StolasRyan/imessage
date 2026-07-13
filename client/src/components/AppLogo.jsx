export const APP_NAME = "iMessage"

const AppLogo = ({className = '', size = 32, alt=APP_NAME}) => {
  return (
    <img
        src="logo.png"
        className={`shrink-0 object-contain select-none ${className}`}
        width={size}
        height={size}
        alt={alt}
        draggable={false}
    />
  )
}

export default AppLogo