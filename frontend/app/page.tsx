"use client";

import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [story, setStory] = useState("");
  const [frames, setFrames] = useState<string[]>([]);
  const [framePrompts, setFramePrompts] = useState<string>("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStory("");
    setFrames([]);
    const res = await fetch("http://localhost:3001/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: storyPrompt }),
    });
    const data = await res.json();
    setStory(data.story);
    if (data.story !== "No story generated." && data.story !== "") {
      setFramePrompts(data);
      callFramesApi();
    }
  };

  const callFramesApi = async () => {
    const res = await fetch("http://localhost:3001/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompts: framePrompts
      }),
    });
    const data = await res.json();
    const framesList: string[] = data.url.split(", ").map((url: string) => url.trim());
    setFrames(framesList);
  };

  const downloadImage = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `frame_${Date.now()}.png`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-indigo-100">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          🎬 AI Storyboard Animator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <textarea
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            placeholder="✨ Write your magical idea here..."
            className="w-full p-5 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm text-lg placeholder-indigo-400 text-indigo-400"
            rows={4}
          />
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:opacity-90 transition duration-300"
          >
            🚀 Generate Story & Frames
          </button>
        </form>

        {story && (
          <div className="mt-10 bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl shadow-inner">
            <h2 className="text-2xl font-bold mb-3 text-purple-700">📝 Your Story</h2>
            <p className="text-gray-800 leading-relaxed text-lg">{story}</p>
          </div>
        )}

        {frames.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">🎨 Storyboard Frames</h2>

            <div className={`grid gap-6 ${frames.length === 1 ? "grid-cols-1" : frames.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
              {frames.map((frame, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer"
                  onClick={() => setSelectedImage(frame)}
                >
                  <img src={frame} alt={`Frame ${index + 1}`} className="w-full h-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transparent Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 cursor-pointer transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-[85%] max-w-5xl"
            onClick={(e) => e.stopPropagation()} // prevent modal close when clicking image
          >
            <img
              src={selectedImage}
              alt="Selected Frame"
              className="w-full h-auto rounded-xl shadow-2xl"
            />
            <button
              onClick={() => downloadImage(selectedImage)}
              className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition"
            >
              <ArrowDownTrayIcon className="h-6 w-6 text-indigo-600" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
