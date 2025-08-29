"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Music,
  Headphones,
  Zap,
  Volume2,
  ArrowUp,
} from "lucide-react";
import { FaInstagram, FaSpotify, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { getYouTubeVideosWithStats } from "@/service/Youtube";
import SingleYt from "@/components/interface/SingleYt";
import Loader from "@/components/commons/loader";
import ListSinglesYt from "@/components/commons/listSinglesYt";

export default function ArtistPage() {
  const [isVisible, setIsVisible] = useState(false);

  const genresRef = useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [singlesYt, setSinglesYt] = useState<SingleYt[]>([]);
  const [popularesYt, setPopularesYt] = useState<SingleYt[]>([]);
  const [loadingSingles, setLoadingSingles] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!genresRef.current) return;
      const rect = genresRef.current.getBoundingClientRect();
      setShowScrollTop(rect.top < 0); // Muestra el botón si la sección ya no está visible arriba
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchSingles() {
      const youtubeSingles = await getYouTubeVideosWithStats(4);
      const youtubePopulares = await getYouTubeVideosWithStats(8, "popular");

      setSinglesYt(youtubeSingles);
      setPopularesYt(youtubePopulares);
      setLoadingSingles(false);
    }

    fetchSingles();
  }, []);

  const genres = [
    { name: "Rock", icon: Music, color: "bg-red-500" },
    { name: "Cyberpunk", icon: Zap, color: "bg-purple-500" },
    { name: "Electrónica", icon: Volume2, color: "bg-blue-500" },
    { name: "Orquestal", icon: Headphones, color: "bg-green-500" },
  ];

  const socialLinks = [
    {
      name: "Spotify",
      icon: FaSpotify,
      url: "https://open.spotify.com/artist/1hH79jUGYvxZTNleuBghkI",
      color: "hover:text-green-400",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://www.instagram.com/alfred_uarc7/",
      color: "hover:text-pink-400",
    },
    {
      name: "X (Twitter)",
      icon: FaXTwitter,
      url: "https://x.com/Alfred_UArc7",
      color: "hover:text-blue-400",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      url: "https://www.youtube.com/channel/UCsTSwYGiEWsnghOj3vppeCA",
      color: "hover:text-red-400",
    },
  ];

  const pathBase = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pathPortada = pathBase.concat(`/portada.png`);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-purple-900/20">
        <div className={`absolute inset-0 bg-[url('${pathPortada}')] bg-cover bg-center opacity-40`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        <div
          className={`relative z-10 text-center space-y-6 px-4 transition-all duration-1000 ${
            isVisible ? "animate-slide-up" : "opacity-30"
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent animate-pulse-purple">
            Alfred_UArc7
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Fusionando Rock, Cyberpunk, Electrónica y Orquestal en una
            experiencia sonora única
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                size="lg"
                className={`border-primary/50 ${social.color} transition-all duration-300 hover:scale-110 hover:animate-glow`}
                asChild
              >
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  <social.icon className="w-5 h-5 mr-2" />
                  {social.name}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-20 px-4" ref={genresRef}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-balance">
            Géneros Musicales
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {genres.map((genre, index) => (
              <Card
                key={genre.name}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:animate-glow border-primary/20 bg-card/50 backdrop-blur-sm ${
                  isVisible ? "animate-slide-up" : "opacity-30"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full ${genre.color} flex items-center justify-center group-hover:animate-pulse-purple`}
                  >
                    <genre.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{genre.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Singles Section */}
      {loadingSingles ? (
        <Loader textLoading="Cargando música..." />
      ) : (
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-balance">
              Sencillos Más Populares
            </h2>
            <ListSinglesYt listSingles={popularesYt} isVisible={isVisible} />

            <h2 className="text-4xl font-bold text-center mb-12 text-balance mt-20">
              Últimos lanzamientos
            </h2>
            <ListSinglesYt listSingles={singlesYt} isVisible={isVisible} />
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold mb-8 text-balance">Mi música</h2>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Mi música es un reflejo de mis propias emociones, ideas y
              experiencias, transformadas en sonido a través de la inteligencia
              artificial. Aunque la tecnología es la herramienta, el alma detrás
              de cada canción es cien por ciento humana. Cada composición nace
              de una necesidad personal de explorar universos épicos, atmósferas
              oscuras y paisajes emocionales que las palabras a veces no logran
              capturar.
            </p>
            <p>
              Me enfoco en crear piezas que fusionan lo épico con lo
              introspectivo, donde las melodias orquestales se encuentran con
              sonidos electrónicos y ambientales. Mis géneros principales giran
              en torno a la música épica—para narrar batallas internas y
              triunfos personales—, la música oscura—con atmospheres cargadas de
              misterio y melancolía—, y la música emocional—que evoca soledad,
              resiliencia y sueños rotos—. Me inspiro en la dualidad entre la
              luz y la oscuridad, en historias de superación, y en mundos de
              fantasía y ciencia ficción.
            </p>
            <p>
              Cada canción es un viaje sensorial diseñado para transportarte a
              otros lugares, ya sea para reflexionar, inspirarte o simplemente
              sentirte acompañado en tus silencios. No busco seguir tendencias;
              busco crear soundscapes únicos que resonen en quienes, como yo,
              creen que la música es un refugio para las emociones más
              profundas.
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-justify space-y-8 pt-25">
          <h2 className="text-4xl font-bold mb-8 text-balance">
            Sobre la creación de mi música
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Mi música es generada con herramientas de inteligencia artificial
              (IA), específicamente utilizando Suno AI, una plataforma que me
              permite transformar ideas y emociones en composiciones únicas.
              Quiero aclarar algunos puntos importantes sobre este proceso:
            </p>
            <h3 className="text-lg font-semibold">
              1. Mis intenciones: Compartir, no reemplazar
            </h3>
            <p>
              No busco reemplazar a artistas musicales tradicionales ni
              menospreciar el valor del arte creado por humanos. Mi objetivo es
              compartir experiencias sonoras que nacen de mis propias ideas,
              emociones y perspectivas personales, utilizando la IA como una
              herramienta de expresión creativa. Esta música es, ante todo, un
              reflejo de mi visión artística y un experimento para explorar
              nuevos horizontes en la creación musical.
            </p>
            <h3 className="text-lg font-semibold">
              2. Originalidad y derechos de autor
            </h3>
            <div className="pl-8">
              <ul>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    Todas las letras y melodías generadas con Suno AI son
                    creaciones originales basadas en mis propias ideas y prompts
                    (instrucciones).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    Soy miembro pago de Suno AI, lo que me otorga derechos
                    comerciales sobre la música generada, de acuerdo con los
                    términos y condiciones de la plataforma.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    No utilizo obras, melodías o letras de otros artistas como
                    referencia para generar mis canciones. Cada pieza es única y
                    nace de mis propias ideas.
                  </span>
                </li>
              </ul>
            </div>
            <h3 className="text-lg font-semibold">
              3. Limitaciones éticas y legales
            </h3>
            Soy consciente de que la música generada por IA no equivale al
            trabajo de un artista humano en términos creativos, legales o
            sociales. Por ello:
            <div className="pl-8 pt-4">
              <ul>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    No me atribuyo habilidades musicales tradicionales (como
                    composición instrumental o vocal).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    No busco los mismos beneficios que un artista musical
                    convencional (premios, reconocimientos académicos, etc.).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    No me identifico como &quot;músico&quot; o
                    &quot;compositor&quot; en el sentido tradicional, sino como
                    un creador que utiliza IA para dar vida a sus ideas.
                  </span>
                </li>
              </ul>
            </div>
            <h3 className="text-lg font-semibold">
              4. Uso de mi música por terceros
            </h3>
            Mi música está disponible en múltiples plataformas gracias a
            DistroKid, pero yo mismo gestiono mi contenido en YouTube. Por ello:
            <div className="pl-8 pt-4">
              <ul>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    Puedes usar mis canciones en proyectos no comerciales
                    (videos, podcasts, covers) siempre que me des crédito como
                    creador y enlaces a mi canal/web.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    No permito el uso de mi música en proyectos comerciales
                    (publicidad, monetización, venta) sin mi autorización
                    explícita.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    YouTube: Puedes usar mis canciones como fondo en tus videos
                    siempre que:
                    <ul>
                      <li>
                        Me des crédito en la descripción (con enlace a mi canal
                        o redes sociales).
                      </li>
                      <li>
                        No monetices el video (no active publicidad ni ganes
                        dinero con él) sin mi autorización previa por escrito.
                      </li>
                    </ul>
                    Para uso comercial (monetización, publicidad, proyectos
                    pagados, etc.), escríbeme a{" "}
                    <span className="font-semibold">
                      alfred.uri.music@gmail.com
                    </span>{" "}
                    para negociar una licencia.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block mt-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 shadow-md"></span>
                  <span>
                    Para solicitudes comerciales o dudas, escríbeme a
                    <span className="font-semibold">
                      {" "}
                      alfred.uri.music@gmail.com
                    </span>
                    .
                  </span>
                </li>
              </ul>
            </div>
            <h3 className="text-lg font-semibold">
              5. Transparencia con mi audiencia
            </h3>
            Siempre seré claro sobre el origen de mi música: creada por IA,
            impulsada por ideas humanas. Agradezco tu interés y respeto por este
            proyecto, que busca democratizar la creación musical sin perder de
            vista el valor irremplazable del arte humano.
          </div>
        </div>
      </section>

      {/* Botón de Volver Arriba */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 from-purple-900/10 via-pink-500 to-blue-500 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center border-4 border-white/20 hover:scale-110 transition-transform duration-300 animate-glow focus:outline-none"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-7 h-7" />
        </button>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full border border-primary/20 ${social.color} transition-all duration-300 hover:scale-110 hover:animate-glow`}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
          <p className="text-muted-foreground">
            © 2025 Alfred_UArc7. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
