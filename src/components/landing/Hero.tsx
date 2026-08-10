import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { EditableText } from '../admin/editable/EditableText';
import { EditableImage } from '../admin/editable/EditableImage';

interface HeroProps {
  onNavigate: (view: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact') => void;
  slides?: Array<{
    title: string;
    subtitle: string;
    text: string;
    image: string;
    cta: string;
    targetView: 'accueil' | 'qui-nous-sommes' | 'nos-services' | 'contact';
  }>;
  onUpdateSlide?: (index: number, key: string, value: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, slides: customSlides, onUpdateSlide }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides = [
    {
      title: "Audit & Conseil en Achats & Logistique",
      subtitle: "25 ans d'expertise",
      text: "Le Cabinet RE2M vous accompagne dans l'optimisation de vos fonctions Achats et Logistique. Avec plus de 25 ans d'expérience, nous vous garantissons des résultats probants et mesurables.",
      image: "/slide_01.jpg",
      cta: "Nous Contacter",
      targetView: 'contact' as const
    },
    {
      title: "Expertise & Transfert de Compétences",
      subtitle: "Formation certifiante",
      text: "Dirigé par Roch-Emmanuel MVE-MBORO, Expert-Consultant-Formateur certifié PNUD, notre cabinet vous forme aux meilleures pratiques des Achats et de la Logistique.",
      image: "/slide_02.jpg",
      cta: "Nos Services",
      targetView: 'nos-services' as const
    },
    {
      title: "Gagner Grâce aux Achats",
      subtitle: "Résultats garantis",
      text: "Notre mission : vous faire réaliser des économies significatives et améliorer votre productivité grâce à une gestion optimisée de vos achats et de votre supply chain.",
      image: "/slide_03.jpg",
      cta: "En Savoir Plus",
      targetView: 'qui-nous-sommes' as const
    }
  ];

  const slides = customSlides || defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[580px] bg-slate-950 overflow-hidden text-white">
      {/* Slides wrapper */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with original proportions (bg-cover bg-center) */}
            {onUpdateSlide ? (
              <EditableImage
                src={slide.image}
                alt={slide.title}
                onSave={(v) => onUpdateSlide(index, 'image', v)}
                containerClassName="absolute inset-0 w-full h-full"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#002366]/90 via-[#002366]/65 to-transparent pointer-events-none" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl space-y-6 animate-fadeIn">

                  {/* Subtitle */}
                  {onUpdateSlide ? (
                    <EditableText
                      as="div"
                      label="Sous-titre"
                      value={slide.subtitle}
                      onSave={(v) => onUpdateSlide(index, 'subtitle', v)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider"
                    />
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      {slide.subtitle}
                    </div>
                  )}

                  {/* Title */}
                  {onUpdateSlide ? (
                    <EditableText
                      as="h1"
                      label="Titre"
                      value={slide.title}
                      onSave={(v) => onUpdateSlide(index, 'title', v)}
                      className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
                    />
                  ) : (
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                      {slide.title}
                    </h1>
                  )}

                  {/* Text */}
                  {onUpdateSlide ? (
                    <EditableText
                      as="p"
                      label="Texte"
                      multiline
                      value={slide.text}
                      onSave={(v) => onUpdateSlide(index, 'text', v)}
                      className="text-slate-200 text-sm sm:text-base md:text-lg font-light leading-relaxed"
                    />
                  ) : (
                    <p className="text-slate-200 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                      {slide.text}
                    </p>
                  )}

                  {/* CTA Button */}
                  <div className="pt-2">
                    {onUpdateSlide ? (
                      <EditableText
                        as="span"
                        label="Texte du bouton"
                        value={slide.cta}
                        onSave={(v) => onUpdateSlide(index, 'cta', v)}
                        className="inline-block bg-white text-[#002366] font-bold px-6 py-3.5 rounded-xl shadow-lg text-sm"
                      />
                    ) : (
                      <button
                        onClick={() => onNavigate(slide.targetView)}
                        className="bg-white text-[#002366] font-bold px-6 py-3.5 rounded-xl shadow-lg hover:bg-slate-100 transition-colors text-sm cursor-pointer"
                      >
                        {slide.cta}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Manual Slide Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 hover:bg-black/55 text-white transition-colors cursor-pointer"
        aria-label="Diapositive précédente"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 hover:bg-black/55 text-white transition-colors cursor-pointer"
        aria-label="Diapositive suivante"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
              idx === currentSlide ? 'bg-white scale-110' : 'bg-white/40'
            }`}
            aria-label={`Aller à la diapositive ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
};
export default Hero;
