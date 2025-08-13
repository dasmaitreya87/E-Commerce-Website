import React from 'react';

const NewsLetterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    // You can add form handling logic here
  };

  return (
    <div className="text-center my-16 px-4">
      <p className="text-2xl font-semibold text-gray-800">
        Subscribe Now & Get 20% Off
      </p>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">
        Stay updated with the latest happenings in the fashion world!
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-2/3 md:w-1/2 mx-auto mt-6 flex flex-col sm:flex-row items-center gap-3 border border-gray-300 rounded-full p-2 bg-white"
      >
        <input
          className="w-full flex-1 px-4 py-2 outline-none text-sm sm:text-base rounded-full"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-xs sm:text-sm px-6 sm:px-8 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;

