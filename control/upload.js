const multer = require('multer');
const timetable = require('./timetable');
const TimeTableControl = require('../model/timetable');
const Account = require("../model/account");

const createStorage = (username)=>{
    const storage = multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null,"./uploads/");
        },
        filename: (req,file,cb)=>{
            cb(null,username + ".txt");
        }
    })
    return storage;
}

const saveTimeTable = async (timetable,user)=>{
    var begindate = timetable.begin;
    begindate = begindate.split("/");
    begindate = new Date(+begindate[2],begindate[1]-1,+begindate[0]+1);
    var temp = timetable.sbjlist;
    for(let k  = 0; k < temp.length; k++) await TimeTableControl.ResetTable(user,temp[k].subject[0]);
    for(let k = 0; k < temp.length; k++){
        await TimeTableControl.AddTable({id:temp[k].subject[0],name:temp[k].subject[1],group:temp[k].subject[2]},user);
        let detail = temp[k].detail;
        let time   = temp[k].time;
        let count = 0;
        for(let i = 0; i < detail.length;){
            let id = temp[k].subject[0];
            let th = detail[i]; i++;
            th==''?false:true;
            let day = detail[i]; i++;
            switch(day){
                case 'Hai': {day=2;break;}
                case 'Ba':  {day=3;break;}
                case 'Tư':  {day=4;break;}
                case 'Năm': {day=5;break;}
                case 'Sáu': {day=6;break;}
                case 'Bảy': {day=7; break;}
                default: {day=8;break;}
            }
            let lesson = detail[i]; i++;
            let num = detail[i]; i++;
            let zoom = detail[i];i+=2;
            let week = time[count]; count++;
            await TimeTableControl.AddSubject({id,zoom,th,day,lesson,num,week},user);
        }
    }
}

const saveUpload = async (req,res)=>{
    let token = req.get("Authorization");
    await Account.getByToken(token,async (error,result)=>{
        if(!error){
            let username = result[0].TenDangNhap;
            const upload = multer({storage: createStorage(username)}).single("file");
            await upload(req,res,(err)=>{
                if(err) res.status(404).json({uploaded:false,err});
                else{
                    res.status(200).json({uploaded:true});
                    let path = "./uploads/" + username + ".txt";
                    let tb = timetable.renderTimeTable(path);
                    saveTimeTable(tb,username);
                }
            })
        }
    })
}

module.exports = {
    saveUpload
}