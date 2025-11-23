import { useEffect, useState, useRef, useMemo } from "react";
import {
  Search,
  Menu,
  X,
  Home,
  Tv,
  Film,
  Plus,
  User,
  LogIn,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import "./index.css";




export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleMovies, setVisibleMovies] = useState(10);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [topRatedApi, setTopRatedApi] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroApi, setHeroApi] = useState(null);
  
  // Initialize autoplay with 2 second delay for hero carousel
  const heroAutoplay = useRef(
    Autoplay({ 
      delay: 2000, 
      stopOnInteraction: false 
    })
  );

  // Sync hero carousel index with Embla API
  useEffect(() => {
    if (!heroApi) return;
    
    const onSelect = () => {
      setHeroIndex(heroApi.selectedScrollSnap());
    };
    
    onSelect();
    heroApi.on("select", onSelect);
    
    return () => {
      heroApi.off("select", onSelect);
    };
  }, [heroApi]);
  // Autoplay for top rated carousel
  const topRatedAutoplay = useRef(
    Autoplay({ 
      delay: 2000, 
      stopOnInteraction: true 
    })
  );

  // Filter movies based on selected genre
  const filteredMovies = useMemo(() => {
    if (selectedGenre === "All") return movies;
    return movies.filter(
      (movie) =>
        movie.genres?.includes(selectedGenre) ||
        (movie.genre &&
          movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()))
    );
  }, [movies, selectedGenre]);

  // Top rated movies list (shared between carousel slides and dots)
  const topRatedMovies = useMemo(() => {
    return movies
      .filter((m) => m.rating >= 8.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [movies]);

  // Sync top rated carousel index with Embla API
  useEffect(() => {
    if (!topRatedApi) return;

    const onSelect = () => {
      setTopRatedIndex(topRatedApi.selectedScrollSnap());
    };

    onSelect();
    topRatedApi.on("select", onSelect);

    return () => {
      topRatedApi.off("select", onSelect);
    };
  }, [topRatedApi]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/movies.json");
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : []);

        // Show welcome toast after 1 second (only once per session)
        if (!sessionStorage.getItem("hasSeenWelcome")) {
          setTimeout(() => {
            toast.success("Welcome to CineStream!", {
              description: "Discover amazing movies and series",
              duration: 2000,
            });
            sessionStorage.setItem("hasSeenWelcome", "true");
          }, 1000);
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLoadMore = () => {
    setVisibleMovies((prev) => Math.min(prev + 10, filteredMovies.length));
  };

  return (
    <div className="min-h-dvh bg-[#050509] text-white">
      {/* Header */}
      {/* Mobile Menu Button */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/50 border-b border-white/5 shadow-lg">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-6 px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-300 hover:text-white hover:bg-transparent h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <span className="text-2xl font-bold tracking-wide bg-linear-to-r from-[#f4c272] to-[#ff9d00] bg-clip-text text-transparent">
              CineStream
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Button
              variant="ghost"
              className="h-10 px-4 text-white hover:bg-white/50"
            >
              <span className="relative">
                <Home size={16} className="inline mr-1.5 -mt-0.5" />
                Home
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#f4c272] scale-x-100"></span>
              </span>
            </Button>
            <Button
              variant="ghost"
              className="h-10 px-4 text-slate-300 hover:text-white hover:bg-white/5"
            >
              <Tv size={16} className="inline mr-1.5 -mt-0.5" />
              TV Shows
            </Button>
            <Button
              variant="ghost"
              className="h-10 px-4 text-slate-300 hover:text-white hover:bg-white/5"
            >
              <Film size={16} className="inline mr-1.5 -mt-0.5" />
              Movies
            </Button>
            <Button
              variant="ghost"
              className="h-10 px-4 text-slate-300 hover:text-white hover:bg-white/5"
            >
              <Plus size={16} className="inline mr-1.5 -mt-0.5" />
              New
            </Button>
          </nav>

          {/* Search Bar */}
          <div className="ml-auto flex-1 max-w-md">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f4c272]"
              />
              <input
                aria-label="Search"
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f4c272]/50 focus:border-transparent transition-all"
                placeholder="Search"
              />
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative w-8 h-8 rounded-full p-0 hover:bg-transparent"
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Profile"
                    />
                    <AvatarFallback>U</AvatarFallback>
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050509]" />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#beb373] border-white/10 text-white/80">
                <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <User size={16} className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <LogIn size={16} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {/* Mobile Menu with shadcn Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[350px] p-0 bg-[#0f172a] border-r border-white/5"
        >
          <SheetHeader className="border-b border-white/5 p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Profile"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <SheetTitle className="text-white">My Profile</SheetTitle>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <nav className="p-2 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="mr-3 h-5 w-5 text-[#f4c272]" />
                <span>Home</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 text-slate-300 hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Tv className="mr-3 h-5 w-5" />
                <span>TV Shows</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 text-slate-300 hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Film className="mr-3 h-5 w-5" />
                <span>Movies</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 text-slate-300 hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus className="mr-3 h-5 w-5" />
                <span>New & Popular</span>
              </Button>
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-white/5">
            <Button
              variant="default"
              className="w-full bg-[#f4c272] text-[#050509] hover:bg-[#f4c272]/90"
              onClick={() => setMobileMenuOpen(false)}
            >
              Close Menu
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* Toast Container */}
      <Toaster position="top-center" richColors />
      <div className=""></div> {/* Spacer for fixed header */}
      <main className="mx-auto max-w-[1920px] pb-16 space-y-10">
        {/* Hero Carousel with Autoplay */}
        {!loading && movies.length > 0 && (
          <div className="w-full mx-auto py-6">
            <Carousel
              className="w-full group relative"
              plugins={[heroAutoplay.current]}
              onMouseEnter={heroAutoplay.current.stop}
              onMouseLeave={() => heroAutoplay.current.reset()}
              setApi={setHeroApi}
              opts={{ loop: true, align: 'start' }}
            >
              <CarouselContent>
                {movies.slice(0, 5).map((movie) => (
                  <CarouselItem key={movie.id}>
                    <div className="p-1">
                      <div className="relative h-[75vh] min-h-[500px] overflow-hidden rounded-xl">
                        <img
                          src={movie.cover_picture || movie.poster_large}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/30 px-3 py-1.5 rounded-full">
                {movies.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => heroApi && heroApi.scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === heroIndex 
                        ? "w-6 bg-[#f4c272]" 
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <CarouselPrevious className="left-2 h-12 w-12 bg-black/50 border-none hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CarouselNext className="right-2 h-12 w-12 bg-black/50 border-none hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Carousel>
          </div>
        )}
        {/* Filter Section */}
        <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2 hide-scrollbar">
            {["All", "Action", "Comedy", "Drama", "Thriller", "Sci-Fi"].map(
              (genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`shrink-0 px-4 py-2 rounded-full font-medium ${selectedGenre === genre
                      ? "bg-[#f4c272] text-[#050509]"
                      : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  {genre}
                </button>
              )
            )}
          </div>
        </div>
        {/* Trending Now Section */}
        <section className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            <button className="text-sm font-medium text-[#f4c272] hover:text-[#f4c272]/90 flex items-center">
              See All
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          {/* Grid */}
          <div className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-2/3 rounded-2xl bg-[#1a1a2e] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {filteredMovies.slice(0, visibleMovies).map((m) => (
                    <div
                      key={m.id}
                      className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                    >
                      <div className="aspect-2/3 bg-[#1a1a2e] relative">
                        <img
                          src={m.card_picture || m.poster_small}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Genre Tag */}
                        {m.genre && (
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {m.genre.split(",")[0].trim()}
                          </div>
                        )}
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-white font-semibold text-sm line-clamp-2">
                            {m.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-200 mt-1">
                            <span>
                              {m.released_date?.split("-")[0] || m.year}
                            </span>
                            <span>•</span>
                            <span className="text-[#f4c272]">
                              ⭐ {m.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Default Content */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/90 via-black/30 to-transparent text-white group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="text-sm font-semibold line-clamp-2">
                          {m.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-300">
                          <span>
                            {m.released_date?.split("-")[0] || m.year}
                          </span>
                          <span>•</span>
                          <span className="text-[#f4c272]">⭐ {m.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {visibleMovies < filteredMovies.length && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      className="bg-[#f4c272] text-[#050509] hover:bg-[#f4c272]/90 px-8 py-2 rounded-full font-medium"
                    >
                      See more
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        {/* Top rated movies */}
        {/* Top Rated Movies Carousel */}
        <section className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Top Rated Movies</h2>
            {/* <button className="text-sm font-medium text-[#f4c272] hover:text-[#f4c272]/90 flex items-center">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </button> */}
          </div>

          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[topRatedAutoplay.current]}
              onMouseEnter={topRatedAutoplay.current.stop}
              onMouseLeave={() => topRatedAutoplay.current.reset()}
              setApi={setTopRatedApi}
              className="w-full group"
            >
              <CarouselContent className="-ml-2">
                {!loading &&
                  topRatedMovies.map((movie, index) => (
                    <CarouselItem
                      key={`top-rated-${movie.id}`}
                      data-active={index === topRatedIndex}
                      className="pl-2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 scale-90 data-[active=true]:scale-100 transition-transform duration-300"
                    >
                      <div className="relative group rounded-xl overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:-translate-y-1">
                        <div className="aspect-2/3 bg-[#1a1a2e] relative">
                          <img
                            src={
                              movie.card_picture ||
                              movie.cover_picture ||
                              movie.poster_large ||
                              movie.poster_medium ||
                              movie.poster_small
                            }
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Rating Badge */}
                          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            ⭐ {movie.rating}
                          </div>
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-white font-semibold text-sm line-clamp-2">
                              {movie.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-200 mt-1">
                              <span>
                                {movie.released_date?.split("-")[0] ||
                                  movie.year}
                              </span>
                              <span>•</span>
                              <span>
                                {movie.genre?.split(",")[0]?.trim()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 h-10 w-10 bg-black/70 border-none hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CarouselNext className="right-2 h-10 w-10 bg-black/70 border-none hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Top Rated Tracker Dots */}
              {topRatedMovies.length > 1 && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {topRatedMovies.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => topRatedApi && topRatedApi.scrollTo(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${index === topRatedIndex
                          ? "w-6 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/80"
                        }`}
                      aria-label={`Go to top rated slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </Carousel>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/5 bg-black/40 bg-linear-to-t from-black/60 via-black/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Brand + Description */}
            <div className="space-y-3 max-w-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-wide bg-linear-to-r from-[#f4c272] to-[#ff9d00] bg-clip-text text-transparent">
                  CineStream
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Your cinematic home for movies and shows. Stream the best stories from around the world in one beautiful experience.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-3 gap-8 text-sm text-slate-300">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Browse</h4>
                <button className="block hover:text-white">Home</button>
                <button className="block hover:text-white">TV Shows</button>
                <button className="block hover:text-white">Movies</button>
                <button className="block hover:text-white">New &amp; Popular</button>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Support</h4>
                <button className="block hover:text-white">Help Center</button>
                <button className="block hover:text-white">Account</button>
                <button className="block hover:text-white">Contact Us</button>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Follow Us</h4>
                <div className="flex items-center gap-3">
                  <button
                    className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors"
                    aria-label="Follow on YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </button>
                  <button
                    className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors"
                    aria-label="Follow on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button
                    className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors"
                    aria-label="Follow on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} CineStream. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button className="hover:text-slate-300">Terms</button>
              <button className="hover:text-slate-300">Privacy</button>
              <button className="hover:text-slate-300">Cookies</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
