const moment = require("../models/moment.model");
const momentComment = require("../models/momentComment.model");
const mongoose = require("mongoose");
class Moment {
  async createMoment(u_id, content, circle,image) {
    var flag = false;
    await moment.create(
      {
        momenter: u_id,
        content: content,
        circle: circle,
        momentImage:image
      },
      (err, doc) => {
        if (!err) {
          new Promise((res, rej) => {
            flag = true;
          });
        }
      }
    );

    const res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(flag);
      }, 20);
    });
    if (res) {
      const res = await moment.find({ momenter: u_id });
      const data = moment.aggregate([
        {
          $match: { momenter: mongoose.Types.ObjectId(u_id) },
        },
        { $skip: res.length - 1 },
        { $limit: 1 },
        {
          $lookup: {
            from: "users",
            localField: "momenter",
            foreignField: "_id",
            as: "momenterInfo",
          },
        },
  
        {
          $lookup: {
            from: "momentcomments",
            localField: "_id",
            foreignField: "moment_id",
            as: "momentComments",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "momentComments.commenter",
            foreignField: "_id",
            as: "commenterInfo",
          },
        },
      ]);
      return data;
    }
  }

  async findMoments() {
    return await moment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "momenter",
          foreignField: "_id",
          as: "momenterInfo",
        },
      },

      {
        $lookup: {
          from: "momentcomments",
          localField: "_id",
          foreignField: "moment_id",
          as: "momentComments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "momentComments.commenter",
          foreignField: "_id",
          as: "commenterInfo",
        },
      },
    ]);
  }

  async retainLike(u_id, m_id) {
    var flag;
    const singleMoment = await moment.find({ _id: m_id });
    const likeContainer = singleMoment[0].momentLiked;
    if (!likeContainer.includes(u_id)) {
      await moment.updateOne({ _id: m_id }, { $push: { momentLiked: u_id } });
      flag = true;
      let singleMoment = await moment.find({ _id: m_id });
      let likes = singleMoment[0].momentLiked;
      return { flag, likes };
    } else {
      await moment.updateOne({ _id: m_id }, { $pull: { momentLiked: u_id } });
      flag = false;
      let singleMoment = await moment.find({ _id: m_id });
      let likes = singleMoment[0].momentLiked;
      return { flag, likes };
    }
  }

  async removeMoment(m_id) {
    const res = await moment.deleteOne({ _id: m_id });
    if (res.deletedCount == 1) {
      return await moment.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "momenter",
            foreignField: "_id",
            as: "momenterInfo",
          },
        },
      ]);
    }
  }

  async getMomentsByCircle(circle) {
    return moment.aggregate([
      { $match: { circle: circle } },
      {
        $lookup: {
          from: "users",
          localField: "momenter",
          foreignField: "_id",
          as: "momenterInfo",
        },
      },

      {
        $lookup: {
          from: "momentcomments",
          localField: "_id",
          foreignField: "moment_id",
          as: "momentComments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "momentComments.commenter",
          foreignField: "_id",
          as: "commenterInfo",
        },
      },
    ]);
  }

  async reviewMoment(m_id, u_id, content) {
    await momentComment.create(
      {
        moment_id: m_id,
        commenter: u_id,
        commentContent: content,
      },
      (err, doc) => {
        if (!err) {
          console.log("发布评论成功");
        }
      }
    );

    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        const res = momentComment.aggregate([
          {
            $match: {
              moment_id: mongoose.Types.ObjectId(m_id),
              commenter: mongoose.Types.ObjectId(u_id),
            },
          },

          {
            $lookup: {
              from: "users",
              localField: "commenter",
              foreignField: "_id",
              as: "commenterInfo",
            },
          },
        ]);
        resolve(res);
      }, 200);
    });
  }

  async captureMomentComments(m_id) {
    return momentComment.aggregate([
      { $match: { moment_id: mongoose.Types.ObjectId(m_id) } },

      {
        $lookup: {
          from: "users",
          localField: "commenter",
          foreignField: "_id",
          as: "commenterInfo",
        },
      },
    ]);
  }

  async captureUserMoments(u_id) {
    return await moment.aggregate([
      { $match: { momenter: mongoose.Types.ObjectId(u_id) } },
      {
        $lookup: {
          from: "users",
          localField: "momenter",
          foreignField: "_id",
          as: "momenterInfo",
        },
      },

      {
        $lookup: {
          from: "momentcomments",
          localField: "_id",
          foreignField: "moment_id",
          as: "momentComments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "momentComments.commenter",
          foreignField: "_id",
          as: "commenterInfo",
        },
      },
    ]);
  }
}

module.exports = new Moment();
