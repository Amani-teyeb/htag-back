const slugify = require("slugify");
const Course = require("../models/course");
const Theme = require("../models/theme");

// exports.addCourse = (req, res) => {
//   const { titre, level, theme, image, group, createdBy } = req.body;

//   const course = new Course({
//     titre,
//     slug: slugify(titre),
//     level,
//     theme,
//     image,
//     group,
//     createdBy: req.user._id,
//   });

//   if (req.file) {
//     course.url = process.env.API + "/public/" + req.file.filename;
//   }

//   course.save((error, course) => {
//     if (error) return res.status(400).json({ error });
//     if (course) {
//       res.status(201).json({ course });
//     }
//   });
// };

exports.addCourse = (req, res) => {
  const { titre, level, theme, image, group, url } = req.body;

  const course = new Course({
    url,
    titre,
    level,
    theme,
    image,
    group,
    createdBy: req.user._id,
  });
  course.save((error, course) => {
    if (error) return res.status(400).json({ error });
    if (course) {
      res.status(201).json({ course });
    }
  });
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
