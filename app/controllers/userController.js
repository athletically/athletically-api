const response = require('./../libs/responseLib')
const check = require('../libs/checkLib');
const fs = require('fs');
const appConfig = require('../../config/appConfig');
const time = require('../libs/timeLib');
const otpLib = require('../libs/otpLib');
const notification = require('../libs/notificationLib');
const { v4: uuidv4 } = require('uuid');
const tokenLib = require('../libs/tokenLib');
const passwordLib = require('../libs/passwordLib');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const otpModel = mongoose.model('OTP');
const uploadLib = require('../libs/uploadLib');
const timeLib = require('../libs/timeLib');
const notificationLib = require('../libs/notificationLib');
const checkLib = require('../libs/checkLib');
const AWS = require('aws-sdk');
const path = require('path');
const { tryCatch } = require('bull/lib/utils');
const { object } = require('joi');
const postModel = mongoose.model('Post');
const likeModel = mongoose.model('Like');
const commentModel = mongoose.model('Comment');
const gameModel = mongoose.model('Game');
const positionModel = mongoose.model('Position');
const userGroupMappingTable = mongoose.model('Group_user_mapping');
const chatModel = mongoose.model('Chat');
const groupModel = mongoose.model('Group');
const followModel = mongoose.model('Follow');

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();


let test = async (req, res) => {
    res.status(200).json('Server is running');
}

let login = async (req, res) => {

    try {
        console.log('body ', req.body);
        let finduser = await UserModel.findOne({ username: req.body.username }).select('-__v _id').lean();

        if (check.isEmpty(finduser)) {
            res.status(404);
            throw new Error('User not Registered!');
        };
        if (await passwordLib.verify(req.body.password, finduser.password)) {
            console.log('verified!');
            if ((finduser.user_type != 1) || (!finduser.is_active)) {
                res.status(401);
                throw new Error('Authorization Failed!');
            } else {
                let payload = {
                    user_id : finduser._id,
                    username: finduser.username,
                    email: finduser.email,
                    user_type: finduser.user_type,
                    token: await tokenLib.generateToken(finduser)
                };
                let apiResponse = response.generate(false, 'logged in!', payload);
                res.status(200).send(apiResponse);
            }
        } else {
            res.status(401);
            throw new Error('incorrect password!');
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.send(apiResponse);
    }
}

let register = async (req, res) => {
    try {
        let finduser = await UserModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] }).select('-__v -_id').lean();

        if (!check.isEmpty(finduser)) {
            res.status(412);
            throw new Error('Username or Email already in use!');
        };

        let newUser = new UserModel({
            username: req.body.username,
            email: req.body.email.toLowerCase(),
            password: await passwordLib.hash(req.body.password),
            created_on: time.now()
        });

        let payload = (await newUser.save()).toObject();

        delete payload.__v;
        delete payload._id;
        delete payload.password;

        let apiResponse = response.generate(false, 'Created new user', payload);
        res.status(200).send(apiResponse);


    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.send(apiResponse);
    }
}

