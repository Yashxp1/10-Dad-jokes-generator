import React, { useCallback, useRef, useState } from "react";

const Joke = () => {
  const [joke, setJoke] = useState("Why don't eggs tell jokes? They'd crack up! 😄"); // Initial joke
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const API = "https://icanhazdadjoke.com/";

  // Function to fetch a new joke
  async function fetchJoke() {
    setLoading(true);
    setCopied(false); // Reset copied state when generating a new joke
    try {
      const res = await fetch(API, {
        headers: {
          accept: "application/json",
        },
      });

      const data = await res.json();
      setJoke(data.joke); // Update with fetched joke
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Oops! Couldn't fetch a joke. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const copyRef = useRef(null);

  // Function to copy the joke to clipboard
  const copyToClipboard = useCallback(() => {
    if (copyRef.current) {
      copyRef.current.select();
      try {
        window.navigator.clipboard.writeText(joke);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  }, [joke]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-800">Dad Jokes ✨</h1>
          <p className="text-teal-600 mt-2">Bringing smiles, one joke at a time</p>
        </div>

        {/* Joke Display and Buttons */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 space-y-6">
          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-2xl text-gray-700 text-center">
              {loading ? "Loading..." : joke}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Fetch New Joke Button */}
            <button
              onClick={fetchJoke}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Fetching..." : "New Joke"}
            </button>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className={`px-8 py-3 ${
                copied ? "bg-green-500 hover:bg-green-600" : "bg-rose-500 hover:bg-rose-600"
              } text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg`}
              disabled={loading || !joke}
            >
              {copied ? "Copied!" : "Copy ✨"}
            </button>
          </div>

          {/* Hidden Textarea for Copy Functionality */}
          <textarea
            readOnly
            ref={copyRef}
            value={joke}
            className="hidden"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Joke;
