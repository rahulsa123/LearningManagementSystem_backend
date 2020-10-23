const express = require("express");
const routes = express.Router();
const { User, validateUser } = require("./../models/user");
const formidale = require("formidable");
const fs = require("fs");
const path = require("path");
const validateObjectId = require("./../middleware/validateObjectId");
const auth = require("../middleware/auth");
const extend = require("lodash/extend");

const cloudinary = require("cloudinary").v2;

routes.get("/", async (req, res) => {
  try {
    const users = await User.find().select("").select("-__v -hashed_password");
    return res.send(users);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
});

routes.post("/", async (req, res) => {
  let form = new formidale.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    const { error } = validateUser(fields);
    if (error) return res.status(400).send(error.details[0].message);
    const ref = await User.findOne({ email: fields.email });

    if (ref) return res.status(400).send("Email already registred.");
    let user = new User(fields);

    user.hashed_password = await user.setPassword(fields.password);
    const token = user.genrateAuthToken();
    if (files.image) {
      cloudinary.uploader.upload(
        files.image.path,
        {
          tags: "basic_sample",
          width: 250,
          height: 250,
          crop: "fit",
          public_id: user._id,
        },
        async (err, image) => {
          if (err)
            return res.status(400).send("unable to upload image on server.");
          user.image = image.url;

          try {
            let result = await user.save();
            result.hashed_password = undefined;
            res
              .header("x-auth-token", token)
              .header("access-control-expose-headers", "x-auth-token")
              .send(result);
          } catch (err) {
            return res.status(400).json({
              error: err.message,
            });
          }
        }
      );

      //const raw_date = fs.readFileSync(files.image.path);
      // fs.writeFile(imagepath, raw_date, async function (err) {
      //   if (err) return res.status(500).send("unable to save file in server");
      // });
    } else {
      return res.status(400).send("Image is required.");
    }
  });
});

routes.get("/:id", validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-__v -hashed_password"
  );
  if (!user) return res.status(404).send("User not found.");
  res.send(user);
});

routes.put("/:id", auth, validateObjectId, async (req, res) => {
  if (req.params.id !== req.user._id) {
    return res.status(403).send("Don't have access rights.");
  }
  let user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(404).send("user not found");
  let form = new formidale.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    if (fields.email) return res.status(400).send("Can't update emailId");
    extend(user, fields);

    if (fields.password)
      user.hashed_password = await user.setPassword(fields.password);

    const token = user.genrateAuthToken();

    if (files.image) {
      const result = await cloudinary.uploader.upload(files.image.path, {
        tags: "basic_sample",
        width: 250,
        height: 250,
        crop: "fit",
        public_id: user._id,
      });
      if (!result.url)
        return res.status(400).send("error occured during image upload.");
      user.image = result.url;
    }

    try {
      let result = await user.save();
      result.hashed_password = undefined;
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(result);
    } catch (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
  });
});

routes.delete("/:id", auth, validateObjectId, async (req, res) => {
  if (req.params.id !== req.user._id) {
    return res.status(403).send("Don't have access rights.");
  }
  const user = await User.findByIdAndRemove(req.params.id).select(
    "-__v -hashed_password"
  );

  const imagepath = path.resolve(`./static/images/`) + "/" + user._id + ".jpg";
  fs.unlinkSync(imagepath);
  res.send(user);
});

module.exports = routes;
