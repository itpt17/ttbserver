const fs = require('fs');

const renderTimeTable = (filepath)=>{
    var content = fs.readFileSync(filepath,'utf-8');
    var begindate = content.split(`<span id="ctl00_ContentPlaceHolder1_ctl00_lblNote" class="Label" style="font-style:italic;">`)[1];
    begindate = begindate.split("</span>")[0];
    begindate = begindate.split(" ");
    begindate = begindate[begindate.length-1].split(")")[0];
    var sbjlist = content.split(`<table width="100%" class="body-table" cellspacing="0" cellpadding="0">`);
    sbjlist.shift();
    let tmp = sbjlist[sbjlist.length-1].split("ctl00_ContentPlaceHolder1_ctl00_lblNoteUpdate")[0];
    sbjlist[sbjlist.length-1] = tmp;
    sbjlist = sbjlist.map((item)=>{
        let sbjdetail = item.split("</td>");
        let part1 = [],part2 = [];
        for(let i = 0; i<6; i++) part1.push(sbjdetail[i]);
        for(let i = 6; i<sbjdetail.length; i++) part2.push(sbjdetail[i]);
        part1 = part1.map((i)=>{
            let temp = i.split(">");
            return temp[temp.length-1];
        });
        part2 = part2.join("</td>");
        let tmppart = part2.split("onmouseover");
        part2 = tmppart[0];
        tmppart.shift();
        let part3 = tmppart.map((i)=>{
            let tmp3 = i.split(">");
            tmp3.shift();
            tmp3 = tmp3.join(">");
            return tmp3.split("<")[0];
        })
        let tmp1 = part2;
        let tmp2 = part2.split(`<div style="height:22px;vertical-align:middle;padding-top:5px">`);
        tmp2 = tmp2.map((i)=>{
            return i.split("<")[0];
        })
        tmp1 = tmp1.split(`<td align="center"`);
        tmp1 = tmp1.map((i)=>{
            return i.split(">")[1].split("<")[0];
        });
        part1.push(tmp1[0]);
        tmp1.shift();
        let step = (tmp1.length) / 6;
        let tmp = [];
        for(let i = 0; i < tmp1.length; i++){
            if((i+1)%step==0){
                tmp.push(tmp1[i]);
                tmp.push(tmp2[((i+1)/step) -1]);
            }else{
                tmp.push(tmp1[i]);
            }
        }
        let __tmp = [...tmp];
        tmp = [];
        step+=1;
        for(let i = 0; i < step; i++){
            for(let j = 1; j<=6; j++){
                tmp.push(__tmp[(i + (j-1)*(step))]);
            }
        }
        if(tmp[5] == null) tmp = tmp2;;
        return {subject: part1, detail: tmp, time: part3};
    });
    return {begin:begindate,sbjlist}
}

module.exports = {
    renderTimeTable
}