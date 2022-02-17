const connect = require('./utils');
const crypto = require('crypto');

const login = async (username,password,cb)=>{
    password = crypto.createHash("md5").update(password).digest("hex");
    let sql = `SELECT * FROM TaiKhoan WHERE TenDangNhap='${username}' AND MatKhau='${password}'`;
    await connect.query(sql,(err,res)=>{
        cb(err,res);
    })
}

const updateToken = async (username,token)=>{
    let sql= `UPDATE TaiKhoan SET Token='${token}' WHERE TenDangNhap='${username}'`;
    await connect.query(sql);   
}

const getByToken = async (token,cb)=>{
    let sql =  `SELECT * FROM TaiKhoan WHERE Token='${token}'`;
    await connect.query(sql,(err,res)=>{
        cb(err,res);
    })
}

const register = async (username,password,cb)=>{
    password = crypto.createHash("md5").update(password).digest("hex");
    let sql =  `SELECT * FROM TaiKhoan WHERE TenDangNhap='${username}'`;
    await connect.query(sql,async (err,res)=>{
        if(!err){
            if(res.length > 0) {
                cb("exist",null);
            }else{
                sql = `INSERT INTO TaiKhoan VALUES('${username}','${password}',null)`;
                await connect.query(sql,(err,res)=>{
                    cb(err,res);
                })
            }
        }
    }) 
}

module.exports = {
    login,
    register,
    updateToken,
    getByToken
}