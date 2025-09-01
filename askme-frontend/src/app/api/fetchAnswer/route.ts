import { NextRequest, NextResponse } from 'next/server';
import  { AzureOpenAI } from "openai";
import prisma from "@/lib/prisma";
import { addQuestion } from '@/helpers/users';

// Azure
const endpoint = process.env.OPENAI_ENDPOINT;   
const apiKey = process.env.OPENAI_API_KEY;

const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o-ai-profile-gen";
const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

import { Ratelimit } from '@upstash/ratelimit';

import { kv } from '@vercel/kv';
const rateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(6, '60 s'), // 5 requests in 10 seconds
});


// GET handler
export async function GET() {
  return NextResponse.json({ message : "hello there!" });
}

// POST handler
export async function POST(request: NextRequest) {
  try {

    // const apiKey = request.headers.get('x-api-key');
    
    // // Store your API key in environment variables
    
    // if (!apiKey || apiKey !== validApiKey) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }'


          const { success } = await rateLimit.limit(request.ip ?? 'anonymous');
          if (!success) {
                return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
          }

    const body = await request.json();
    const question = body.question;
    const apiKey = body.apiKey;
    if(!apiKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
    if(!question ){
      return NextResponse.json(
        { error: 'Invalid Question field' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        apiKey: apiKey,
        },
    });



    if(!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    if(user.credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 401 }
      );
    }
    if(!user.context) {
      return NextResponse.json(
        { error: 'Please add some context first' },
        { status: 401 }
      );
    }

    const prompt = `question: ${question} , context : ${user.context} `
    const systemPrompt = `You are an AI assistant acting *on behalf of the user*. The user has uploaded their resume and authorized you to search the web and summarize everything about their career, achievements, public presence, and professional reputation.

Your job is to answer any job application or career-related questions **as if you were the user themselves**—confident, honest, and well-prepared. You have full access to all the context about the user, including their resume and online footprint.

Keep your answers concise, impactful, and professional—like a top candidate answering an application form or interview. Always speak in first-person (I, my) as the user.
**IMPORTANT**: You are not a chatbot. You are the user, and you should answer as if you were them.no need to say "I am an AI assistant" or anything similar. You are the user, and you should answer as if you were them.
Make sure to:
- keep it concise and impactful.No need to write long paragraphs.
- Use professional data, past job roles, KPIs, and achievements when relevant.
- Include insights pulled from context data (articles, GitHub, LinkedIn, blogs, etc.) if helpful.
- Be thoughtful and persuasive, but avoid exaggeration.
- Use a tone that's mature, driven, and authentic.
- do not write in markdown format just write normal text.
- write small and precise answers

If the question is vague, assume it’s a job application context and aim to showcase the user’s strengths clearly.`;

    
        try {
  
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `${
                systemPrompt
            }`,
          },
          { role: "user", content: prompt },
        ],
      });
  
  
      const messageContent = response.choices[0]?.message?.content;
      if (!messageContent) {
        throw new Error("Response message content is null or undefined");
      }
  
  
      const dataResponse =  {
        answer: messageContent,
      };

      await addQuestion(user.id, question, messageContent);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          credits: user.credits - 1,
        },
      });
      return NextResponse.json(dataResponse, { status: 200 });

    } catch (error) {
      console.error("Error refining data:", error);
      return NextResponse.json(
        { error: 'Internal serverr error' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
} 