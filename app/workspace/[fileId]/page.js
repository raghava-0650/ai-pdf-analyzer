"use client"
import React, { useEffect } from 'react';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';

import PdfViewer from '../_components/PdfViewer';
import TextEditior from '../_components/TextEditior';
import WorkspaceHeader from '../_components/WorkspaceHeader';

function Workspace() {
    const {fileId}=useParams();
    const fileInfo=useQuery(api.fileStorage.GetFileRecord,{
        fileId:fileId
    })

    useEffect(()=>{
        console.log(fileInfo)
    },[fileInfo])

   
  return (
    <div>
        <WorkspaceHeader fileName={fileInfo?.fileName}/>

        <div className='grid grid-cols-2 gap-5'>
            <div>
                {/* Text Editor  */}
                <TextEditior fileId={fileId}  />
            </div>
            <div>
                {/* Pdf Viewer  */}
                <PdfViewer fileUrl={fileInfo?.fileUrl}/>
            </div>
        </div>
    </div>
  )
}

export default Workspace