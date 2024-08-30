import { NextResponse } from "next/server";

export async function POST(request) {
  const { imageUrl, modelVariant } = await request.json();

  try {
    const apiUrl = new URL(
      "https://brimink--ai-image-classifier-api-classify-image.modal.run/"
    );
    apiUrl.searchParams.append("image_url", imageUrl);
    
    if (modelVariant !== "default") {
      apiUrl.searchParams.append("model_v", modelVariant);
    }

    const response = await fetch(apiUrl.toString());
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error classifying image:", error);
    return NextResponse.json(
      { error: "Error classifying image" },
      { status: 500 }
    );
  }
}