let sendOtpForgotPassword = async (req, res) => {
    try {
        let finduser = await UserModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] }).select('-__v').lean();

        if (check.isEmpty(finduser)) {
            res.status(412);
            throw new Error('An account with this username or email is not found!');
        };
        let email = finduser.email;
        let otp = otpLib.generateOtp(6);

        notificationLib.sendEmail({ email: email, otp: otp }).then(async (sendEmail) => {
            if (sendEmail.err === false) {

                let newOTP = new otpModel({
                    user_id: finduser._id,
                    otp: otp,
                    created_on: timeLib.now()
                })
                if (await newOTP.save()) {
                    let apiResponse = response.generate(false, 'An OTP has been sent to your registered email.');
                    res.status(200).send(apiResponse);
                }
                else {
                    let apiResponse = response.generate(true, 'Unable to send OTP. Try after sometimes.');
                    res.status(500).send(apiResponse);
                }
            }
            else {
                let apiResponse = response.generate(true, 'Unable to send OTP. Try after sometimes.');
                res.status(500).send(apiResponse);
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.send(apiResponse);
    }
}

let verifyOTP = async (req, res) => {
    try {
        let finduser = await UserModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] }).select('-__v').lean();

        if (check.isEmpty(finduser)) {
            res.status(412);
            throw new Error('An account with this username or email is not found!');
        };
        let otp = req.body.otp;

        let sentOTP = await otpModel.findOne({ user_id: finduser._id, otp: otp }).lean();

        if (!checkLib.isEmpty(sentOTP)) {
            let apiResponse = response.generate(false, 'OTP verified. You can update your password now.');
            res.status(200).send(apiResponse);
        }
        else {
            let apiResponse = response.generate(true, 'OTP verification failed.');
            res.status(412).send(apiResponse);
        }
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.send(apiResponse);
    }
}

let resetPassword = async (req, res) => {
    try {
        let finduser = await UserModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] }).select('-__v').lean();

        if (check.isEmpty(finduser)) {
            res.status(412);
            throw new Error('An account with this username or email is not found!');
        };
        let password = await passwordLib.hash(req.body.password);

        let updated = await UserModel.findOneAndUpdate({ _id: finduser._id }, { password: password }, { new: true }).lean();

        if (!checkLib.isEmpty(updated)) {
            let apiResponse = response.generate(false, 'Password Reset Successful.');
            res.status(200).send(apiResponse);
        }
        else {
            let apiResponse = response.generate(true, 'Password Reset failed.');
            res.status(412).send(apiResponse);
        }
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.send(apiResponse);
    }
}

const getAllReels = async (req, res) => {
    try {
        let ret = [
            {
                url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f1067c3389f18ca42_d20231002_m171525_c005_v0501004_t0038_u01696266925392"
            },
            {
                url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f10310fdcd5249cc3_d20231002_m171412_c005_v0501010_t0014_u01696266852544"
            },
            {
                url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f11120602d3e24cca_d20231002_m171434_c005_v0501009_t0043_u01696266874697"
            },
            {
                url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f11542ef257e1f2eb_d20231002_m171531_c005_v0501013_t0032_u01696266931483"
            },
            {
                url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f1199fdc891b5626f_d20231002_m171453_c005_v0501013_t0058_u01696266893544"
            },
        ]

        let apiResponse = response.generate(false, 'Available Reels', ret);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.send(apiResponse);
    }
}

