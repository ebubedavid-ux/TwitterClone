import express from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweet,
  likeOrDislike,
  getFollowingTweets,
  bookmarkTweet,
  getUserTweets,
  getTweet,
  getBookmarkedTweets,
} from "../controllers/tweetController.js";
import {} from "../controllers/tweetController.js";

import isAuthenticated from "../config/auth.js";
const router = express.Router();

router.route("/create").post(isAuthenticated, createTweet);
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
router.route("/likeordislike/:id").put(isAuthenticated, likeOrDislike);
router.route("/bookmark/:id").put(isAuthenticated, bookmarkTweet);
router.route("/bookmarks").get(isAuthenticated, getBookmarkedTweets);
router.route("/alltweet/:id").get(isAuthenticated, getAllTweet);
router.route("/followingtweet/:id").get(isAuthenticated, getFollowingTweets);
router.route("/getowntweet/:id").get(isAuthenticated, getUserTweets);
router.route("/tweet/:id").get(isAuthenticated, getTweet);
export default router;