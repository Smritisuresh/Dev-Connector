const express = require("express");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");
const request = require("request");
const Post = require('../../models/Post')
//@route GET api/profile/me
//@desc Get current users profile
//@access Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      "name avatar"
    );
   
    if (!profile) {
      return res.status(400).json({ message: "No Profile Found" });
    }

    res.json(profile)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//@route POST api/profile
//@desc Create or update user profile
//@access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      location,
      status,
      skills,
      bio,
      githubusername,
      company,
      website,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    //Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

//@route GET api/profile
//@desc Get all users profile
//@access Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "name avatar");
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//@route GET api/profile/:user_id
//@desc Get Profile By UserID
//@access Private
router.get("/:user_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", "name avatar");
    if (!profile) return res.status(500).json({ msg: "Profile Not Found" });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(500).json({ msg: "Profile Not Found" });
    }
    res.status(500).send("Server error");
  }
});

//@route DELETE api/profile
//@desc Delete profile, users and post
//@access Private

router.delete("/", async (req, res) => {
  try {
    //Remove Posts
    await Posts.deleteMany({
      user: req.user.id
    })
    //Remove Profile
    await Profile.findOneAndRemove({
      user: req.user.id,
    });

    //Remove User
    await User.findOneAndRemove({
      _id: req.user.id,
    });

    res.json('User Deleted');
  } catch (error) {
    console.error(error.message);
   
    res.status(500).send("Server error");
  }
});



//@route DELETE api/profile/user/:user_id
//@desc Delete Profile By UserID
//@access Private
router.delete("/user/:user_id", auth, async (req, res) => {
  try {
    //Remove Profile
    const profile= await Profile.findOneAndRemove({
      user: req.params.user_id,
    });

    //Remove User
    await User.findOneAndRemove({
      _id: req.params.user_id,
    });

    if (!profile) return res.status(500).json({ msg: "Profile Not Found" });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(500).json({ msg: "Profile Not Found " });
    }
    res.status(500).send("Server error");
  }
});

//@route PUT api/profile/experience
//@desc Add profile experience
//@access Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { company, title, location, from, to, current, description } =
      req.body;

    const newExp = { company, title, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server error");
    }
  }
);

//@route DELETE api/profile//experience/:exp_id
//@desc Delete profile experience
//@access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

//@route PUT api/profile/education
//@desc Add profile education
//@access Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldOfStudy", "Field of study required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { school, degree, fieldOfStudy, from, to, current, description } =
      req.body;

    const newEducation = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server error");
    }
  }
);

//@route DELETE api/profile/education/:edu_id
//@desc Delete profile education
//@access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

//@route GET api/profile/github/:github_id
//@desc GET github profile
//@access Public

router.get("/github/:github_id", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.github_id
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "clientID"
      )}&client_secret=${config.get("githubSecretKey")}`,
      method: "GET",
      headers: { "user-agent": "node-js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200)
        res.status(404).json({ msg: "No github profile found" });

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