// const homePageReels = async (req, res) => {
//     try {
//         let ret = {
//             error: false,
//             message: "Homepage Reels",
//             data: [
//                 {
//                     image: "https://f005.backblazeb2.com/file/athletically/user-image/user.jpg",
//                     name: "Rajdeep Adhikary",
//                     id: "65084a48b5c351c3bdbd492b",
//                     username: "rajdeep",
//                     reels: [
//                         {
//                             title: "dummy title 1",
//                             url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f1067c3389f18ca42_d20231002_m171525_c005_v0501004_t0038_u01696266925392",
//                             id: "651850485d97800148bbb843",
//                             likes: 0,
//                             comment: 0
//                         },
//                         {
//                             title: "dummy title 3",
//                             url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f10310fdcd5249cc3_d20231002_m171412_c005_v0501010_t0014_u01696266852544",
//                             id: "651850485d97800148bbb844",
//                             likes: 7,
//                             comment: 2
//                         }
//                     ]
//                 },
//                 {
//                     image: "https://f005.backblazeb2.com/file/athletically/user-image/user.jpg",
//                     name: "Rahul Sharma",
//                     id: "65084a48b5c35213bdbd492b",
//                     username: "rahul",
//                     reels: [
//                         {
//                             title: "dummy title 2",
//                             url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f1067c3389f18ca42_d20231002_m171525_c005_v0501004_t0038_u01696266925392",
//                             id: "651850485d97800148bbb843",
//                             likes: 10,
//                             comment: 6
//                         },
//                         {
//                             title: "dummy title 4",
//                             url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f10310fdcd5249cc3_d20231002_m171412_c005_v0501010_t0014_u01696266852544",
//                             id: "651850485d97800148bbb844",
//                             likes: 71,
//                             comment: 22
//                         }
//                     ]
//                 },
//                 {
//                     image: "https://f005.backblazeb2.com/file/athletically/user-image/user.jpg",
//                     name: "Anuvab Singh",
//                     id: "65084a48b5c351c3bdbd444",
//                     username: "anuvab",
//                     reels: [
//                         {
//                             title: "dummy title 5",
//                             url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f1067c3389f18ca42_d20231002_m171525_c005_v0501004_t0038_u01696266925392",
//                             id: "651850485d97800148bbb843",
//                             likes: 11,
//                             comment: 0
//                         },
//                         {
//                             title: "dummy title 7",
//                             url: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z2af10e0059b5ff1887ad031a_f10310fdcd5249cc3_d20231002_m171412_c005_v0501010_t0014_u01696266852544",
//                             id: "651850485d97800148bbb844",
//                             likes: 1,
//                             comment: 3
//                         }
//                     ]
//                 }
//             ]
//         }
//         let apiResponse = response.generate(false, 'Homepaae Reels', ret);
//         res.status(200).send(apiResponse);
//     } catch (error) {
//         let apiResponse = response.generate(true, error.message, null);
//         res.status(500).send(apiResponse);
//     }
// }

const homePageReels = async (req, res) => {
    try {

        let rows = await UserModel.aggregate([
            {
              $match: {
                is_active : true
              }
            },
            {
              $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: 'user_id',
                as: 'reels'
              }
            },
            {
              $match: {
                reels: { $ne : [] },
              }
            }
        ]);

        if(rows.length < 1){
            let apiResponse = response.generate(false, 'No Reels found', []);
            res.status(200).send(apiResponse);
        }

        let returndata = [];

        rows.forEach(row => {
            let temp = {};
            temp.id = row._id;
            temp.name = (row.name !== undefined) ? row.name : row.username;
            temp.username = row.username;
            temp.image = row.image;
            temp.reels = [];

            row.reels.forEach(reel => {
                if(reel.status === 'active' && reel.type != 'match'){
                    temp.reels.push({
                        title : reel.text,
                        url : reel.reel_link,
                        id : reel._id,
                        likes : reel.likes,
                        comment : 0
                    })
                }
            })

            if(temp.reels.length > 0)
                returndata.push(temp);
        })

    
        let apiResponse = response.generate(false, 'Reels Found', returndata);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.status(500).send(apiResponse);
    }
}

let getAllReelsOfUser = async(req, res) => {
    try {

        let userdtls = await postModel.findOne({ _id : new mongoose.Types.ObjectId(req.body.reel_id) });

        let user_id = userdtls.user_id;

        let rawdata = await postModel.find({ user_id : user_id, status : 'active' });


        let returndata = [];

        if(rawdata.length < 1){
            let apiResponse = response.generate(false, 'No reels of the user is found', []);
            res.status(200).send(apiResponse);
            return;
        }

        rawdata.forEach(row => {
            returndata.push({
                id : row._id,
                title : row.text,
                url : row.reel_link,
                likes : row.likes,
                comment : 0
            })
        })

        let apiResponse = response.generate(false, 'All Reels Of User', returndata);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.status(500).send(apiResponse);
    }
}

