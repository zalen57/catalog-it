export default function Button({ children, className = '', variant = 'primary', type = 'button', ...props }) {
  const v = variant === 'ghost' ? 'ghost' : ''
  return (
    <button type={type} className={`button ${v} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
