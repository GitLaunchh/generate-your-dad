"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download, Sparkles, Palette } from "lucide-react"

const colorPresets = [
  { name: "Classic Dad", shirt: "blue", pants: "brown", hair: "brown" },
  { name: "Cool Dad", shirt: "black", pants: "dark blue", hair: "gray" },
  { name: "Summer Dad", shirt: "yellow", pants: "khaki", hair: "blonde" },
  { name: "Retro Dad", shirt: "green", pants: "orange", hair: "red" },
  { name: "Business Dad", shirt: "white", pants: "black", hair: "black" },
  { name: "Casual Dad", shirt: "red", pants: "blue jeans", hair: "brown" },
]

export default function DadGenerator() {
  const [details, setDetails] = useState({
    shirtColor: "blue",
    pantsColor: "brown",
    hairColor: "brown",
    additionalDetails: "",
  })
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)
    setImageLoaded(false)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()

      // Preload the image to make it appear instantly
      const img = new Image()
      img.onload = () => {
        setGeneratedImage(data.imageUrl)
        setImageLoaded(true)
        setIsGenerating(false)
      }
      img.onerror = () => {
        // If preload fails, still show the image
        setGeneratedImage(data.imageUrl)
        setImageLoaded(true)
        setIsGenerating(false)
      }
      img.src = data.imageUrl
    } catch (err) {
      setError("Failed to generate image. Please try again.")
      console.error("Error:", err)
      setIsGenerating(false)
    }
  }, [details])

  const handleShirtColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target) {
      setDetails((prev) => ({ ...prev, shirtColor: e.target.value }))
    }
  }, [])

  const handlePantsColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target) {
      setDetails((prev) => ({ ...prev, pantsColor: e.target.value }))
    }
  }, [])

  const handleHairColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target) {
      setDetails((prev) => ({ ...prev, hairColor: e.target.value }))
    }
  }, [])

  const handleAdditionalDetailsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e && e.target) {
      setDetails((prev) => ({ ...prev, additionalDetails: e.target.value }))
    }
  }, [])

  const handlePresetSelect = useCallback((preset: (typeof colorPresets)[0]) => {
    setDetails({
      shirtColor: preset.shirt,
      pantsColor: preset.pants,
      hairColor: preset.hair,
      additionalDetails: "",
    })
  }, [])

  const handleDownload = useCallback(async () => {
    if (!generatedImage) return

    try {
      // Fetch the image as blob to ensure PNG format
      const response = await fetch(generatedImage)
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "pixel-dad.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      // Fallback to direct download
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = "pixel-dad.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [generatedImage])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-100 via-amber-50 to-stone-100 p-4"
      style={{
        backgroundImage: `
        radial-gradient(circle at 25% 25%, #22c55e 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, #a3a3a3 2px, transparent 2px)
      `,
        backgroundSize: "20px 20px",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-amber-600 to-stone-600 bg-clip-text text-transparent mb-4 font-mono tracking-wider">
            GENERATE YOUR DAD
          </h1>
          <div className="bg-stone-800 text-green-400 p-4 rounded-none border-4 border-stone-600 font-mono text-lg max-w-2xl mx-auto">
            <p>&gt; Create a unique pixel art dad character_</p>
            <p className="text-amber-400">&gt; Retro 2D game-style sprites for your projects!</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-2xl border-4 border-stone-600 rounded-none bg-gradient-to-b from-stone-200 to-stone-300">
            <CardHeader className="bg-green-600 text-white border-b-4 border-stone-600">
              <CardTitle className="flex items-center gap-2 font-mono text-xl">
                <Sparkles className="w-6 h-6 text-amber-300" />
                CUSTOMIZE YOUR DAD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Color Presets */}
              <div>
                <Label className="font-mono text-stone-800 font-bold mb-3 block">
                  <Palette className="w-4 h-4 inline mr-2" />
                  QUICK PRESETS
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      variant="outline"
                      className="text-xs font-mono border-2 border-stone-600 rounded-none bg-stone-100 hover:bg-stone-200 text-stone-800 p-2 h-auto"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shirtColor" className="font-mono text-stone-800 font-bold">
                    SHIRT COLOR
                  </Label>
                  <Input
                    id="shirtColor"
                    value={details.shirtColor}
                    onChange={handleShirtColorChange}
                    placeholder="blue, red, green..."
                    className="mt-2 border-2 border-stone-600 rounded-none bg-stone-100 font-mono focus:border-green-600"
                  />
                </div>
                <div>
                  <Label htmlFor="pantsColor" className="font-mono text-stone-800 font-bold">
                    PANTS COLOR
                  </Label>
                  <Input
                    id="pantsColor"
                    value={details.pantsColor}
                    onChange={handlePantsColorChange}
                    placeholder="brown, black, navy..."
                    className="mt-2 border-2 border-stone-600 rounded-none bg-stone-100 font-mono focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hairColor" className="font-mono text-stone-800 font-bold">
                  HAIR COLOR
                </Label>
                <Input
                  id="hairColor"
                  value={details.hairColor}
                  onChange={handleHairColorChange}
                  placeholder="brown, black, blonde, gray..."
                  className="mt-2 border-2 border-stone-600 rounded-none bg-stone-100 font-mono focus:border-green-600"
                />
              </div>

              <div>
                <Label htmlFor="additionalDetails" className="font-mono text-stone-800 font-bold">
                  EXTRA DETAILS
                </Label>
                <Textarea
                  id="additionalDetails"
                  value={details.additionalDetails}
                  onChange={handleAdditionalDetailsChange}
                  placeholder="Add accessories, facial hair, expressions..."
                  className="mt-2 min-h-[100px] border-2 border-stone-600 rounded-none bg-stone-100 font-mono focus:border-green-600"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-mono font-bold py-4 px-6 border-4 border-stone-800 rounded-none shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    GENERATING DAD...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    GENERATE DAD
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-600 border-4 border-red-800 rounded-none text-white font-mono font-bold">
                  ERROR: {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="shadow-2xl border-4 border-stone-600 rounded-none bg-gradient-to-b from-stone-200 to-stone-300">
            <CardHeader className="bg-amber-600 text-white border-b-4 border-stone-600">
              <CardTitle className="font-mono text-xl">YOUR GENERATED DAD</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-square bg-stone-800 border-4 border-stone-600 flex items-center justify-center relative overflow-hidden">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-green-400 mx-auto mb-4" />
                    <p className="text-green-400 font-mono font-bold text-lg">CRAFTING PIXEL DAD...</p>
                    <div className="mt-4 flex justify-center space-x-1">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-green-400 animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="Generated pixel dad character"
                      className="w-full h-full object-contain"
                      style={{
                        opacity: imageLoaded ? 1 : 0,
                        transition: "opacity 0.1s ease-in-out",
                      }}
                      onLoad={handleImageLoad}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-green-400">
                    <div className="w-20 h-20 mx-auto mb-4 border-4 border-green-400 flex items-center justify-center">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <p className="font-mono font-bold text-lg">PIXEL DAD WILL SPAWN HERE</p>
                  </div>
                )}
              </div>

              {/* Download Button */}
              {generatedImage && imageLoaded && (
                <Button
                  onClick={handleDownload}
                  className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold py-3 border-4 border-stone-800 rounded-none"
                >
                  <Download className="w-5 h-5 mr-2" />
                  DOWNLOAD PNG
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ca: Section */}
        <Card className="mt-8 border-4 border-stone-600 rounded-none bg-gradient-to-b from-blue-200 to-blue-300">
          <CardHeader className="bg-blue-600 text-white border-b-4 border-stone-600">
            <CardTitle className="font-mono text-xl">Ca: </CardTitle>
          </CardHeader>
        </Card>

        {/* Footer with X Logo */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://x.com/i/communities/1933960480621535739/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-none border-4 border-stone-600 transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
