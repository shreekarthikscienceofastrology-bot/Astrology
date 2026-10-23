import Image from 'next/image'

export default function GemstoneCard({
  name,
  color,
  planet,
  benefits,
  image,
}: {
  name: string
  color: string
  planet: string
  benefits: string[]
  image: string
}) {
  return (
    <div className="card-glass rounded-lg overflow-hidden group hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300">
      <div className="relative h-48 bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center">
        <Image
          src={image}
          alt={`${name} gemstone`}
          fill
          loading="lazy"
          quality={72}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold gradient-text mb-2">{name}</h3>
        <p className="text-gold font-semibold mb-2">Planet: {planet}</p>
        <p className="text-sage mb-4 font-semibold">Color: {color}</p>
        
        <h4 className="text-gold font-semibold mb-3">Benefits:</h4>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-gray-300 text-sm">
              ✓ {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
