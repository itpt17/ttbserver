const Table = require('../model/timetable');
const Account = require('../model/account');
const jwt = require('jsonwebtoken');

const getTimeTable = async (req,res)=>{
    let token = req.get("Authorization");
    Account.getByToken(token,async (error,result)=>{
        if(!error){
            let username = result[0].TenDangNhap;
            await Table.GetSubject(username,async (error,result)=>{
                if(error){
                    res.status(500).json({error});
                    return;
                }
                else{
                    res.status(200).json({result});
                }
            })
        }
    });
}

const addWork = async (req,res)=>{
    let work = req.body.work;
    let token = req.get("Authorization");
    Account.getByToken(token,async (error,result)=>{
        if(!error){
            let username = result[0].TenDangNhap;
            await Table.AddWork(username,work,(error,result)=>{
                if(error) res.status(500).json({error});
                else{
                    res.status(200).json({status:true});
                }
            })
        }
    })
}

const getWork = async (req,res)=>{
    let token = req.get("Authorization");
    Account.getByToken(token,async (error,result)=>{
        if(!error){
            let username = result[0].TenDangNhap;
            await Table.getWork(username,(error,result)=>{
                if(error) res.status(500).json({error});
                else{
                    res.status(200).json({work:result});
                }
            })
        }
    })
}

const deleteWork = async (req,res)=>{
    let work = req.body.work;
    let token = req.get("Authorization");
    Account.getByToken(token,async (error,result)=>{
        if(!error){
            let username = result[0].TenDangNhap;
            await Table.deleteWork(username,work,(error,result)=>{
                if(error) res.status(500).json({error});
                else{
                    res.status(200).json({status:true});
                }
            })
        }
    });
}

const login = async (req,res)=>{
    let username = req.body.user;
    let password = req.body.pass;
    if(!username.match(/[a-z0-9]{6,10}/)){
        res.status(200).json({login:false,message:"T??n ????ng nh??p ch??? g???m ch??? th?????ng v?? s??? (6-10 k?? t???)"});
    }else{
        if(password.length < 8){
            res.status(200).json({login:false,message:"M???t kh???u t???i thi???u 8 k?? t???"});
        }
        else{
            await Account.login(username,password,async (error,result)=>{
                if(error) res.status(401).json();
                else{
                    if(result.length > 0){
                        let token = await jwt.sign({username},"timetable",{expiresIn:'30d'});
                        await Account.updateToken(username,token);
                        res.status(200).json({login:true,token});
                    }else{
                        res.status(200).json({login:false});
                    }
                }
            });
        }
    }
}

const register = async (req,res)=>{
    let username = req.body.user;
    let password = req.body.pass;
    let __password = req.body.repass;
    if(!username.match(/[a-z0-9]{6,10}/)){
        res.status(200).json({register:false,message:"T??n ????ng nh??p ch??? g???m ch??? th?????ng v?? s??? (6-10 k?? t???)"});
    }else{
        if(password.length < 8){
            res.status(200).json({register:false,message:"M???t kh???u t???i thi???u 8 k?? t???"});
        }else{
            if(password != __password){
                res.status(200).json({register:false,message:"M???t kh???u kh??ng kh???p"});
            }else{
                await Account.register(username,password,(error,result)=>{
                    if(error) res.status(200).json({error});
                    else{
                       res.status(200).json({register:true});
                    }
                });
            }
        }
    }
}

module.exports = {
    getTimeTable,
    addWork,
    getWork,
    deleteWork,
    login,
    register
}