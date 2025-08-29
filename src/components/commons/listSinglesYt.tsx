import React from 'react';
import Image from "next/image";
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';
import { Badge } from '../ui/badge';
import SingleYt from '../interface/SingleYt';

export default function ListSinglesYt({ listSingles, isVisible}: { listSingles: SingleYt[], isVisible: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listSingles.map((single, index) => (
                <Card
                  key={single.title}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-105 border-primary/20 bg-card/50 backdrop-blur-sm ${
                    isVisible ? "animate-slide-up" : "opacity-30"
                  }`}
                  style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <a href={`https://www.youtube.com/watch?v=${single.videoId}`} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={single.cover || "/placeholder.svg"}
                        alt={single.title}
                        className="w-auto h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                        width={400}
                        height={192}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="rounded-full animate-glow"
                        >
                          <Play className="w-6 h-6" />
                        </Button>
                      </div>
                      </a>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-2 break-words">{single.title}</h3>
                      <Badge
                        variant="secondary"
                        className="bg-primary/20 text-primary"
                      >
                        {single.plays} reproducciones
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Publicado el{" "}
                        {new Date(single.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
  )
}
