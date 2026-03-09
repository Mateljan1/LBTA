import Image from 'next/image'

interface SeamlessLogoProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  containerClassName?: string
  priority?: boolean
  backgroundColor?: string
}

export default function SeamlessLogo({
  src,
  alt,
  width,
  height,
  className = '',
  containerClassName = '',
  priority = false,
  backgroundColor = 'bg-brand-morning-light'
}: SeamlessLogoProps) {
  return (
    <div className={`relative logo-container city-logo-blend ${containerClassName}`}>
      {/* Seamless background that matches the page - only show if not transparent */}
      {backgroundColor !== 'bg-transparent' && (
        <div className={`absolute inset-0 ${backgroundColor} rounded-lg`}></div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 mix-blend-multiply opacity-90 transition-all duration-500 ease-out city-logo-tan-blend ${className}`}
        style={{ objectFit: 'contain' }}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
      />
      
      {/* Dynamic gradient overlay based on background */}
      {backgroundColor !== 'bg-transparent' ? (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-morning-light/5 via-transparent to-brand-morning-light/5 pointer-events-none z-20 rounded-lg"></div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-sandstone/10 via-transparent to-brand-sandstone/10 pointer-events-none z-20"></div>
      )}
    </div>
  )
}
