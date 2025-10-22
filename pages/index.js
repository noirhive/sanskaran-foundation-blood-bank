import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="absolute inset-0 bg-[url('/blood-bg-animation.svg')] bg-cover opacity-20 animate-pulse"></div>
      
      <h1 className="font-bold text-4xl md:text-6xl text-red-700 font-hind-siliguri z-10">
        “রক্ত দিন, জীবন বাঁচান”
      </h1>
      <p className="mt-4 text-lg md:text-2xl text-gray-700 font-hind-siliguri z-10 max-w-3xl">
        সৎ উদ্দেশ্যে পরিচালিত সন্সকারণ ফাউন্ডেশন রক্তদান কার্যক্রমের মাধ্যমে মানবতার সেবা করে। 
        এক ফোঁটা রক্ত বাঁচাতে পারে একটি জীবন।
      </p>

      <div className="flex gap-6 mt-10 z-10">
        <Link href="/post-request">
          <button className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition">
            রক্তের অনুরোধ করুন
          </button>
        </Link>
        <Link href="/donors">
          <button className="bg-white border border-red-600 text-red-700 px-6 py-3 rounded-full shadow-lg hover:bg-red-50 transition">
            দাতা তালিকা দেখুন
          </button>
        </Link>
      </div>
    </div>
  );
}
