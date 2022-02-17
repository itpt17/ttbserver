const connect = require('./utils');

const ResetTable = async (username,subjectID)=>{
    let sql = `DELETE FROM KipHoc WHERE TenDangNhap='${username}' AND MaMonHoc='${subjectID}'`;
    await connect.query(sql,(err,res)=>{
    })
    sql = `DELETE FROM LichHoc WHERE TenDangNhap='${username}'`;
    await connect.query(sql,(err,res)=>{
    })
}

const AddTable = async (subject,username,cb)=>{
    let sql = `INSERT INTO LichHoc VALUES('${username}','${subject.id}','${subject.name}','${subject.group}')`;
    await connect.query(sql,(err,res)=>{
    })
}

const GetTable = async (subjectID, username , cb)=>{
    let sql =  `SELECT * FROM LichHoc WHERE TenDangNhap='${username}' AND MaMonHoc='${subjectID}'`;
    await connect.query(sql,(err,res)=>{
        cb(err,res);
    })
}

const AddSubject = async (subject,username)=>{
    let sql = `INSERT INTO KipHoc(TenDangNhap,MaMonHoc,PhongHoc,ThucHanh,Thu,TietBD,SoTiet,Tuan) VALUES
               ('${username}','${subject.id}','${subject.zoom}','${subject.th}',${subject.day},${subject.lesson},${subject.num},'${subject.week}')`;
    await connect.query(sql,(err,res)=>{
    })
}

const GetSubject = async (username,cb) =>{
    let sql =  `SELECT * FROM KipHoc,LichHoc WHERE KipHoc.TenDangNhap = '${username}' AND KipHoc.TenDangNhap = LichHoc.TenDangNhap AND KipHoc.MaMonHoc = LichHoc.MaMonHoc`;
    await connect.query(sql,(err,res)=>{
        cb(err,res);
    }) 
}

const AddWork = async(username,work,cb)=>{
    let sql = `SELECT * FROM CongViec WHERE TenDangNhap='${username}' AND Tiet='${work.tiet}' AND Thu='${work.thu}' AND Tuan='${work.tuan}'`;
    await connect.query(sql,async (err,res)=>{
        if(res.length == 0){
            let sql =  `INSERT INTO CongViec(TenDangNhap,NoiDung,Tiet,Thu,Tuan) VALUES(
                '${username}','${work.noidung}','${work.tiet}','${work.thu}','${work.tuan}'
            )`;
            await connect.query(sql,(err,res)=>{
                cb(err,res);
            })
        }else{
            let sql =  `UPDATE CongViec SET NoiDung = '${work.noidung}' WHERE TenDangNhap='${username}' AND Tiet = '${work.tiet}' AND Thu='${work.thu}' AND Tuan='${work.tuan}'`;
            await connect.query(sql,(err,res)=>{
                cb(err,res);
            })
        }
    });
}

const getWork = async (username,cb)=>{
    let sql = `SELECT * FROM CongViec WHERE TenDangNhap = '${username}'`;
    await connect.query(sql,(err,res)=>{
        cb(err,res);
    })
}

const deleteWork = async (username,work,cb)=>{
    let sql =  `DELETE FROM CongViec WHERE TenDangNhap='${username}' AND Thu = '${work.thu}' AND Tuan='${work.tuan}' AND Tiet='${work.tiet}'`;
    await connect.query(sql,(err,res)=>{
        cb(err,res);
    })
}

module.exports = {
    ResetTable,
    AddTable,
    GetTable,
    AddSubject,
    GetSubject,
    AddWork,
    getWork,
    deleteWork
}