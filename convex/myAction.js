import { v } from 'convex/values';

import { TaskType } from '@google/generative-ai';
import { ConvexVectorStore } from '@langchain/community/vectorstores/convex';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

import { action } from './_generated/server.js';

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string()
  },
  handler: async (ctx,args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText,// Array
      {fileId:args.fileId},//String
      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyCEAuNzIDjbhYW4BBxKTjeNE8FdVqolvS0',
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }

    );
    return "Completed.."

  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId:v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyCEAuNzIDjbhYW4BBxKTjeNE8FdVqolvS0',
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
       { ctx });
      console.log(args.fileId)
    const resultOne = await (await vectorStore.similaritySearch(args.query, 1))
    .filter(q=>q.metadata.fileId==args.fileId)
    
    console.log(resultOne);

    return JSON.stringify(resultOne);
  },
});