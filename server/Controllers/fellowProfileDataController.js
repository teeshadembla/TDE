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