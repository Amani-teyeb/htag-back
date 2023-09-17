const User = require("../models/user");

exports.addToWishlist = async (req, res) => {
  const { courseId } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    console.log(req.user._id);
    const alreadyAdded = user.wichlist.find((id) => id.toString() === courseId);
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wichlist: courseId },
        },
        { new: true }
      );
      res.status(201).json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wichlist: courseId },
        },
        { new: true }
      );
      res.status(201).json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
};

// exports.removeCourseFromFav = (req, res) => {
//   const courseId = req.body.payload;
//   console.log(courseId);
//   if (courseId) {
//     Mycourse.updateOne(
//       { user: req.user._id },
//       {
//         $pull: {
//           courseItems: {
//             course: courseId,
//           },
//         },
//       }
//     ).exec((error, result) => {
//       if (error) return res.status(400).json({ error });
//       if (result) {
//         res.status(202).json({ result });
//       }
//     });
//   }
// };

// exports.getCourseList = (req, res) => {
//   Mycourse.findOne({ user: req.user._id })
//     .populate("courseItems.course")
//     .exec((error, courseListe) => {
//       if (error) return res.status(400).json({ error });
//       if (courseListe) {
//         let courseItems = {};
//         courseListe.courseItems.forEach((item, index) => {
//           courseItems[item.course._id.toString()] = {
//             name: item.course.name,
//             _id: item.course._id.toString(),
//           };
//         });
//         res.status(200).json({ courseItems });
//       }
//     });
// };

// exports.getAllCourseList = (req, res) => {
//   Mycourse.find({})
//     .populate("user", "-password")
//     .exec((error, courseLists) => {
//       if (error) return res.status(400).json({ error });
//       if (courseLists) return res.status(200).json({ courseLists });
//     });
// };
