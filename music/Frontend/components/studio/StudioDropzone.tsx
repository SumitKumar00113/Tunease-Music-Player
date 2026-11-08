"use client";

import { FileAudio2 } from "lucide-react";

export default function StudioDropzone({ onChoose, onDrop }: { onChoose: () => void; onDrop: (file?: File) => void }) {
  return <button type="button" className="studio-dropzone w-full px-5" onClick={onChoose} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onDrop(event.dataTransfer.files[0]); }}>
    <FileAudio2 size={29} className="text-lav" />
    <strong>Drag your audio file here</strong>
    <small>MP3 or WAV, up to 50 MB</small>
    <span className="studio-button studio-button-flat">Choose file</span>
  </button>;
}
