const express = require("express");
const { validationResult, check } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

const router = express.Router();

//@route POST api/posts
//@desc Create Post
//@access Private

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ msg: errors.array() });
    try {
      const user = await User.findById(req.user.id).select("-password");
      
      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      const post = await new Post(newPost).save();
      
      res.json(post);

    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

//@route GET api/posts
//@desc Get all posts
//@access Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//@route GET api/posts/:post_id
//@desc Get posts By PostID
//@access Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(500).json({ msg: "Post Not Found " });
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(500).json({ msg: "Post Not Found " });
    }
    res.status(500).send("Server error");
  }
});

//@route DELETE api/posts/:post_id
//@desc Delete posts By post ID
//@access Private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    //Remove Post
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(500).json({ msg: "Post Not Found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();
    res.json({ msg: "Post removed successfully" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(500).json({ msg: "Post Not Found " });
    }
    res.status(500).send("Server error");
  }
});

//@route PUT api/posts/like/:id
//@desc Like a post
//@access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post is already being liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

//@route PUT api/posts/unlike/:id
//@desc Unlike a post
//@access Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post is already being liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post not liked" });
    }
    const removeIndex = post.likes
      .map((item) => item.id)
      .indexOf(req.params.id);
    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

//@route POST api/posts/comment/:id
//@desc Create Post Comment
//@access Private

router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ msg: errors.array() });
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      const post = await Post.findById(req.params.id);
      post.comments.unshift(newComment);
      await post.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      if (error.kind === "ObjectId") {
        return res.status(500).json({ msg: "Post Not Found " });
      }
      res.status(500).json({ msg: "Server error" });
    }
  }
);

//@route DELETE api/posts/comment/:id/:comment_id
//@desc Delete comment
//@access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //Remove Post
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(500).json({ msg: "Post Not Found" });

    //Find comment to delete
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    //Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //Removeindex
    const removeIndex = post.comments
      .filter((item) => item.id)
      .indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);



  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(500).json({ msg: "Post Not Found " });
    }
    res.status(500).send("Server error");
  }
});
module.exports = router;
