const slugify = require("slugify");
const Course = require("../models/course");
const Theme = require("../models/theme");
const VideoCourse = require("../models/videoCourse");

exports.addCourse = (req, res) => {
  const { titre, level, theme, image, group } = req.body;
  try {
    const course = new Course({
      titre,
      slug: slugify(titre),
      level,
      theme,
      image,
      group,
      createdBy: req.user._id,
    });
    if (req.file) {
      course.url = process.env.API + "/public/" + req.file.filename;
    }
    course.save();
    res.status(201).json({ course });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getCoursesBySlug = (req, res) => {
  const { slug } = req.params;
  Theme.findOne({ slug: slug })
    .select("_id")
    .exec((error, theme) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (theme) {
        Course.find({ theme: theme._id }).exec((error, courses) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (courses) {
            res.status(200).json({ courses });
          }
        });
      }
    });
};
exports.getAllCourses = (req, res) => {
  Course.find({}).exec((error, courses) => {
    if (error) return res.status(400).json({ error });
    if (courses) return res.status(200).json({ courses });
  });
};

exports.deleteCourse = async (req, res) => {
  const { courseId } = req.body;
  try {
    const findCourse = await Course.findByIdAndDelete({ _id: courseId });
    res.status(201).json({ message: "Course removed" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.addvideoCourse = (req, res) => {
  const { titre, theme, url, level, group, createdBy } = req.body;

  try {
    const videoCourse = new VideoCourse({
      titre,
      url,
      level,
      slug: slugify(titre),
      theme,
      group,
      createdBy: req.user._id,
    });

    videoCourse.save();
    res.status(201).json({ videoCourse });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getvideoCourse = (req, res) => {
  VideoCourse.find({}).exec((error, courses) => {
    if (error) return res.status(400).json({ error });
    if (courses) return res.status(200).json({ courses });
  });
};
