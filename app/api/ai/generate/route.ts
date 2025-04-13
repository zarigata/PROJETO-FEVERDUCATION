/**
 * /////////////////////////////////////////////////////////////////////////////
 * //                                                                         //
 * //  [FEVERDUCATION] - AI Generation API Route                              //
 * //  ---------------------------------------------------------------        //
 * //  This route handles AI content generation requests by connecting         //
 * //  to the Python AI backend service.                                      //
 * //                                                                         //
 * //  CODEX LEVEL: ALPHA-7                                                   //
 * //  VERSION: 1.0.0                                                         //
 * //  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
 * //                                                                         //
 * /////////////////////////////////////////////////////////////////////////////
 */

import { NextRequest, NextResponse } from "next/server";

// Define expected request body structure
interface GenerationRequest {
  type: string;         // Type of generation (lesson, quiz, handout, etc.)
  subject: string;      // Academic subject
  topic: string;        // Specific topic
  grade: string;        // Grade level
  duration?: number;    // Duration in minutes (if applicable)
  questionCount?: number; // Number of questions (if applicable)
  difficulty?: string;  // Difficulty level (if applicable)
  instructions?: string; // Additional instructions
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json() as GenerationRequest;
    
    // Validate required fields
    if (!body.type || !body.subject || !body.topic || !body.grade) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Prepare the prompt based on generation type
    let systemPrompt = "You are an expert teacher assistant.";
    let userPrompt = "";
    
    switch(body.type) {
      case "lesson":
        systemPrompt += " You design comprehensive, engaging lesson plans.";
        userPrompt = `Create a detailed lesson plan for a ${body.grade} ${body.subject} class on the topic of "${body.topic}"`;
        if (body.duration) {
          userPrompt += ` that will take approximately ${body.duration} minutes`;
        }
        break;
        
      case "quiz":
        systemPrompt += " You create educational assessments and quizzes.";
        userPrompt = `Create a ${body.difficulty || "medium"} difficulty quiz for a ${body.grade} ${body.subject} class on the topic of "${body.topic}"`;
        if (body.questionCount) {
          userPrompt += ` with ${body.questionCount} questions`;
        }
        break;
        
      case "handout":
        systemPrompt += " You create informative educational handouts.";
        userPrompt = `Create an educational handout for a ${body.grade} ${body.subject} class on the topic of "${body.topic}"`;
        break;
        
      default:
        return NextResponse.json(
          { error: "Invalid generation type" },
          { status: 400 }
        );
    }
    
    if (body.instructions) {
      userPrompt += `. Additional instructions: ${body.instructions}`;
    }
    
    // Call the Python AI backend service
    const aiResponse = await fetch("http://localhost:8000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      }),
    });
    
    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      throw new Error(`AI service error: ${errorData.error || aiResponse.statusText}`);
    }
    
    const data = await aiResponse.json();
    
    return NextResponse.json({
      content: data.response,
      metadata: {
        type: body.type,
        subject: body.subject,
        topic: body.topic,
        grade: body.grade,
        generatedAt: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error("Error in AI generate route:", error);
    
    // If it's a fetch error (AI service not available), try to use a fallback message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: "AI service is currently unavailable",
          fallback: true,
          content: "# Generated Content\n\nThe AI service is currently unavailable. Please try again later."
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
