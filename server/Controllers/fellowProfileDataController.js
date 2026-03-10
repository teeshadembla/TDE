import fellowProfileModel from "../Models/fellowProfileModel.js";

export const fetchLeadership = async (req, res) => {
    try{
        const profiles = await fellowProfileModel.aggregate([
            {
                $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $match: {
                "user.role": { $in: ["admin", "chair"] }
                }
            },
            {
                $project: {
                user: 0
                }
            }
        ]);

        console.log("These are the profiles being fetched for Leadership--->",profiles);

        return res.status(200).json({msg: "Leadership Fetched", profiles: profiles});

    }catch(err){
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

export const fetchTeam = async (req, res) => {
    try{
        const profiles = await fellowProfileModel.aggregate([
            {
                $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $match: {
                "user.role": { $in: ["core"] }
                }
            },
            {
                $project: {
                user: 0
                }
            }
        ]);

        console.log("These are the profiles being fetched for Leadership--->",profiles);

        return res.status(200).json({msg: "Leadership Fetched", profiles: profiles});

    }catch(err){
        return res.status(500).json({msg: "Internal Server Error"});
    }
}


export const fetchAllProfiles = async (req, res) => {
  try {
    const result = await fellowProfileModel.aggregate([
      // 1️⃣ Join user collection
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },

      // 2️⃣ Add workGroupId from user into fellowProfile
      {
        $addFields: {
          workGroupId: "$user.workGroupId"
        }
      },

      // 3️⃣ Group into 3 categories
      {
        $group: {
          _id: null,
          chairs: {
            $push: {
              $cond: [
                { $eq: ["$displayAs", "leadership"] },
                "$$ROOT",
                "$$REMOVE"
              ]
            }
          },
          seniorExecutiveFellows: {
            $push: {
              $cond: [
                { $eq: ["$displayAs", "senior-fellow"] },
                "$$ROOT",
                "$$REMOVE"
              ]
            }
          },
          fellows: {
            $push: {
              $cond: [
                { $eq: ["$displayAs", "fellow"] },
                "$$ROOT",
                "$$REMOVE"
              ]
            }
          }
        }
      },
      {
        $project: { _id: 0 }
      }
    ]);

    return res.status(200).json({
      msg: "Successfully retrieved",
      fellows: result
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Failed to fetch fellow profiles",
      error: error.message
    });
  }
};