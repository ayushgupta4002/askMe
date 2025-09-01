"use server"

import prisma from "@/lib/prisma";


export async function createMessage({prompt, response, conversationId, images = []}: {prompt: string, response: string, conversationId: number, images?: string[] } ) {
    // Accept images for user message
    // Accept an optional images array
    // Usage: createMessage({ prompt, response, conversationId, images })
    // For backward compatibility, images is optional
    // const images = arguments[0].images || []; // This line is no longer needed

    const usermessage = prisma.message.create({
        data: {
            content: prompt,
            role: 'user',
            conversationId,
            images, // Use the images parameter directly
        },
    });


    const assistantMessage = prisma.message.create({
        data: {
            content: response,
            role: 'assistant',
            conversationId,
            images: [], // This can be updated to use the images parameter if needed
        },
    });

    return {
        usermessage,
        assistantMessage
    };

}

export async function getConversation({conversationId} : {conversationId: number}){   

    const conversation = prisma.conversation.findUnique({

        where: {
            id: conversationId
        },
        include: {
            messages: true
        }

        

    })
    return conversation;

}

export async function createConversation({ userId}: {userId: number}){ 
    const conversation = await prisma.conversation.create({
        data: {
            title: 'New Conversation',
            userId,
        },
    });
    return conversation;
}


export async function updateConversationTitle({conversationId, title}: {conversationId: number, title: string}){
    const conversation = await prisma.conversation.update({
        where: {
            id: conversationId
        },
        data: {
            title: title
        }
    });
    return conversation;
}


export async function deleteConversation({conversationId}: {conversationId: number}){
    const conversation = await prisma.conversation.delete({
        where: {
            id: conversationId
        }
    });
    return conversation;
}