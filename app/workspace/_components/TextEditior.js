import React, { useEffect } from 'react';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
  EditorContent,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import EditiorExtension from './EditiorExtension';

function TextEditior({fileId}) {

    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId
    })

    console.log(notes)

    // console.log(notes);
    const editor = useEditor({
        extensions: [StarterKit,
            Placeholder.configure({
                placeholder:'Start Taking your notes here...'
            }),
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            
        ],
       
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        }
      })

      useEffect(()=>{
        editor&&editor.commands.setContent(notes)
      },[notes&&editor])
    
      
  return (
    <div>
        <EditiorExtension editor={editor} />
        <div className='overflow-scroll h-[88vh]'>
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default TextEditior