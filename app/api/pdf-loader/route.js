import { NextResponse } from 'next/server';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// const pdfUrl="https://grand-lion-750.convex.cloud/api/storage/d25f3b88-7570-48f8-9e8b-944f296d56ad"
export async function GET(req) {
   
    const reqUrl=req.url;
    const {searchParams}=new URL(reqUrl);
    const pdfUrl=searchParams.get('pdfUrl');
    console.log(pdfUrl);
    //1. Load the PDF File
    const response=await fetch(pdfUrl);
    const data=await response.blob();
    const loader=new PDFLoader(data);
    const docs=await loader.load();

    let pdfTextContent='';
    docs.forEach(doc=>{
        pdfTextContent=pdfTextContent+doc.pageContent+" ";
    })

    //2. Split the Text into Small Chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    });
    const output = await splitter.createDocuments([pdfTextContent]);
    
    let splitterList=[];
    output.forEach(doc=>{
        splitterList.push(doc.pageContent);
    })

    return NextResponse.json({result:splitterList})
    
}