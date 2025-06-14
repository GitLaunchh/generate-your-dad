import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { shirtColor, pantsColor, hairColor, additionalDetails } = await request.json()

    // Enhanced prompt for better pixel art results
    const basePrompt = `pixel art sprite character of a friendly dad, 16-bit retro video game style, wearing ${shirtColor} shirt and ${pantsColor} pants, ${hairColor} hair, standing pose facing forward, arms slightly out, blocky pixels, flat colors, simple shading, 8-bit aesthetic, game character sprite, clean pixel art style, retro gaming, nintendo style`

    // Add additional details if provided
    const fullPrompt = additionalDetails ? `${basePrompt}, ${additionalDetails}, pixel art style` : basePrompt

    console.log("Generating with prompt:", fullPrompt)

    // Using Pollinations AI - completely free API with instant response
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}&model=flux&enhance=true&nologo=true`

    // Return immediately without any delay
    return NextResponse.json({
      imageUrl,
      prompt: fullPrompt,
      colors: { shirtColor, pantsColor, hairColor },
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