const createReels = async(req, res) => {
    try {
        const bucketName = process.env.S3_BUCKET;
        const fileName = `${Date.now().toString()}${path.extname(req.file.originalname)}`;
        const fileContent = req.file.buffer;

        const params = {
            Bucket: bucketName,
            Key: `reels/${fileName}`,
            Body: fileContent,
            ContentType: 'video/mp4'
        };

        s3.putObject(params, async (err, data) => {
            if (err) {
                let apiResponse = response.generate(true, 'File upload failed', err);
                console.error('Error uploading file:', err);
                res.status(200).send(apiResponse);
            } else {
                const objectUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/reels/${fileName}`;
                const newPost = new postModel({
                    'user_id' : req.body.user_id,
                    'reel_link' : objectUrl,
                    'text' : req.body.post,
                    'status' : 'active',
                    'created_on' : Date.now()
                });

                const added = await newPost.save();

                let apiResponse = response.generate(false, 'File uploaded successfully', added);
                console.log('File uploaded successfully:', data);
                res.status(200).send(apiResponse);
            }
        });
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        console.error('Error uploading file catch:', error.message);
        res.status(500).send(apiResponse);
    }
}

const likePost = async(req, res) => {
    try {
        
        let likeData = new likeModel({
            liked_by : req.body.liked_by,
            reel_id : req.body.reel_id
        });
        await likeData.save();

        let updatePost = await postModel.updateOne({_id : mongoose.Types.ObjectId(req.body.reel_id)}, { $inc: { likes: 1 } }, { new : true });
        
        let apiResponse = response.generate(false, '+1 like', updatePost);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = response.generate(true, 'no like', {});
        res.status(500).send(apiResponse);
    }

}


const dislikePost = async(req, res) => {
    try {
        
        await likeModel.deleteOne({ liked_by : req.body.disliked_by, reel_id : req.body.reel_id });

        let updatePost = await postModel.updateOne({_id : mongoose.Types.ObjectId(req.body.reel_id)}, { $inc: { likes: -1 } }, { new : true });
        
        let apiResponse = response.generate(false, '+1 like', updatePost);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = response.generate(true, 'no like', {});
        res.status(500).send(apiResponse);
    }

}

const commentPost = async(req, res) => {
    try {
        
        let commentData = new commentModel({
            comment_by : req.body.comment_by,
            reel_id : req.body.reel_id,
            comment : req.body.comment
        });
        await commentData.save();

        let updatePost = await postModel.updateOne({_id : mongoose.Types.ObjectId(req.body.reel_id)}, { $inc: { comments: 1 } }, { new : true });
        
        let apiResponse = response.generate(false, '+1 comment added', updatePost);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = response.generate(true, 'no comment added', {});
        res.status(500).send(apiResponse);
    }

}

const deleteAllReels = async(req, res) => {
    await postModel.deleteMany({ status : 'active' });
    res.send('success');
}


const getGameList = async(req, res) => {
    try {
        const gameList = await gameModel.find({status : 'active'}, 'name');
        let apiResponse = response.generate(false, 'Game List', gameList);
        res.status(200).send(apiResponse);        
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const getPositionsList = async(req, res) => {

    try {
        const positionList = await positionModel.find({game_id : new mongoose.Types.ObjectId(req.query.game_id), status : 'active'}, 'name');
        let apiResponse = response.generate(false, 'Position List', positionList);
        res.status(200).send(apiResponse);        
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const updateProfile = async(req, res) => {
    try {
        const user_id = req.body.user_id;
        const finduser = await UserModel.findOne({ _id : new mongoose.Types.ObjectId(user_id) });
        let objectUrl = '';

        if(!finduser){
            let apiResponse = response.generate(true, 'User not found', {});
            res.status(200).send(apiResponse);
            return;
        }

        if(req.file){
            const bucketName = process.env.S3_BUCKET;
            const fileName = `${Date.now().toString()}${path.extname(req.file.originalname)}`;
            const filePath = req.file.path;

            // Create a readable stream from the file
            const fileStream = fs.createReadStream(filePath);

            const params = {
                Bucket: bucketName,
                Key: `images/${fileName}`,
                Body: fileStream,
                ContentType: 'image/*'
            };

            const uploadParams = { ...params, Body: fileStream };
            const uploadResult = await s3.upload(uploadParams).promise();

            objectUrl = uploadResult.Location;
        }
        
        req.body = JSON.parse(JSON.stringify(req.body));

        finduser.name = (req.body.hasOwnProperty('name')) ? req.body.name : undefined;
        finduser.dob = (req.body.hasOwnProperty('dob')) ? req.body.dob : undefined;
        finduser.height = (req.body.hasOwnProperty('height')) ? req.body.height : undefined;
        finduser.width = (req.body.hasOwnProperty('width')) ? req.body.width : undefined;
        finduser.country = (req.body.hasOwnProperty('country')) ? req.body.country : undefined;
        finduser.city = (req.body.hasOwnProperty('city')) ? req.body.city : undefined;
        finduser.competition_won = (req.body.hasOwnProperty('competition_won')) ? req.body.competition_won : undefined;
        finduser.previous_teams = (req.body.hasOwnProperty('previous_teams')) ? req.body.previous_teams : undefined;
        finduser.previous_coaches = (req.body.hasOwnProperty('previous_coaches')) ? req.body.previous_coaches : undefined;
        finduser.image = (objectUrl !== '') ? objectUrl : undefined;

        const updated = await finduser.save();

        const game_id = req.body.game_id;
        const position_id = req.body.position_id;

        if(game_id && position_id){
            const groups = await groupModel.find({ game_id : game_id, position_id : position_id, status : 'active' });
            if(groups.length > 0){
                await Promise.all(groups.map(async group => {
                    let findGroup = await userGroupMappingTable.findOne({user_id : user_id, group_id : group._id});
                    if(findGroup && findGroup.status === 'inactive'){
                        findGroup.status = 'active';
                        await findGroup.save();
                    }
                    else if(!findGroup){
                        let newGroupUserMapping = new userGroupMappingTable({
                            user_id : user_id,
                            group_id : group._id
                        })
                        await newGroupUserMapping.save();
                    }
                }))
            }
        }

        let apiResponse = response.generate(false, 'Updated Successfully', updated);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(false, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const addGame = async(req, res) => {
    try{
        const newGame = new gameModel({
            name : req.body.game_name
        })
        await newGame.save();

        let apiResponse = response.generate(false, 'Added Successfully', {});
        res.status(200).send(apiResponse);
    }
    catch(error){
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const addPosition = async(req, res) => {
    try{
        const newPosition = new positionModel({
            game_id : req.body.game_id,
            name : req.body.position_name
        })
        await newPosition.save();

        let apiResponse = response.generate(false, 'Added Successfully', {});
        res.status(200).send(apiResponse);
    }
    catch(error){
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const addGroup = async(req, res) => {
    try{
        const newGroup = new groupModel({
            game_id : req.body.game_id,
            position_id : req.body.position_id,
            name : req.body.group_name
        })
        await newGroup.save();

        let apiResponse = response.generate(false, 'Added Successfully', {});
        res.status(200).send(apiResponse);
    }
    catch(error){
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const getUserGroupList = async(req, res) => {
    try {
        const user_id = req.query.user_id;
        const groups = await userGroupMappingTable.aggregate([
            {
              $match: {
                user_id : new mongoose.Types.ObjectId(user_id),
                status : 'active'
              }
            },
            {
              $lookup: {
                from: 'groups',
                localField: "group_id",
                foreignField: "_id",
                as: "group"
              }
            },
            {
              $unwind: "$group"
            }
        ])
        if(groups.length < 1){
            let apiResponse = response.generate(true, "User has no active group. Update profile or request admin to create a group", []);
            res.status(200).send(apiResponse);
            return;
        }
        let returndata = [];
        await Promise.all(groups.map(async group => {
            let temp = {};
            temp.group_id = group.group._id;
            temp.group_name = group.group.name;
            returndata.push(temp);
        }))
        let apiResponse = response.generate(false, "User group list found", returndata);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const addMatches = async (req, res) => {
    try {
        const bucketName = process.env.S3_BUCKET;
        const fileName = `${Date.now().toString()}${path.extname(req.file.originalname)}`;
        const filePath = req.file.path;

        // Create a readable stream from the file
        const fileStream = fs.createReadStream(filePath);

        const params = {
            Bucket: bucketName,
            Key: `matches/${fileName}`,
            Body: fileStream,
            ContentType: 'video/mp4'
        };

        const uploadParams = { ...params, Body: fileStream };
        const uploadResult = await s3.upload(uploadParams).promise();

        const objectUrl = uploadResult.Location;
        const newPost = new postModel({
            'user_id': req.body.user_id,
            'reel_link': objectUrl,
            'text': req.body.post,
            'type': 'match',
            'status': 'active',
            'created_on': Date.now()
        });

        const added = await newPost.save();

        let apiResponse = response.generate(false, 'File uploaded successfully', added);
        console.log('File uploaded successfully:', uploadResult);
        res.status(200).send(apiResponse);
    } catch (error) {
        console.error('Error uploading file:', error);
        let apiResponse = response.generate(true, 'File upload failed', error.message || {});
        res.status(500).send(apiResponse);
    } finally {
        // Clean up: Delete the temporary file
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const getUserMatches = async(req, res) => {
    try {
        let user_id = req.query.user_id;

        let rawdata = await postModel.find({ type : 'match', status : 'active' });


        let returndata = [];

        if(rawdata.length < 1){
            let apiResponse = response.generate(false, 'No match of the user is found', []);
            res.status(200).send(apiResponse);
            return;
        }

        rawdata.forEach(row => {
            returndata.push({
                id : row._id,
                title : row.text,
                url : row.reel_link,
                likes : row.likes,
                comment : 0
            })
        })

        returndata.unshift('MATCHES');
        
        let apiResponse = response.generate(false, 'All Matches Of User', returndata);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const getUserProfileData = async(req, res) => {
    try {
        const user_id = req.query.user_id;

        const userdtls = await UserModel.findById(user_id).lean();

        delete userdtls.__v;
        delete userdtls.password;

        let apiResponse = response.generate(false, 'User details', userdtls);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const getExplore = async(req, res) => {
    try {
        const user_id = req.query.user_id;

        const reels = await postModel.aggregate([
            {
                $match: {
                //   type : '',
                  status : 'active'
                }
            },
            {
                $sample : { size : 6 }
            }
        ])

        const users = await UserModel.aggregate([
            {
                $match: {
                  is_active : true
                }
            },
            {
                $sample : { size : 2 }
            }
        ])

        await Promise.all(users.map(async user => {
            delete user.__v;
            delete user.password;
            delete user.is_active;
            delete user.user_type;
            delete user.created_on;
            delete user.city;
            delete user.competition_won;
            delete user.country;
            delete user.dob;
            delete user.height;
            delete user.previous_coaches;
            delete user.previous_teams;
            delete user.width;
            delete user.password;
            return user;
        }))

        const returndata = {};

        returndata.users = [];
        // returndata.userDetails = users;
        // returndata.reels = reels;

        returndata.users.push({
            userDetails : users,
            reels : reels
        })

        //  {reels: reels, users:  users };

        let apiResponse = response.generate(false, 'Explore Section data', returndata);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}


const addPodcast = async (req, res) => {
    try {
        const bucketName = process.env.S3_BUCKET;
        const fileName = `${Date.now().toString()}${path.extname(req.file.originalname)}`;
        const filePath = req.file.path;

        // Create a readable stream from the file
        const fileStream = fs.createReadStream(filePath);

        const params = {
            Bucket: bucketName,
            Key: `podcast/${fileName}`,
            Body: fileStream,
            ContentType: 'video/mp4'
        };

        const uploadParams = { ...params, Body: fileStream };
        const uploadResult = await s3.upload(uploadParams).promise();

        const objectUrl = uploadResult.Location;
        const newPost = new postModel({
            'user_id': req.body.user_id,
            'reel_link': objectUrl,
            'text': req.body.post,
            'type': 'podcast',
            'status': 'active',
            'created_on': Date.now()
        });

        const added = await newPost.save();

        let apiResponse = response.generate(false, 'File uploaded successfully', added);
        console.log('File uploaded successfully:', uploadResult);
        res.status(200).send(apiResponse);
    } catch (error) {
        console.error('Error uploading file:', error);
        let apiResponse = response.generate(true, 'File upload failed', error.message || {});
        res.status(500).send(apiResponse);
    } finally {
        // Clean up: Delete the temporary file
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const getPodcast = async(req, res) => {
    try {
        let user_id = req.query.user_id;

        let rawdata = await postModel.find({ type : 'podcast', status : 'active' });


        let returndata = [];

        if(rawdata.length < 1){
            let apiResponse = response.generate(false, 'No podcast is found', []);
            res.status(200).send(apiResponse);
            return;
        }

        rawdata.forEach(row => {
            returndata.push({
                id : row._id,
                title : row.text,
                url : row.reel_link,
                likes : row.likes,
                comment : 0
            })
        })

        returndata.unshift('PODCASTS');
        
        let apiResponse = response.generate(false, 'All Matches Of User', returndata);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const updateView = async(req, res) => {
    try {
        let user_id = req.user._id;
        let reel_id = req.body.reel_id;

        let reel = await postModel.findById(reel_id);

        if(!reel){
            let apiResponse = response.generate(false, 'Reel not found', {});
            res.status(200).send(apiResponse);
        }

        reel.views = parseInt(reel.views) + 1;

        await reel.save();

        let apiResponse = response.generate(false, 'Reel view +1 added', reel);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

// const get_leaderboard = async(req, res) => {
//     try {
//         let 
//     } catch (error) {
//         let apiResponse = response.generate(true, error.message, {});
//         res.status(500).send(apiResponse);
//     }
// }

const followUser = async(req, res) => {
    try {
        let user_id = req.user._id;
        let followed_user_id = req.body.user_id;

        let isMapped = await newFollowModel.findOne({followed_user_id : new mongoose.Types.ObjectId(followed_user_id), follower_user_id : new mongoose.Types.ObjectId(follower_user_id)});

        if(isMapped && isMapped.status === 'inactive'){
            isMapped.status = 'active';
            await isMapped.save();
        }
        else if(!isMapped){
            let newFollowModel = new followModel({
                followed_user_id : new mongoose.Types.ObjectId(followed_user_id),
                follower_user_id : new mongoose.Types.ObjectId(user_id)
            })
    
            await newFollowModel.save(); 
        }
        else if(isMapped && isMapped.status === 'active'){
            isMapped.status = 'inactive';
            await isMapped.save();
        }

        let apiResponse = response.generate(false, 'Followed successfully', {});
        res.status(200).send(apiResponse);
        
    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

module.exports = {
    test: test,
    login: login,
    register: register,
    sendOtpForgotPassword: sendOtpForgotPassword,
    verifyOTP: verifyOTP,
    resetPassword: resetPassword,
    getAllReels: getAllReels,
    homePageReels: homePageReels,
    getAllReelsOfUser: getAllReelsOfUser,
    createReels: createReels,
    likePost: likePost,
    dislikePost: dislikePost,
    commentPost: commentPost,
    deleteAllReels: deleteAllReels,
    getGameList : getGameList,
    getPositionsList : getPositionsList,
    updateProfile : updateProfile,
    addGame: addGame,
    addPosition: addPosition,
    addGroup: addGroup,
    getUserGroupList: getUserGroupList,
    addMatches : addMatches,
    getUserMatches: getUserMatches,
    getUserProfileData: getUserProfileData,
    getExplore: getExplore,
    addPodcast : addPodcast,
    getPodcast : getPodcast,
    updateView : updateView,
    followUser: followUser
}