import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import Avatar from "react-avatar";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { VscComment } from "react-icons/vsc";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { TWEET_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";


const Tweet = ({  tweet, user, setTweets, isActive }) => {
  
  const [imageError, setImageError] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const location = useLocation();

  const fetchTweets = async () => {
    try {
      const res = await axios.get(
        isActive
          ? `${TWEET_API_END_POINT}/alltweet/${user._id}`
          : `${TWEET_API_END_POINT}/followingtweet/${user._id}`,
        { withCredentials: true }
      );
      setTweets(res.data.tweets);
      
    } catch (error) {
      console.log(error);
    }
  };

  

  const likeOrDislikeHandler = async (id) => {
    try {
      await axios.put(
        `${TWEET_API_END_POINT}/likeordislike/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      fetchTweets();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to like/dislike tweet."
      );
    }
  };

  const bookmarkHandler = async (id) => {
    try {
      await axios.put(
        `${TWEET_API_END_POINT}/bookmark/${id}`,
        {},
        {withCredentials: true}
      );
      fetchTweets();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to bookmark tweet."
      );
    }
  }

  const deleteTweetHandler = async (id) => {
    try {
      await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });
      fetchTweets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete tweet.");
    }
  };

  console.log("Tweet received:", tweet);

  useEffect(() => {
  const fetchCommentCount = async () => {
    try {
      const res = await axios.get(
        `${TWEET_API_END_POINT}/comments/count/${tweet._id}`,
        { withCredentials: true }
      );
      setCommentCount(res.data.count);
    } catch (error) {
      console.log("Failed to fetch comment count");
    }
  };

  if (tweet?._id) fetchCommentCount();
}, [tweet?._id, location]);

console.log("Image URL:", tweet?.image);


 return (
  <div className="border-b border-b-gray-200 text-black">
    <div className="flex p-4">
      <Avatar
        src={
          tweet?.userId?.profilePhoto ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        size="40"
        round={true}
      />

      <div className="ml-2 w-full">
        {/* Wrap ONLY the tweet content in the Link */}
        <Link to={`/tweet/${tweet._id}`} className="block w-full text-black hover:text-black no-underline">
          <div className="flex items-center">
            <h1 className="font-bold text-xl">
              {tweet?.userId?.name || "Unknown User"}
            </h1>
            <p className="text-gray-500 text-sm ml-1">
              @{tweet?.userId?.username || "unknown"}
            </p>
          </div>

          <p className="mt-1">{tweet?.description || "No description available."}</p>

          {tweet?.image && !imageError && (
            <div className="my-3 ">
              <img
                src={tweet.image}
                alt="Tweet"
                className="w-full rounded-lg object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {imageError && tweet?.image && (
            <p className="text-red-500 text-sm my-3">Failed to load image.</p>
          )}
        </Link>

        {/* Action Buttons (Not wrapped in Link) */}
        <div className="flex justify-between my-3">
          <div className="flex items-center">
            <div className="p-2 hover:cursor-pointer hover:bg-green-100 rounded-full">
              <VscComment size={"21px"} />
            </div>
           <p>{commentCount}</p>

          </div>

          <div className="flex items-center">
            <div
              onClick={() => likeOrDislikeHandler(tweet?._id)}
              className="p-2 hover:cursor-pointer hover:bg-pink-200 rounded-full"
            >
              <CiHeart size={"27px"} />
            </div>
            <p>{tweet?.like?.length || 0}</p>
          </div>

          <div className="flex items-center">
            <div
              onClick={() => bookmarkHandler(tweet?._id)}
              className="p-2 hover:cursor-pointer hover:bg-yellow-100 rounded-full"
            >
              <CiBookmark
                size={"24px"}
                color={tweet?.bookmarks?.includes(user?._id) ? "gold" : "black"}
              />
            </div>
            <p>{tweet?.bookmarks?.length || 0}</p>
          </div>

          {user?._id === tweet?.userId?._id && (
            <div
              onClick={() => deleteTweetHandler(tweet?._id)}
              className="flex items-center"
            >
              <div className="p-2 hover:cursor-pointer hover:bg-red-500 rounded-full">
                <MdOutlineDeleteOutline size={"24px"} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)};

export default Tweet;
