import ServiceCard from '@/components/ServiceCard'
import GemstoneCard from '@/components/GemstoneCard'
import MonthlyPrediction from '@/components/MonthlyPrediction'
import AstrologyClock from '@/components/AstrologyClock'
import Image from 'next/image'
import logo from '@/logo.png'

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-40 md:pt-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FEBD14]/25 rounded-full blur-3xl opacity-80"></div>
          <div className="absolute top-full -right-40 w-96 h-96 bg-[#FEBD14]/15 rounded-full blur-3xl opacity-70"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <Image
            src={logo}
            alt="Shree Karthik Science of Astrology Logo"
            width={120}
            height={120}
            className="mx-auto mb-8 md:mb-8 rounded-full border-4 border-[#FEBD14]/30 shadow-lg"
          />
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
           Welcome to <br /> Shree Karthik <br /> Science of Astrology
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
            Unlock the mysteries of the cosmos and discover your true path. Our expert astrologers combine ancient wisdom with modern understanding to guide you toward a better future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-gold inline-flex items-center justify-center">Book Consultation</a>
            <a href="#about" className="btn-outline inline-flex items-center justify-center">Learn More</a>
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">200+</p>
              <p className="text-gray-400 text-sm md:text-base">Happy Clients</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">5+</p>
              <p className="text-gray-400 text-sm md:text-base">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">5+</p>
              <p className="text-gray-400 text-sm md:text-base">Services</p>
            </div>
          </div>
        </div>
      </section>

      <AstrologyClock />

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
            Our Services
          </h2>
          <p className="text-slate-600 text-center mb-16 text-lg">
            Comprehensive astrological guidance for every aspect of your life
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Birth Chart */}
            <ServiceCard
              icon="🌙"
              title="Birth Chart Reading"
              description="Comprehensive natal chart analysis to understand your unique cosmic blueprint."
              details={[
                'Detailed planetary positions at birth',
                'House placements and aspects',
                'Career and financial insights',
                'Personality traits and strengths',
                'Life path and destiny analysis',
                'Personalized recommendations'
              ]}
            />

            {/* Horoscope */}
            <ServiceCard
              icon="♈"
              title="Horoscope Consultation"
              description="Personalized horoscope readings for daily, monthly, and yearly guidance."
              details={[
                'Daily horoscope predictions',
                'Monthly and yearly forecasts',
                'Lucky days and numbers',
                'Auspicious timings (Muhurat)',
                'Relationship compatibility',
                'Business and career guidance'
              ]}
            />

            {/* Number Prasanam */}
            <ServiceCard
              icon="🔢"
              title="Number Prasanam"
              description="Divine numerical divination for clarity on specific life questions."
              details={[
                'Numbered question oracle reading',
                'Quick divination insights',
                'Spiritual guidance on decisions',
                'Yes/No answer divination',
                'Clarity on life situations',
                'Immediate spiritual guidance'
              ]}
            />

            {/* Numerology */}
            <ServiceCard
              icon="✨"
              title="Numerology"
              description="Unlock the power of numbers to understand your destiny and life purpose."
              details={[
                'Life path number analysis',
                'Destiny number reading',
                'Expression number insights',
                'Name numerology consultation',
                'Personal year predictions',
                'Numerological timing guidance'
              ]}
            />

            {/* Gemologist */}
            <ServiceCard
              icon="💎"
              title="Gemologist Consultation"
              description="Expert guidance on selecting and wearing appropriate gemstones."
              details={[
                'Gemstone selection based on birth chart',
                'Quality and authenticity verification',
                'Proper wearing rituals and timings',
                'Planetary remedy recommendations',
                'Detailed gemstone benefits guide',
                'Authentic sourcing assistance'
              ]}
            />

            {/* Vastu */}
            <ServiceCard
              icon="🏠"
              title="Vastu Consultation"
              description="Ancient science of spatial harmony for your home and workplace."
              details={[
                'Home layout optimization',
                'Direction-based recommendations',
                'Color and element guidance',
                'Furniture placement advice',
                'Energy flow enhancement',
                'Business space improvement'
              ]}
            />
          </div>
        </div>
      </section>

      {/* Gemstones Section */}
      <section id="gemstones" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
            Precious Gemstones
          </h2>
          <p className="text-slate-600 text-center mb-16 text-lg">
            Harness planetary energies through authentic gemstones
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GemstoneCard
              name="Ruby"
              color="Red"
              planet="Sun (Surya)"
              benefits={[
                'Boosts confidence and leadership',
                'Enhances vitality and courage',
                'Improves overall health',
                'Success in career and business'
              ]}
              image="/images/gemstones/ruby.jpg"
            />

            <GemstoneCard
              name="Pearl"
              color="White/Silver"
              planet="Moon (Chandra)"
              benefits={[
                'Calms emotional turbulence',
                'Enhances mental clarity',
                'Improves sleep quality',
                'Strengthens relationships'
              ]}
              image="/images/gemstones/pearl.jpg"
            />

            <GemstoneCard
              name="Emerald"
              color="Green"
              planet="Mercury (Budh)"
              benefits={[
                'Enhances communication skills',
                'Improves memory and intelligence',
                'Success in business dealings',
                'Strengthens family bonds'
              ]}
              image="/images/gemstones/emerald.jpg"
            />

            <GemstoneCard
              name="Yellow Sapphire"
              color="Yellow"
              planet="Jupiter (Guru)"
              benefits={[
                'Brings prosperity and wealth',
                'Enhances wisdom and knowledge',
                'Success in education',
                'Improves overall fortune'
              ]}
              image="/images/gemstones/yellow-sapphire.jpg"
            />

            <GemstoneCard
              name="Blue Sapphire"
              color="Blue"
              planet="Saturn (Shani)"
              benefits={[
                'Protection from negative energy',
                'Career advancement and stability',
                'Increases focus and discipline',
                'Brings justice and fair dealing'
              ]}
              image="/images/gemstones/blue-sapphire.jpg"
            />

            <GemstoneCard
              name="Red Coral"
              color="Red-Orange"
              planet="Mars (Mangal)"
              benefits={[
                'Increases courage and strength',
                'Boosts physical energy',
                'Success in competitive fields',
                'Protects from accidents'
              ]}
              image="/images/gemstones/red-coral.jpg"
            />

            <GemstoneCard
              name="Diamond"
              color="Transparent/White"
              planet="Venus (Shukra)"
              benefits={[
                'Enhances love and relationships',
                'Increases charm and attraction',
                'Brings luxury and comfort',
                'Strengthens feminine energy'
              ]}
              image="/images/gemstones/diamond.jpg"
            />

            <GemstoneCard
              name="Hessonite"
              color="Cinnamon-Brown"
              planet="Rahu"
              benefits={[
                'Balances Rahu\'s negative effects',
                'Enhances intuition and spirituality',
                'Success in foreign travels',
                'Overcoming obsessions'
              ]}
              image="/images/gemstones/hessonite.jpg"
            />

            <GemstoneCard
              name="Cats Eye"
              color="Greenish-Yellow"
              planet="Ketu"
              benefits={[
                'Protects from sudden dangers',
                'Enhances spiritual growth',
                'Success in hidden ventures',
                'Increases intuitive powers'
              ]}
              image="/images/gemstones/cats-eye.jpg"
            />
          </div>

          <div className="mt-16 bg-card-glass rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gold mb-4">Why Choose Our Gemstones?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-3xl mb-2">🔍</p>
                <h4 className="font-semibold text-gold mb-2">100% Authentic</h4>
                <p className="text-gray-400">All gemstones certified and lab-verified</p>
              </div>
              <div>
                <p className="text-3xl mb-2">🌍</p>
                <h4 className="font-semibold text-gold mb-2">Ethically Sourced</h4>
                <p className="text-gray-400">Responsibly mined from trusted suppliers</p>
              </div>
              <div>
                <p className="text-3xl mb-2">📜</p>
                <h4 className="font-semibold text-gold mb-2">Certified & Tested</h4>
                <p className="text-gray-400">Complete documentation and authenticity proof</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MonthlyPrediction />

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                About Shree Karthik Science of Astrology
              </h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                With over 5+ years of dedicated practice and study, Shree Karthik Science of Astrology represents a perfect blend of ancient Vedic wisdom and contemporary astrological knowledge. We believe that astrology is not merely about predicting the future—it&apos;s about empowering individuals to make informed decisions and live harmoniously with cosmic rhythms.
              </p>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Our expert astrologers have helped over 200 clients navigate life&apos;s challenges and unlock their true potential. We provide personalized guidance through birth chart analysis, horoscope readings, numerological insights, and spiritual remedies including authentic gemstone recommendations.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-gold text-2xl">✓</span>
                  <span className="text-gray-300">Certified Vedic Astrology Practitioners</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gold text-2xl">✓</span>
                  <span className="text-gray-300">5+ Years Combined Experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gold text-2xl">✓</span>
                  <span className="text-gray-300">Personalized Spiritual Guidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gold text-2xl">✓</span>
                  <span className="text-gray-300">Authenticated Gemstone Services</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#fff3cd] to-[#feeb9c] rounded-lg p-8 h-96 flex items-center justify-center shadow-md">
              <div className="text-center">
                <p className="text-7xl mb-4">🌟</p>
                <h3 className="text-3xl font-bold text-[#A67400] mb-2">Cosmic Guidance</h3>
                <p className="text-slate-700">Aligning your life with celestial wisdom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-[#fff8e5] to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
            Get in Touch
          </h2>
          <p className="text-slate-600 text-center mb-12 text-lg">
            Ready to start your astrological journey? Connect with us today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <a href="mailto:info@karthikastrology.com" className="card-glass p-6 rounded-lg text-center hover:shadow-xl transition-shadow">
              <p className="text-4xl mb-4">📧</p>
              <h3 className="text-xl font-semibold text-gold mb-2">Email</h3>
              <p className="text-gray-300">shreekarthikscienceofastrology@gmail.com</p>
            </a>
            <a href="https://wa.me/919655375550?text=Hello%20Shree%20Karthik%20Science%20of%20Astrology" target="_blank" rel="noopener noreferrer" className="card-glass p-6 rounded-lg text-center hover:shadow-xl transition-shadow">
              <p className="text-4xl mb-4">📱</p>
              <h3 className="text-xl font-semibold text-gold mb-2">WhatsApp</h3>
              <p className="text-gray-300">+91 96553 75550</p>
            </a>
            <div className="card-glass p-6 rounded-lg text-center">
              <p className="text-4xl mb-4">📍</p>
              <h3 className="text-xl font-semibold text-gold mb-2">Location</h3>
              <p className="text-gray-300">Coimbatore, Tamil Nadu</p>
            </div>
          </div>

          <div className="card-glass rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gold mb-3">Chat with us on WhatsApp</h3>
            <p className="text-gray-300 mb-6">Get personal guidance about consultations, predictions, and gemstones.</p>
            <a href="https://wa.me/919655375550?text=Hello%20Shree%20Karthik%20Science%20of%20Astrology" target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center justify-center">
              Start WhatsApp Chat
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
