import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Linkedin, Mail, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useBlogPosts } from "@/hooks/use-blog-posts";

const BlogPreview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [api, setApi] = useState<any>(null);
  
  // Fetch blog posts using the hook
  const { blogPosts, isLoading, subscribeToBlogPosts } = useBlogPosts();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToBlogPosts();
    return () => {
      unsubscribe();
    };
  }, [subscribeToBlogPosts]);
  
  const handleReadMore = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };
  
  const handleShare = (platform: string) => {
    if (!selectedPost) return;
    
    const url = window.location.href;
    const title = selectedPost.title;
    
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Confira este artigo: ${title} - ${url}`)}`;
        break;
    }
    
    if (shareUrl) window.open(shareUrl, "_blank");
  };

  useEffect(() => {
    if (api) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [api]);

  if (isLoading) {
    return (
      <section id="Blog" className="container-section relative overflow-hidden">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="container-section relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900/50 -z-20"></div>
      
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-i9-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-i9-orange rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-i9-blue/10 text-i9-blue font-medium text-sm mb-4">
            Blog+
          </span>
          <p className="section-subtitle">
            Artigos, tutoriais e insights para ajudar a manter sua estratégia de marketing digital à frente da concorrência.
          </p>
        </div>
        
        <div className="relative px-6 md:px-10">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="flex">
              {blogPosts?.map((post, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <div 
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="mt-auto">
                        <Button 
                          onClick={() => handleReadMore(post)} 
                          variant="ghost" 
                          className="text-i9-blue hover:text-i9-blue hover:bg-i9-blue/10 p-0 h-auto flex items-center font-medium"
                        >
                          Ler mais <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute top-1/2 -translate-y-1/2 w-full left-0 right-0 flex justify-between pointer-events-none z-10 px-2 md:px-0">
              <CarouselPrevious className="relative pointer-events-auto w-12 h-12 lg:w-16 lg:h-16 opacity-90" />
              <CarouselNext className="relative pointer-events-auto w-12 h-12 lg:w-16 lg:h-16 opacity-90" />
            </div>
          </Carousel>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
            {selectedPost && (
              <div>
                <DialogHeader>
                  <DialogTitle className="text-2xl md:text-3xl font-bold">{selectedPost.title}</DialogTitle>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{selectedPost.date}</span>
                  </div>
                </DialogHeader>
                
                <div className="mt-6">
                  <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={selectedPost.image} 
                      alt={selectedPost.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <article 
                    className="prose dark:prose-invert prose-img:rounded-lg prose-headings:font-semibold prose-a:text-i9-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Compartilhar:
                      </span>
                      <button 
                        onClick={() => handleShare("twitter")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-300">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleShare("facebook")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-300">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleShare("linkedin")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Linkedin size={16} className="text-gray-700 dark:text-gray-300" />
                      </button>
                      <button 
                        onClick={() => handleShare("email")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Mail size={16} className="text-gray-700 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default BlogPreview;