'use strict';
const Alexa = require('alexa-sdk');
const mysql = require('promise-mysql');
const request = require('request');
const beep= `<audio src='https://s3.amazonaws.com/eduai/speakingwizard/beep2.mp3'/>`;
const Speed_E = ' </prosody> ';
var student_info=new Array();
student_info[0]={};
student_info[0]['id']='57060074';
student_info[0]['name']='John Snow';
student_info[1]={};
student_info[1]['id']='16030424';
student_info[1]['name']='Pretty Kai';
student_info[2]={};
student_info[2]['id']='13070856';
student_info[2]['name']='Pretty Liz';
student_info[3]={};
student_info[3]['id']='57040002';
student_info[3]['name']='Handsome Jace';
student_info[4]={};
student_info[4]['id']='56080090';
student_info[4]['name']='Handsome Adam';

student_info[5]={};
student_info[5]['id']='18081505';
student_info[5]['name']='Mason';
student_info[6]={};
student_info[6]['id']='18030775';
student_info[6]['name']='Peter';
student_info[7]={};
student_info[7]['id']='17040042';
student_info[7]['name']='Iris';
student_info[8]={};
student_info[8]['id']='18040530';
student_info[8]['name']='Luna';
student_info[9]={};
student_info[9]['id']='18030759';
student_info[9]['name']='Jason';
student_info[10]={};
student_info[10]['id']='15110405';
student_info[10]['name']='June';
student_info[11]={};
student_info[11]['id']='18031368';
student_info[11]['name']='Mini';
student_info[12]={};
student_info[12]['id']='18011786';
student_info[12]['name']='Tommy';
student_info[13]={};
student_info[13]['id']='18050465';
student_info[13]['name']='Jay';
student_info[14]={};
student_info[14]['id']='17120887';
student_info[14]['name']='Alice';
student_info[15]={};
student_info[15]['id']='18010041';
student_info[15]['name']='Hani';
student_info[16]={};
student_info[16]['id']='18060898';
student_info[16]['name']='Mika';
student_info[17]={};
student_info[17]['id']='17100749';
student_info[17]['name']='James';
student_info[18]={};
student_info[18]['id']='17110137';
student_info[18]['name']='Rachel';
student_info[19]={};
student_info[19]['id']='18050336';
student_info[19]['name']='Chloe';
student_info[20]={};
student_info[20]['id']='17090294';
student_info[20]['name']='Ji in';
student_info[21]={};
student_info[21]['id']='17120877';
student_info[21]['name']='Mika';
student_info[22]={};
student_info[22]['id']='17120924';
student_info[22]['name']='Rosa';
student_info[23]={};
student_info[23]['id']='18070541';
student_info[23]['name']='David';
student_info[24]={};
student_info[24]['id']='17120884';
student_info[24]['name']='Aurora';
student_info[25]={};
student_info[25]['id']='17031366';
student_info[25]['name']='Emma';
student_info[26]={};
student_info[26]['id']='17111286';
student_info[26]['name']='Jio';
student_info[27]={};
student_info[27]['id']='17120888';
student_info[27]['name']='Juna';
student_info[28]={};
student_info[28]['id']='17120998';
student_info[28]['name']='Cindy';
student_info[29]={};
student_info[29]['id']='18050214';
student_info[29]['name']='JinHyun';
student_info[30]={};
student_info[30]['id']='17113181';
student_info[30]['name']='Sarah';
const handlers = {
    
    /////////////////////////////////////////////////////////////////////////////////////////////////세션시작/////////////
      'LaunchRequest': function () {
        console.log(`@@@LaunchRequest@@@`);
        const token = this.event.context.System.user.accessToken;
        //console.log(`token 바로:`,token);
        var options={
             url:`https://devoauth.koreapolyschool.com:443/api/user/profile`,
             headers:{'Authorization':'Bearer '+token},
        };
        var dynamo_db = this;
        request.get(options,(error,response,body)=>
        {
              if(error)
              {
                  console.log(`###############`+`oauth 실패`+`###############`);
                  this.emit(':tell',`It's Error. KoreaPOLYschool ID can not login. `);
              }
              else
              {
                  console.log(`###############`+`oauth 성공`+`###############`);
                  var sql;
                  var connection;
                  var QN;
                  var location;
                  mysql.createConnection(config).then(function(conn){
                      //console.log(`%%%오쓰받아옴:`,body);
                      body = JSON.parse(body);
                     // console.log(`body.user_id`,body.user_id);
                     // console.log(`body.name`,body.name);
                     // console.log(`body.email`,body.email);
                     //oauth_user_id=body.user_id;
                      console.log(`%%% Lanuch에서 new_skill_launch 프로시저 실행시도`);
                      sql=`call final_skill_launch("`+body.user_id+`","`+body.name+`","`+body.email+`");`;
                      dynamo_db.attributes['oauth_user_id']=body.user_id;
                      console.log(`sql:`,sql);
                      connection = conn;
                      return conn.query(sql);
                  }).then(function(results){
                      results =JSON.parse(JSON.stringify(results[0]));
                      results = results[0];
                      //console.log(`results.qn:`,results.qn);
                      
                      QN=parseInt(results.qn,10);
                      dynamo_db.attributes['QN'] = QN;
                      location = results.location;
                      dynamo_db.attributes[`WhyTerminated`] =` `;
                      dynamo_db.attributes['location'] = location;
                      dynamo_db.attributes['alexa_speech'] = `Welcome to SpeakingWizard 1. /%wait_5/ `;
                      /////추가하는부분////
                       if(location.substr(0,2)=='sw')
                        {
                            var u_n=location.substr(6,8);
                            var p_n=location.substr(10,12);
                            if(u_n[0]=='0')
                            {
                                u_n = u_n[1];
                            }
                            if(p_n[0]=='0')
                            {
                                p_n = p_n[1];
                            }
                                  if(QN<=1)
                                  {
                                      //처음
                                      dynamo_db.attributes['alexa_speech'] =dynamo_db.attributes['alexa_speech'].concat(` Unit `+u_n+`. Period `+p_n+`. `);
                                  }
                                  else
                                  {
                                       dynamo_db.attributes['alexa_speech'] =dynamo_db.attributes['alexa_speech'].concat(` Last time, we were studying Unit `
                                       +u_n+`. Period `+p_n+`. Let's continue that lesson. `);
                                       
                                  }
                        }
                 
                      /////////////////////
                      
                      dynamo_db.attributes[`QuerryLoad_Possible`]=1;
                      dynamo_db.attributes['set_start']=0;
                      dynamo_db.attributes['Speed_S'] =` <prosody rate='medium'> `;
                      dynamo_db.attributes['is_set']='N';
                      request('http://api.openweathermap.org/data/2.5/weather?id=1835847&APPID=9b3a3922e219d560ee44c12201fa33a3', function (error, response, body) {
                                    if(error)
                                {
                                  console.log('error:', error); // Print the error if one occurred
                                }
                                else
                                {
                                 // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                                  console.log('body:', body); // Print the HTML for the Google homepage.
                                  body = JSON.parse(body);
                                 
                                //  console.log('body:', body); // Print the HTML for the Google homepage.
                                //  console.log('body.weather:',body.weather);
                                //  console.log('body.weather[0]:',body.weather[0]);
                                  console.log('body.weather[0].main:',body.weather[0].main);
                                  // console.log('body.weather[1].main:',body.weather[1].main);
                                  console.log('body.name:',body.name);
                                  console.log('body.main.temp:',body.main.temp);
                                  var degree = body.main.temp-273.15;
                                  degree = parseFloat(degree,10);
                                  //degree = Math.round(degree);
                                  var weatherid = body.weather[0].id;
                                  var weather=``;
                                  if(weatherid>=200 && weatherid<=232) weather = weather.concat(`stormy`);
                                  else if(weatherid>=300 && weatherid<=531) weather = weather.concat(`rainy`);
                                  else if(weatherid>=600 && weatherid<=622) weather = weather.concat(`rainy`);
                                  else if(weatherid==800) weather = weather.concat(`sunny`);
                                  else if(weatherid>=801 && weatherid<=804) weather = weather.concat(`cloudy`);
                                  
                                
                                  if(weather==``)
                                  {
                                      if(degree <0)
                                      {
                                          weather = weather.concat(`cold.`);
                                      }
                                      else if(degree>=0 && degree<=18)
                                      {
                                          weather = weather.concat(`cool.`);
                                      }
                                      else if(degree>18 && degree<29)
                                      {
                                          weather = weather.concat(`warm.`);
                                      }
                                      else
                                      {
                                          weather = weather.concat(`hot.`);
                                      }
                                      
                                  }
                                  else
                                  {
                                       if(degree <0)
                                      {
                                          weather = weather.concat(` and cold.`);
                                      }
                                      else if(degree>=0 && degree<=18)
                                      {
                                          weather = weather.concat(` and cool.`);
                                      }
                                      else if(degree>18 && degree<29)
                                      {
                                          weather = weather.concat(` and warm.`);
                                      }
                                      else
                                      {
                                          weather = weather.concat(` and hot.`);
                                      }
                                  }
                                    dynamo_db.attributes['weather']= weather;
                                 // this.emit(':tell',`Today's weather in Seoul is ${weather}. `);
                                }
                            });
                      
                      
                      //console.log(`잘받아옴:`,QN,location);
                  }).then(function(results){
                     console.log(`%%% final_skill_launch 프로시저 성공`);
                      connection.end();
                     if(location.substr(0,8)=='sw01_u04')
                      {
                            this.emit(':tell','please say like this. Open Speaking Wizard unit 4.');
                         
                      }
                      else if(location.substr(0,8)=='sw01_u05')
                      {
                         this.emit(':tell','please say like this. Open Speaking Wizard unit 5.');
                          
                      }
                      else if(location.substr(0,8)=='sw01_u01' || location.substr(0,8)=='sw01_u02' || location.substr(0,8)=='sw01_u03')
                      {
                          this.emit('Question');
                            
                      }
                      else
                      {
                           this.emit('Question');
                      }
                  }.bind(this));
              }
        });
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    'Question': function(){
        var dynamo_db = this;
        console.log(`@@@Question@@@`);
        var QN = dynamo_db.attributes['QN'];
        var location = dynamo_db.attributes['location'];
        var sql;
        var connection;
        var alexa_speech=dynamo_db.attributes['alexa_speech'];
        var QuerryLoad_Possible =dynamo_db.attributes[`QuerryLoad_Possible`];
        var Speed_S = dynamo_db.attributes['Speed_S'];
        
        if(QuerryLoad_Possible==1)
        {
            QuerryLoad_Possible=0;
            dynamo_db.attributes['QuerryLoad_Possible']=0;
            mysql.createConnection(config).then(function(conn){
                sql =`call final_skill_question("`+QN+`","`+location+`");`;
                console.log(`sql:`,sql);
                connection = conn;
                return conn.query(sql);
                
            }).then(function(results){
                //console.log(`results:`,results);
                results = JSON.parse(JSON.stringify(results));
                //console.log(`results:`,results);
                
                //console.log(`results[0]:`,results[0]);
                //console.log(`results[1]:`,results[1]);
                
                if(results[0].length!=0)
                {
                    //console.log(`results[0].length:`,results[0].length);
                    //console.log(`results[0][0].stype:`,results[0][0].stype);
                    //console.log(`results[0][0].reask_chance:`,results[0][0].reask_chance);
                    //console.log(`results[0][0].set_num:`,results[0][0].set_num);
                    //console.log(`results[0][0].direction:`,results[0][0].direction);
                    dynamo_db.attributes['analysis_flag'] = results[0][0].analysis_flag;
                    dynamo_db.attributes['activity'] = parseInt(results[0][0].activity,10);
                    //console.log(`aaaaaaaaaaaaaaaaaaa:`,dynamo_db.attributes['activity']);
                    dynamo_db.attributes['type']=results[0][0].stype;
                    dynamo_db.attributes['setheadQN'] = QN;    
                    if(parseInt(results[0][0].set_num ,10)!=0) dynamo_db.attributes['is_set']=`Y`;
                    else  dynamo_db.attributes['is_set']=`N`;   
                                /////////////////위에는공통
                    if(dynamo_db.attributes['is_set']=='N')
                    {
                        if(dynamo_db.attributes['type']=='G' || dynamo_db.attributes['type']=='C' || dynamo_db.attributes['type']=='M' ||  dynamo_db.attributes['type']=='S'  )
                        {
                             var Random_Number=(Math.floor(Math.random() * results[1].length));  
                                //console.log(`results[1][Random_Number].read_number:`,results[1][Random_Number].read_number);
                                //console.log(`results[1][Random_Number].question:`,results[1][Random_Number].question);
                                
                            if(results[0][0].direction)alexa_speech = alexa_speech.concat(results[0][0].direction+` `);
                                
                            if(results[1][Random_Number].question)
                            {
                                    alexa_speech = alexa_speech.concat(results[1][Random_Number].question+` `);
                                    dynamo_db.attributes['question'] =results[1][Random_Number].question;
                            }
                                
                            dynamo_db.attributes['read_number']=parseInt(results[1][Random_Number].read_number,10);    
                                
                            dynamo_db.attributes['reask_chance'] = results[0][0].reask_chance;
                            dynamo_db.attributes['alexa_speech'] = alexa_speech;
                      
                   //         alexa_speech=set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                 
                            dynamo_db.attributes['alexa_speech'] = alexa_speech;
                        
                            return 1;
                            
                        }/////////////셋트가 아닌경우 question을 랜덤하게 가져옴//////////////
                        else if(dynamo_db.attributes['type']=='E')
                        {
                            
                            alexa_speech = alexa_speech.concat(` `+results[0][0].direction);
                            
                            var nextqn = results[1][0].question;
                            nextqn = nextqn.split('/');
                            var savelocation = nextqn[0];
                            var saveqn = nextqn[1];
                            ////sql은 final_skill_student_info를 업데이트 해준다
                            //location 하고 qn을
                           // alexa_speech=set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                            
                             sql=`call final_skill_etype("`+dynamo_db.attributes['oauth_user_id']+`","`+
                             dynamo_db.attributes['location']+`","`+dynamo_db.attributes['type']+`","`+dynamo_db.attributes['QN']+`","`+
                             alexa_speech+`##stop by Etype##`+`","`+saveqn+`","`+savelocation+`");`;
                            console.log(`sql:`,sql);
                
                            return connection.query(sql);
                        }
                    }  
                    else // 셋트로 묵는경우임dynamo_db.attributes['is_set']=='Y' 상태
                    {
                        if(dynamo_db.attributes['set_start']==0) ////////첫셋트인경우 세트로 묶은 새로운 질문번호중 하나의 정보를 새롭게 가져와야함
                        {
                            //첫 셋트인경우
                            if(results[0][0].direction)alexa_speech = alexa_speech.concat(results[0][0].direction+` `);
                            
                            dynamo_db.attributes['set_start']=1;  //set_start 가 1이면 처음  2이면 중간 0이면 셋트아님
                                //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                                //여기서 read_number따로 기억 dynamoDB
                                //dynamo_db.attributes['is_set']=`Y`;
                                //SELECT qn FROM EDUAI.final_skill_direction where location='test4' and set_num='1';
                            sql =`SELECT qn FROM EDUAI.final_skill_direction where location='`+dynamo_db.attributes['location']+
                                 `' and set_num='`+parseInt(results[0][0].set_num ,10)+`'`;
                            console.log(`sql:`,sql);
                                //dynamo_db.attributes
                            return connection.query(sql);
                        }
                        else //첫셋트가 아닌경우에는... 셋트중간인거임
                        {
                            return 222;
                        }
                    }
                    ///////////////////////////////////////////여기 수정할것    
                   
                    
                }/////////////////direction load 성공
                else
                {
                    /////////////////direction load 실패
                    return -1;
                }
            }).then(function(results){
                if(results ==-1)
                {
                    return -1; //디렉션 못가져온경우
                }
                else 
                {
                        if(dynamo_db.attributes['is_set']=='N')//세트가아님
                        {
                            if(dynamo_db.attributes['type']=='G' || dynamo_db.attributes['type']=='C' ) /////여기서 C타입도 추가해주면 될거 같음 셋트건 뭐건
                            {
                                return 1; //정상
                            }// 여기서부터 S타입 question 가져오는일부터 한다
                          
                            else if(dynamo_db.attributes['type']=='M'||dynamo_db.attributes['type']=='S') ////메모리타워랑 센탠스배틀
                            {
                                //메모리타워 단어DB가 뭔지 가져옴
                                sql=`SELECT case_array FROM EDUAI.final_skill_case where location='`+dynamo_db.attributes['location']
                                +`' and qn='`+dynamo_db.attributes['QN']+`';`;
                                return connection.query(sql);
                            }
                            else if(dynamo_db.attributes['type']=='E')
                            {
                                  return 1; //정상종료할것
                            }
                        }//세트가아님
                        else///////////////////////////////////////////셋트인경우
                        {  
                            if(dynamo_db.attributes['set_start']==1)
                            {//같은 셋트 qn을 긁어온상태
                                dynamo_db.attributes['set_start']=2;
                                //console.log(`세트경우:`,results);
                                results = JSON.parse(JSON.stringify(results));
                                console.log(`세트경우:`,results);
                                var decided_order_set=new Array();
                                
                                for(var i = 0 ; i <results.length; i++)
                                {
                                    decided_order_set[i]=results[i].qn;
                                   
                                }
                                console.log(`안섞은순서!!!!:`,decided_order_set);
                                //decided_order_set.sort(() => Math.random() - 0.5);
                                 for (var i = decided_order_set.length - 1; i > 0; i--)
                                 {
                                   let j = Math.floor(Math.random() * (i + 1));
                                    [decided_order_set[i], decided_order_set[j]] = [decided_order_set[j], decided_order_set[i]];
                                }
                                console.log(`섞은순서!!!!:`,decided_order_set);
                                var db_decided_order_set =` `;//
                                for(var i = 0 ; i<decided_order_set.length ; i++)
                                {
                                    if(i+1!=decided_order_set.length)
                                    {
                                        if(i==0)
                                        {
                                            QN=parseInt(decided_order_set[i],10);
                                            dynamo_db.attributes['QN']=QN;
                                        }
                                        else
                                        {
                                            db_decided_order_set = db_decided_order_set.concat(decided_order_set[i]+'/');
                                        }
                                    }
                                    else
                                    {
                                        db_decided_order_set = db_decided_order_set.concat(decided_order_set[i]);
                                    }
                                }

                                console.log(`저장할 순서->`,db_decided_order_set);
                                dynamo_db.attributes['db_decided_order_set']=db_decided_order_set;
                                dynamo_db.attributes['should_read'] = 1;
                                console.log(`가져와야할QN:`,QN);
                                
                            
                                dynamo_db.attributes['Dcheck']=0;
                                if(dynamo_db.attributes['type']=='D')
                                {
                                    
                                    dynamo_db.attributes['Dcheck']=3;
                                }
                               
                                  
                               
                                
                                dynamo_db.attributes['QN'] =QN;
                                ///////////////여기서 셋트 처음 qn에 대해서 질문을 가져와야함
                                //sql 처음꺼 return 해야함
                                //sql = 프로시저 question꺼 다시 가져오면될듯
                                //ㅈㅈㅈㅈㅈㅈㅈㅈㅈㅈㅈㅈㅈ
                               
                              
                              
                                
                                sql =`call final_skill_question("`+QN+`","`+location+`");`;
                                console.log(`새로운 set의 qn을 가져옴 sql:`,sql);
                                //return 221; //셋트인경우처음꺼임
                                return connection.query(sql);
                            }//첫셋트
                            else//dynamo_db.attributes['set_start'] 가 2인경우임 셋트중임
                            {
                                //dynamo_db.attributes['db_decided_order_set'] 확인후 마지막일경우
                                //더이상없으면 is_set 값 N 로 바꾸고
                                //어짜피 쿼리는 위에랑 똑같이 새로운 QN에 대해 가져와야함
                               
                                sql =`call final_skill_question("`+QN+`","`+location+`");`;
                                console.log(`2번이상부터 새로운 set의 qn을 가져옴 sql:`,sql);
                                //return 221; //셋트인경우처음꺼임
                                return connection.query(sql);
                            }//셋트중간
                        }///셋트인경우

                }//디렉션을 잘 가져온경우
            }).then(function(results){
                if(results==-1) 
                {
                    return -1;
                }
                else
                {
                        if(dynamo_db.attributes['is_set']=='N')
                        {
                            if(dynamo_db.attributes['type']=='G' || dynamo_db.attributes['type']=='C') /////여기서 C타입도 추가해주면 될거 같음 셋트건 뭐건
                            {
                                return 1; //정상
                            }
                            else if(dynamo_db.attributes['type']=='S')
                            {
                                
                                results=JSON.parse(JSON.stringify(results));
                                dynamo_db.attributes['alexa_lost_percentage']=results[0].case_array;
                                dynamo_db.attributes['alexa_cannotremember_say']=results[1].case_array;
                                dynamo_db.attributes['S_A_point']=0;
                                dynamo_db.attributes['S_S_point']=0;
                                //var S_sentences = results[2].case_array.toLowerCase();
                                var S_sentences = new Array();
                                var S_sentences_check = new Array();
                                for(var i = 2 ; i<results.length;i++)
                                {
                                    S_sentences_check[i-2] = 0;
                                    S_sentences[i-2] = results[i].case_array.toLowerCase();
                                    S_sentences[i-2] = S_sentences[i-2].split(`/`);
                                }
                                if(S_sentences.length<6)//오류
                                {
                                    dynamo_db.attributes['S_sentences_count']=0;
                                    return -1;
                                }
                                else
                                {
                                    dynamo_db.attributes['S_sentences_count'] = S_sentences.length;
                                    dynamo_db.attributes['S_sentences_check']=S_sentences_check;
                                    dynamo_db.attributes['S_sentences']=S_sentences;
                                    if(S_sentences.length>=6 && S_sentences.length<8)dynamo_db.attributes['S_should_say_count']=3;
                                    else dynamo_db.attributes['S_should_say_count']=4;
                                }
                              
                                
                                //저장은 다했고 랜덤으로 골라내자 랜덤확률에 의해서   S타입중임
                                //losepercent 안에는 알렉사가 질 확률이 들어있음
                                var losepercent_split = dynamo_db.attributes['alexa_lost_percentage'].split(`/`);
                                var losepercent;
                                losepercent = parseInt(losepercent_split[0],10);
                                /////////////////////////////////////////
                                var mytemp=` `;
                                

                                    for(var i =1 ; i<losepercent_split.length;i++)
                                    {
                                                if(i+1==losepercent_split.length)
                                                {
                                                    mytemp =mytemp.concat(losepercent_split[i]);
                                                }
                                                else
                                                {
                                                    mytemp =
                                                    mytemp.concat(losepercent_split[i]);
                                                    mytemp=mytemp.concat(`/`);
                                                }
                                    }
                                if(losepercent_split.length>1)dynamo_db.attributes['alexa_lost_percentage'] = mytemp;//!@#
                           
                           /////////////////
                                var Random_Number=(Math.floor(Math.random() * 100));  
                                if(Random_Number<losepercent)
                                {
                                    //console.log(`알렉사가 지는확률걸림 알렉사의실수피드백`);
                                    //질경우임 losepercent가 80일때 Random_Number가 80보다 작게 나올경우에만
                                    //지는피드백을 붙여주고 니턴이라고 하고 보내자
                                    //왜 저징이 안됩니까? 이해할수 없어
                                    alexa_speech = alexa_speech.concat(` `+dynamo_db.attributes['alexa_cannotremember_say']+` `);
                                    dynamo_db.attributes['alexa_speech'] = dynamo_db.attributes['alexa_speech'].concat(` `+dynamo_db.attributes['alexa_cannotremember_say']+` `);
                                }
                                else
                                {
                                    //console.log(`알렉사가 제대로하는확률걸림 알렉사의 제대로피드백`);
                                    //이길경우 알렉사가 제대로말함
                                    //랜덤체크중에 하나를 랜덤으로 뽑아내자
                                    dynamo_db.attributes['S_A_point']++;
                                    while(1)
                                    {
                                        Random_Number =  (Math.floor(Math.random() * dynamo_db.attributes['S_sentences_count']));   
                                        if(dynamo_db.attributes['S_sentences_check'][Random_Number] ==0 && Random_Number<30) break;
                                    }
                                    
                                    alexa_speech = alexa_speech.concat(` `+dynamo_db.attributes['S_sentences'][Random_Number][0]);
                                    dynamo_db.attributes['alexa_speech'] = dynamo_db.attributes['alexa_speech'].concat(` `+dynamo_db.attributes['S_sentences'][Random_Number][0]);
                                    dynamo_db.attributes['S_sentences_check'][Random_Number]=1;
                                }
                                // question중 첫 1번
                                // SB개편 question부분 끝
                                return 1;
                            }////S타입끝
                            else if(dynamo_db.attributes['type']=='M')
                            {
                                results=JSON.parse(JSON.stringify(results));
                               // console.log(`가져온 case_array 메모리타워에서 알렉사 처음말할꺼임`,results);
                                //console.log(`확인:`,results[0].case_array); //여기에 확률 들어 있음
                                dynamo_db.attributes['alexa_lost_percentage']=results[0].case_array;
                                
                                var should_readdbname = results[1].case_array.substring(1,results[1].case_array.length-1);
                                
                                sql = `SELECT word FROM EDUAI.final_skill_words where name='`+should_readdbname+`';`;
                                
                                return connection.query(sql);
                            }
                            else if(dynamo_db.attributes['type']=='E')
                            {
                                  return 1; //정상종료할것
                            }
                        }
                        else//셋트경우 처음이건 나중이건 공통임
                        {//셋트의경우임  순서에따른 새로운 question을 긁어온상태임 
                            if(dynamo_db.attributes['set_start']==2)
                            { //question 처음이라고 보시면됨
                               
                                results =JSON.parse(JSON.stringify(results));
                                //새로가져온결과 :`,results);
                                
                                 var Random_Number=(Math.floor(Math.random() * results[1].length));  
                                dynamo_db.attributes['activity'] = parseInt(results[0][0].activity,10);
                                //console.log(`bbbbbbbbbbbbbb:`,dynamo_db.attributes['activity']);
                                //if(results[0][0].direction)alexa_speech = alexa_speech.concat(results[0][0].direction+` `);
                                dynamo_db.attributes['type']=results[0][0].stype;
                                
                                dynamo_db.attributes['read_number']=parseInt(results[1][Random_Number].read_number,10);
                                if( dynamo_db.attributes['read_number']==1)
                                {
                                    alexa_speech = alexa_speech.concat(`number `+dynamo_db.attributes['should_read']+`. `);
                                    dynamo_db.attributes['should_read']++;
                                    
                                }
                                if(results[1][Random_Number].question)
                                {
                                        alexa_speech = alexa_speech.concat(results[1][Random_Number].question+` `);
                                        dynamo_db.attributes['question'] =results[1][Random_Number].question;
                                }
                                    
                                    
                                    
                                dynamo_db.attributes['reask_chance'] = results[0][0].reask_chance;
                                dynamo_db.attributes['alexa_speech'] = alexa_speech;
                              //  alexa_speech=set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                            
                                
                               
                                if(dynamo_db.attributes['Dcheck']==3)
                                {
                                        dynamo_db.attributes['Dcheck']=2;
                                        
                                        sql =`SELECT  case_array,feedback from EDUAI.final_skill_case where qn ='`+dynamo_db.attributes['setheadQN']
                                        +`' and location ='`+dynamo_db.attributes['location']+`'; `;
                                        
                                        console.log(`D타입 처음에대한 sql:`,sql);
                                        return connection.query(sql);
                                }
                                else
                                {
                                    return 222;
                                }
                                
                                //여기가 셋트 공통인데 D타입의경우만 222리턴 말고 쿼리 한번 불러오자
                                //dynamo_db.attributes['setheadQN'] 에 대해서 case_array랑  feedback 가져오면댐
                                // location은 그대로
                                //Dcheck이 3인경우만 그렇게 하고 Dcheck을 2으로 바꿔준다 구리고 셋팅하고 0으로 해줘야함
                                
                          
                            }
                            else
                            {
                                
                                return 1;
                            }
                            
                        }
                }
            }).then(function(results){
                 if(results==-1) 
                {
                    return -1;
                }
                else
                {
                    if(dynamo_db.attributes['is_set']=='N')
                    {
                        if(dynamo_db.attributes['type']=='M')
                        {
                            results=JSON.parse(JSON.stringify(results));
                            
                           // console.log(`가져온 메모리타워에서 사용할 DB:`,results);
                            var M_worddb_array = new Array();
                            var M_worddb_array_check = new Array();
                            var Order_total_word = new Array();
                            for( var i = 0 ; i<results.length ; i++)
                            {
                                M_worddb_array[i] =results[i].word.toLowerCase();
                                M_worddb_array_check[i] = 0;
                            }
                            dynamo_db.attributes['M_worddb_array'] =M_worddb_array;
                            dynamo_db.attributes['M_worddb_array_check'] =M_worddb_array_check;
                            //console.log(`(순수추출)M_worddb_array:`,M_worddb_array);
                            var Random_Number=(Math.floor(Math.random() * M_worddb_array.length));  
                            
                           
                            
                            Order_total_word[0] = dynamo_db.attributes['M_worddb_array'][Random_Number];
                            dynamo_db.attributes['Order_total_word'] = Order_total_word;
                             
                             
                            dynamo_db.attributes['M_worddb_array_check'][Random_Number] = 1;
                            dynamo_db.attributes['alexa_speech'] = dynamo_db.attributes['alexa_speech'].concat(dynamo_db.attributes['M_worddb_array'][Random_Number]+`. `);
                            dynamo_db.attributes['M_wordcount'] =1 ;
                            
                            //이걸 지우고
                            //dynamo_db.attributes['question'] = dynamo_db.attributes['question'].concat(dynamo_db.attributes['Order_total_word'][0]+`. `);
                            
                            
                            alexa_speech = dynamo_db.attributes['alexa_speech'];
                            
                            dynamo_db.attributes['M_student_should_say'] = 2;
                            dynamo_db.attributes['M_polyrepeat'] = 0 ;
                            dynamo_db.attributes['M_studentpass_index']= 0;
                            dynamo_db.attributes['M_onlyding']=0;
                            
                            return 1;
                            //메모리타워 첫발화 끝
                            
                            
                        }
                        else//G C E S D 셋트가 아닌경우임
                        {
                            
                   
                         console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:`,alexa_speech); 
                       
                            return 1;
                            
                        }
                    }
                    else//셋트경우 처음이건 나중이건 공통임
                    {
                        if(dynamo_db.attributes['Dcheck']==2)
                        {
                            dynamo_db.attributes['Dcheck']=0;
                            results=JSON.parse(JSON.stringify(results));
                            console.log(`D타입 처음의 결과:`,results);
                                //  여기는 딱한번이라서 여기말고 다른데서 각놈들에 대한 포인트를 다 구해야할듯 그래서 니 점수 이거 맞추면 몇점이야 말해야함
                                
                                //[3]feedback  걍못하고 통과못함
                                //[4]feedback  마지막은 맞췄는데 점수 못얻음
                                //[5]feedback  중간에 통과함
                                //[1]case_array  D셋트의 통과점수
                                dynamo_db.attributes['D_final_no_fail'] = results[3].feedback;
                                dynamo_db.attributes['D_final_ok_fail'] = results[4].feedback;
                                dynamo_db.attributes['D_final_ok_pass'] = results[5].feedback;
                                dynamo_db.attributes['D_pass_grade'] = parseInt(results[1].case_array,10);
                                dynamo_db.attributes['D_student_grade']=0;
                                
                            return 1;
                        }
                        else
                        {
                            return 1;
                        }
                    }
                }
                
            }).then(function(results){
                connection.end();
                if(results==-1)
                {
                    console.log(`Error! can not load Direction`);
                    this.emit(':tell',`Error! can not load Direction`);
                }
                else if(dynamo_db.attributes['is_set']=='N') //세트로 안묵는경우
                {
                    
                    if(dynamo_db.attributes['type']=='E')
                    {
                        alexa_speech = set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                        console.log(`*************************************************************************`);
                        console.log(`***alexa say:`,alexa_speech,`***`);
                        console.log(`*************************************************************************`);
                        this.emit(':tell', `${Speed_S}${alexa_speech}${Speed_E}`);
                    }
                    else //G C E M S
                    {
                        alexa_speech = set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                        console.log(`*************************************************************************`);
                        console.log(`***alexa say:`,alexa_speech,`***`);
                        console.log(`*************************************************************************`);
                        this.emit(':ask', `${Speed_S}${alexa_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                    }
                }
                else if(dynamo_db.attributes['is_set']=='Y') // G C
                {
                    alexa_speech = set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                    console.log(`*************************************************************************`);
                    console.log(`***alexa say:`,alexa_speech,`***`);
                    console.log(`*************************************************************************`);
                    this.emit(':ask', `${Speed_S}${alexa_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                }
                else
                {
                    this.emit(':tell',`error can not load is_set at dynamo_db!`);
                }
            }.bind(this));
        }//QuerryLoad_Possible ==1 경우만
        
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        else//QuerryLoad_possible =0 경우
        {
            var alexa_speech=dynamo_db.attributes['alexa_speech'];
            if(dynamo_db.attributes['type']=='G' || dynamo_db.attributes['type']=='C' || dynamo_db.attributes['type']=='D')
            {
                
                if( dynamo_db.attributes['read_number']==1) alexa_speech = alexa_speech.concat(`number `+(dynamo_db.attributes['should_read']-1)+`. `);
                
                alexa_speech = alexa_speech.concat(` `);
                alexa_speech = alexa_speech.concat(dynamo_db.attributes['question']);
                dynamo_db.attributes['alexa_speech'] = alexa_speech;
                
                alexa_speech = set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                    console.log(`*************************************************************************`);
                    console.log(`***alexa say:`,alexa_speech,`***`);
                    console.log(`*************************************************************************`);
                    
                this.emit(':ask', `${Speed_S}${alexa_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
            }// question중 2번쨰이상부터
            else if(dynamo_db.attributes['type']=='S')
            {
                alexa_speech = set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                console.log(`*************************************************************************`);
                console.log(`***alexa say:`,alexa_speech,`***`);
                console.log(`*************************************************************************`);
                this.emit(':ask', `${Speed_S}${alexa_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                
            }
            else if(dynamo_db.attributes['type']=='M')
            {
                if(dynamo_db.attributes['M_onlyding']==1)
                {
                    //alexa_speech = `say next!`;
                    alexa_speech = ``;
                    //
                    //여기엔 니가 여기까지 이야기했어 라고 한번 해주자
                   // alexa_speech = set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                    console.log(`*************************************************************************`);
                    console.log(`***alexa say:`,alexa_speech,`***`);
                    console.log(`*************************************************************************`);
                    this.emit(':ask', `${Speed_S}${alexa_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                }
                else if(dynamo_db.attributes['M_onlyding']==0 && dynamo_db.attributes['M_polyrepeat']==1)
                {
                    dynamo_db.attributes['M_polyrepeat']=0;
                    alexa_speech = alexa_speech.concat(` `);
                    alexa_speech = alexa_speech.concat(dynamo_db.attributes['question']+` `);
                    for(var i = 0 ; i <dynamo_db.attributes['M_wordcount'] ; i++)
                    {
                        alexa_speech = alexa_speech.concat(dynamo_db.attributes['Order_total_word'][i]+`. `);
                    }
                    dynamo_db.attributes['alexa_speech'] = alexa_speech;
    
                     alexa_speech = set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                    console.log(`*************************************************************************`);
                    console.log(`***alexa say:`,alexa_speech,`***`);
                    console.log(`*************************************************************************`);
                    this.emit(':ask', `${Speed_S}${alexa_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                }
                else
                {
                    alexa_speech = set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
                     console.log(`*************************************************************************`);
                    console.log(`***alexa say:`,alexa_speech,`***`);
                    console.log(`*************************************************************************`);
                    this.emit(':ask', `${Speed_S}${alexa_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                }
            }
            else
            {
                this.emit(':tell',`QuerryLoad_Possible=0 -> elsetype not yet`);
            }
        }//QuerryLoad_possible=0 경우
    },
    
    'Answer': function(){
        console.log(`@@@Answer@@@ `);
        var speak = this.event.request.intent.slots.speak.value;
        speak = speak.replace("#","number ");
        speak = speak.replace("-"," ");
        speak=speak.toLowerCase();
        console.log(`*************************************************************************`);
        console.log(`***student say:`,speak,`***`);
        console.log(`*************************************************************************`);
        var dynamo_db = this;
        var QN = dynamo_db.attributes['QN'];
        var before_QN=QN;
        var location = dynamo_db.attributes['location'];
        var sql;
        var connection;
        var alexa_speech=dynamo_db.attributes['alexa_speech'];
        var type = dynamo_db.attributes['type'];
        var log_alexa_speech=alexa_speech;
        var choose_case_num=0;
        //////////////////
        var case_num = new Array();
        var case_array = new Array();
        var case_feedback = new Array();
        var case_qn_move = new Array();
        var case_feedback_dbname = new Array();
        var D_q_per_point;
        var D_isgetpoint=0;
        ///////////////////////////////
        var reask_left_feedback;
        var fail_feedback;
        var reask_qn_move;
        var C_table_name_array = new Array();
        var C_table_value_array = new Array();
        mysql.createConnection(config).then(function(conn){
           sql=`SELECT case_num,case_array,feedback,qn_move FROM EDUAI.final_skill_case where location="`+location+`" and qn="`+QN+`";`;
           
          //sql=`call final_skill_answer("`+dynamo_db.attributes['oauth_user_id']+`","`+location+`","`+type+`","`+QN+`","`+speak+`","`+alexa_speech+`");`;
            console.log(`sql:`,sql);
            connection = conn;
            return conn.query(sql);
        }).then(function(results){ 
            //console.log(`Answer에서 case가져온거:`,results);
            results = JSON.parse(JSON.stringify(results));
            //console.log(`Answer에서 case가져온거:`,results);
            var case_total = results;
            console.log(`case_total:`,case_total);
            if(case_array.length)console.log(`case_total.length:`,case_total.length);
            else console.log(`############################################################case_tatal.length가 없음`);
           if(case_total.length>=3)
           {
                for(var i = 2 ; i<case_total.length ; i++)
                {
                    case_num[i-2] = case_total[i].case_num;
                    case_array[i-2] = case_total[i].case_array;
                    case_feedback[i-2] = case_total[i].feedback;
                    case_qn_move[i-2] = case_total[i].qn_move;
                    var splitqnmove ;

                    splitqnmove = case_qn_move[i-2].split('/');
                
                    var Random_Number=(Math.floor(Math.random() * splitqnmove.length));  
                    splitqnmove = splitqnmove[Random_Number];
                    splitqnmove = parseInt(splitqnmove,10);
                    case_qn_move[i-2] =splitqnmove;
                    
                    //case_array[i] = new Array();
                    case_array[i-2] = case_array[i-2].toLowerCase();
                    case_array[i-2] = case_array[i-2].split(`/`);   
    
                }
           }
            reask_left_feedback=case_total[0].feedback;
            fail_feedback = case_total[1].feedback;
            
            /////////////////////////////////////////////////////////
           
            ///////////////////////////////////////////
            reask_qn_move = case_total[1].qn_move;
            splitqnmove = reask_qn_move.split('/');
            var Random_Number=(Math.floor(Math.random() * splitqnmove.length));  
            splitqnmove = splitqnmove[Random_Number];
            splitqnmove = parseInt(splitqnmove,10);
            reask_qn_move=splitqnmove;
        
            
            
            if(type=='D') D_q_per_point=parseInt(case_total[0].case_array,10); // D의 문제당 점수
            
            for(var i = 0 ; i<case_total.length ;i++)
            {
                case_feedback_dbname[i]=``;
            }//%fb_1234/ 를 읽어야함
            
            //reask_left_feedback 이 db를 사용하나 검사
            
            var split_feedback;
            if(reask_left_feedback) split_feedback= reask_left_feedback.split(`/`);
            if(split_feedback)
            {
                case_feedback_dbname[0] = get_feedback_dbname(split_feedback);
            }
            if(fail_feedback) split_feedback = fail_feedback.split(`/`);
            if(split_feedback){
                case_feedback_dbname[1] = get_feedback_dbname(split_feedback);
            }
            for(var i = 2 ; i<case_total.length;i++)
            {
                split_feedback = case_feedback[i-2].split(`/`);
                if(split_feedback) case_feedback_dbname[i] = get_feedback_dbname(split_feedback);
            }
            /*
            console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%:`,case_feedback_dbname);
            console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:`,case_feedback_dbname[0]);
            console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:`,case_feedback_dbname[1]);
            console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:`,case_feedback_dbname[2]);
            console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:`,case_feedback_dbname[0].length);
            console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:`,case_feedback_dbname[1].length);
            console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:`,case_feedback_dbname[2].length);*/
            //여기서 db명만 쫙 뺴와야함
            ////////////////이부분코드정리좀하자
            var dbkind= new Array();
            var dbkindindex=0;
            for(var i = 0 ; i<case_feedback_dbname.length; i++)
            {
                for(var j = 0 ; j<case_feedback_dbname[i].length ; j++)
                {
                    dbkind[dbkindindex]=case_feedback_dbname[i][j];
                    dbkindindex++;
                }
            }
            //console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:`,dbkind);
            
            
            
            if(dbkind.length==0)
            {
                return 1;
            }
            else
            {
                sql = `SELECT feedback,name FROM EDUAI.final_skill_feedback where name='`;
                for(var i = 0 ; i<dbkind.length ; i++)
                {
                    if(i+1 !=dbkind.length)
                    {
                        sql=sql.concat(dbkind[i]+`' or name='`);
                    }
                    else
                    {
                        sql=sql.concat(dbkind[i]+`'`);
                    }
                }
                console.log(`sql:`,sql);
                return connection.query(sql);
            }
            
          //  sql = `SELECT feedback,name FROM EDUAI.final_skill_feedback where name='`+good+`' or name='good'`;
        }).then(function(results){ 
            ////////////////////////피드백 랜덤으로 뽑아올것! ///////////////////////
            if(results!=1)//피드백에서 db를 안씀
            {
                //여기는 피드백 db연산
                //results 중에서 랜덤으로 하나 골라서 case_feedback 이 3개 있다 칠때, fail_feedback, reask_feedback 까지 총 5개를 랜덤으로 고른걸 넣어줘야함
                //console.log(results);
                results = JSON.parse(JSON.stringify(results));
                var feedbackdb_load = results;
                console.log(`피드백db읽은결과:`,feedbackdb_load);
                
                reask_left_feedback = set_feedback_dbname(feedbackdb_load,reask_left_feedback);
                fail_feedback = set_feedback_dbname(feedbackdb_load,fail_feedback);
                for(var i = 0 ; i<case_feedback.length ; i++)
                {
                    
                    case_feedback[i] = set_feedback_dbname(feedbackdb_load,case_feedback[i]);

                    console.log(`바뀐 case_feedback[`,i,`]:`,case_feedback[i]);
                }
                console.log(`바뀐 reaskf:`,reask_left_feedback);
                console.log(`바뀐 failf:`,fail_feedback);
                
            }
            ///////////////////////////////////////여기까지 모두공통////////////////////////////////////////
           
                if(type=='C')
                {
                    var index=0;
                            for(var i = 0 ; i <case_array.length ; i++)
                            {
                                for(var j = 0 ; j<case_array[i].length ; j++)
                                {
                                    console.log(`C타입 case_array들:`,case_array[i][j]);
                                    //case_array를 쪼개서 #db가 있으면 index 넣자
                                    var tmpsplit = case_array[i][j].split(` `);
                                    for(var k = 0 ; k <tmpsplit.length;k++)
                                    {
                                        if(tmpsplit[k][0]=='#')
                                        {
                                            var tname= tmpsplit[k].substring(1,tmpsplit[k].length-1);
                                            //중복검사
                                            var isjungbok = 0;
                                            for(var p = 0 ; p<C_table_name_array.length; p++)
                                            {
                                                if(C_table_name_array[p]==tname)
                                                {
                                                    console.log(`중복이니까 break`);
                                                    isjungbok=1;
                                                    break;
                                                }
                                            }
                                            if(isjungbok==0)
                                            {
                                                C_table_name_array[index]=tname;
                                                index++;
                                            }
                                        }
                                    }
                                }
                            }
                            sql = `SELECT word,name from final_skill_words where`;
                            
                            for(var i = 0 ; i <C_table_name_array.length; i++)
                            {
                                console.log(`#########가져올DB목록:`,C_table_name_array[i]);
                                if(i+1 == C_table_name_array.length)
                                {
                                    sql = sql.concat(` name = "`+C_table_name_array[i]+`"`);
                                }
                                else
                                {
                                    sql = sql.concat(` name = "`+C_table_name_array[i]+`" or`);
                                }
                            }
                            
                            console.log(`C타입에서 가져올 sql:`,sql);
                            return connection.query(sql);
                }
                else
                {
                    return 2;
                }
        }).then(function(results){ 
            if(type=='C')
            {
                results = JSON.parse(JSON.stringify(results));
                console.log(`####바꿈!!!:`,results);
                var C_table_value_index=0;
                for(var i = 0 ; i<results.length ; i++)
                {
                    for(var j = 0 ; j<C_table_name_array.length ; j++)
                    {
                        results[i].word = results[i].word.toLowerCase();
                            if(results[i].name==C_table_name_array[j])
                            {
                                    //console.log(`#####test:`,C_table_value_array[j]);
                                   // if(C_table_value_array[j] && (C_table_value_array[j].length>0))
                                if(Array.isArray(C_table_value_array[j]))
                                {
                                    C_table_value_array[j][C_table_value_index]=results[i].word;
                                    C_table_value_index++;
                                }
                                else
                                {
                                    C_table_value_array[j]= new Array();
                                    C_table_value_index=0;      
                                    C_table_value_array[j][C_table_value_index]=results[i].word;
                                    C_table_value_index++;
                                }

                                break;
                            }
                    }
                            
                }/////////////DB값 읽어온거 C_table_value_array에 넣었음
                console.log(`우아아아아:`,C_table_value_array);//
                return 1;
            }
            else
            {
                return 1;
            }
        }).then(function(results){ 
            if(type =='S')
            {
                
                 console.log(`student speak!:`,speak);
                 var isok=0;
                 for(var i = 0 ; i<dynamo_db.attributes['S_sentences_count'] ; i++)
                 {
                     //if(speak==dynamo_db.attributes['S_sentences'][i])
                     for(var j = 0 ; j <dynamo_db.attributes['S_sentences'][i].length ; j++)
                     {
                         if(speak==dynamo_db.attributes['S_sentences'][i][j])
                         {
                            isok=1; //정답이긴함
                            //
                            if(dynamo_db.attributes['S_sentences_check'][i]==1)
                            {
                                isok=2;
                                break;
                            }
                            
                            dynamo_db.attributes['S_sentences_check'][i]=1;
                            break;
                             
                         }
                         if(isok==1 || isok==2) break;
                     }
                     
                 }
                 
                 dynamo_db.attributes['S_should_say_count']--;
                 
                 if(isok==0)
                 {
                     //이상한거 말함 
                     
                     alexa_speech=case_feedback[4];
                 }
                 else if(isok==1)
                 {
                     alexa_speech=case_feedback[5];
                     dynamo_db.attributes['S_S_point']++;
                     //점수도 1점 올려줘야함
                    //패스
                   
                     
                 }
                 else if(isok==2)
                 {
                     //중복
                     alexa_speech=case_feedback[3];
                 }
                 
                 
                 if(dynamo_db.attributes['S_should_say_count']==0)
                 {
                     //다음으로 이동해야함 QuerryLoadPossible1로 바꾸고
                     if(dynamo_db.attributes['S_A_point']==4 && dynamo_db.attributes['S_S_point']==4)
                     {
                         alexa_speech = alexa_speech.concat(case_feedback[2]+` `);
                     }
                     else if(dynamo_db.attributes['S_A_point']==3 && dynamo_db.attributes['S_S_point']==3 && dynamo_db.attributes['S_sentences_count'] <=7)
                     {
                         alexa_speech = alexa_speech.concat(case_feedback[2]+` `);
                     }
                     else if(dynamo_db.attributes['S_A_point']==0 && dynamo_db.attributes['S_S_point']==0)
                     {
                         alexa_speech = alexa_speech.concat(case_feedback[1]+` `);
                     }
                     else if(dynamo_db.attributes['S_A_point']>dynamo_db.attributes['S_S_point'])
                     {
                         //알렉사이김
                         alexa_speech = alexa_speech.concat(case_feedback[0]+` `);
                     }
                     else if(dynamo_db.attributes['S_A_point']<dynamo_db.attributes['S_S_point'])
                     {
                         //학생이김
                         alexa_speech=alexa_speech.concat(fail_feedback+` `);
                     }
                     else
                     {
                         //비김
                         alexa_speech=alexa_speech.concat(reask_left_feedback+` `);
                     }

                                    
                                    
                    QN =case_qn_move[0];
                    dynamo_db.attributes['QN'] =case_qn_move[0];
                    dynamo_db.attributes['QuerryLoad_Possible']=1;
                 }
                 else
                 {
                     //그대로 알렉사 진행
                                var losepercent_split = dynamo_db.attributes['alexa_lost_percentage'].split(`/`);
                                var losepercent;
                                losepercent = parseInt(losepercent_split[0],10);
                                var mytemp=` `;
                              
                                    
                                    for(var i =1 ; i<losepercent_split.length;i++)
                                    {
                                        if(i+1==losepercent_split.length)
                                        {
                                            mytemp =
                                            mytemp.concat(losepercent_split[i]);
                                        }
                                        else
                                        {
                                            mytemp =
                                            mytemp.concat(losepercent_split[i]+`/`);
                                        }
                                    }
                                //!@#
                                if(losepercent_split.length>1)dynamo_db.attributes['alexa_lost_percentage'] = mytemp;
                              
                                
                                var Random_Number=(Math.floor(Math.random() * 100));  
                                if(Random_Number<losepercent)
                                {
                                    //console.log(`알렉사가 지는확률걸림 알렉사의실수피드백`);
                                    //질경우임 losepercent가 80일때 Random_Number가 80보다 작게 나올경우에만
                                    //지는피드백을 붙여주고 니턴이라고 하고 보내자
                                    alexa_speech=alexa_speech.concat(` `+dynamo_db.attributes['alexa_cannotremember_say']+` `);
                                    //alexa_speech = alexa_speech.concat(dynamo_db.attributes['alexa_cannotremember_say']);
                                    dynamo_db.attributes['alexa_speech'] = dynamo_db.attributes['alexa_speech'].concat(` `+dynamo_db.attributes['alexa_cannotremember_say']+` `);
                                }
                                else
                                {
                                    //console.log(`알렉사가 제대로하는확률걸림 알렉사의 제대로피드백`);
                                    //이길경우 알렉사가 제대로말함
                                    //랜덤체크중에 하나를 랜덤으로 뽑아내자
                                    dynamo_db.attributes['S_A_point']++;
                                    while(1)
                                    {
                                        Random_Number =  (Math.floor(Math.random() * dynamo_db.attributes['S_sentences_count']));   
                                        if(dynamo_db.attributes['S_sentences_check'][Random_Number] ==0 && Random_Number<30) break;
                                    }
                                     alexa_speech=alexa_speech.concat(` `+dynamo_db.attributes['question']+` `);
                                    alexa_speech = alexa_speech.concat(` `+dynamo_db.attributes['S_sentences'][Random_Number][0]);
                                    dynamo_db.attributes['alexa_speech'] = dynamo_db.attributes['alexa_speech'].concat(` `+dynamo_db.attributes['S_sentences'][Random_Number][0]);
                                    dynamo_db.attributes['S_sentences_check'][Random_Number]=1;
                                }
                 }
                  // Answer 중
                 return 1;
            }
            else if(type=='M')
            {
                console.log(`student speak!:`,speak);
               // console.log(`case_qn_move:`,case_qn_move);
                
                
                if(dynamo_db.attributes['M_student_should_say']>1)
                {
                    console.log(`순서에 맞게 말해야함 MT에서`);
                   // console.log(`dynamo_db.attributes['M_studentpass_index']`,dynamo_db.attributes['M_studentpass_index']);
                //    console.log(`dynamo_db.attributes['Order_total_word'] [dynamo_db.attributes['M_studentpass_index']]`,dynamo_db.attributes['Order_total_word'] [dynamo_db.attributes['M_studentpass_index']]);
                
                    if(dynamo_db.attributes['Order_total_word'][dynamo_db.attributes['M_studentpass_index']] == speak)
                    {
                        console.log(`순서가 맞`);
                        //통과 순서에 맞음
                        dynamo_db.attributes['M_student_should_say']--;
                        //dynamo_db.attributes['alexa_speech'] = `say next!`;
                        dynamo_db.attributes['alexa_speech'] = ` `;
                        //alexa_speech = `say next!`;
                        alexa_speech=` `;
                        dynamo_db.attributes['M_studentpass_index']++;
                        dynamo_db.attributes['QuerryLoad_Possible']=0;
                        dynamo_db.attributes['M_onlyding'] = 1;
                        
                    }
                    else //순서가 틀림
                    {
                        console.log(`순서가 틀`);
                        QN =case_qn_move[0];
                        dynamo_db.attributes['QN'] =case_qn_move[0];
                        dynamo_db.attributes['M_student_should_say']=-500;
                        dynamo_db.attributes['QuerryLoad_Possible']=1;
                        alexa_speech = ``;
                        alexa_speech = alexa_speech.concat(` Oops... The correct order was `);
                        for(var i = 0 ; i<dynamo_db.attributes['M_wordcount'] ; i++)
                        {
                            alexa_speech = alexa_speech.concat(dynamo_db.attributes['Order_total_word'][i]+` /%wait_3/ `);
                        }
                        alexa_speech = alexa_speech.concat(` but you said `);
                         for(var i = 0 ; i<dynamo_db.attributes['M_studentpass_index'] ; i++)
                         {
                             alexa_speech = alexa_speech.concat(dynamo_db.attributes['Order_total_word'][i]+` /%wait_3/`);
                         }
                         alexa_speech = alexa_speech.concat(speak+`. `);
                         alexa_speech = alexa_speech.concat(case_feedback[0]);
                        //원래 순서 읽어주고
                        //내가 읽은 순서 읽어줘서 납득시켜야함
                        //쿼리로드파시블 1
                        //MT 종료
                    }
                }
                else//dynamo_db.attributes['M_student_should_say']==0 인경우
                {
                    console.log(`새로운걸 말해야함 MT에서`);
                    //새로운걸 말해야함
                    var isok=0;
                    for( var i = 0 ; i<dynamo_db.attributes['M_worddb_array'].length ; i++)
                    {
                        if(dynamo_db.attributes['M_worddb_array'][i]==speak)
                        {
                            if(dynamo_db.attributes['M_worddb_array_check'][i]==0)
                            {
                                //단어db에 있고 중복아님 학생이 새로운단어를 제대로 말해부림
                                console.log(`단어 db에있고 중복아님 통과! mt`);
                                isok=1;
                                dynamo_db.attributes['M_worddb_array_check'][i]=1;
                                dynamo_db.attributes['Order_total_word'][dynamo_db.attributes['M_wordcount']] = speak;
                                dynamo_db.attributes['QuerryLoad_Possible']=0;
                                
                                //alexa_speech = `i should say new things!`;
                                alexa_speech=``; 
                                 
                                dynamo_db.attributes['M_wordcount'] = dynamo_db.attributes['M_wordcount']+1 ;
                                dynamo_db.attributes['M_onlyding'] = 0;
                                ///////////////////////////////////////내가 말한걸 새롭게 저장해줌//////////////////////////
                                //
                                alexa_speech = alexa_speech.concat(dynamo_db.attributes['question']+` `);
                                for(var i = 0 ; i <dynamo_db.attributes['M_wordcount'] ; i++)
                                {
                                    alexa_speech = alexa_speech.concat(dynamo_db.attributes['Order_total_word'][i]+`/%wait_3/ `);
                                }
                                
                                //////////////////////////////알렉사가 질 확률을 만들어서 지거나 이김 아래서///////////////////
                                ////확률어딨나 찾아라
                                console.log(`바꾸기전 확률모임:`,dynamo_db.attributes['alexa_lost_percentage']);
                                var lost_percentage;
                                var alexa_lost_split =dynamo_db.attributes['alexa_lost_percentage'].split(`/`);
                                var new_alexa_lost_percentage=``;
                                if(alexa_lost_split.length ==1)
                                {
                                    console.log(`질확률:`,alexa_lost_split[0]);
                                    lost_percentage = alexa_lost_split[0];
                                }
                                else
                                {
                                    console.log(`질확률:`,alexa_lost_split[0]);
                                    lost_percentage = alexa_lost_split[0];
                                    for(var i = 1 ; i <alexa_lost_split.length ; i++)
                                    {
                                        if(i+1==alexa_lost_split.length)
                                        {
                                            new_alexa_lost_percentage = new_alexa_lost_percentage.concat(alexa_lost_split[i]);
                                        }
                                        else
                                        {
                                            new_alexa_lost_percentage = new_alexa_lost_percentage.concat(alexa_lost_split[i]+`/`);
                                        }
                                        
                                    }
                                    dynamo_db.attributes['alexa_lost_percentage'] = new_alexa_lost_percentage;
                                    
                                }
                                console.log(`바꾼후 확률모임:`,dynamo_db.attributes['alexa_lost_percentage']);
                                var alexa_lost_random=(Math.floor(Math.random() * 100));
                                ///////////////////////////////확률을 내가정한 확률과 비교해봄/////////////////////////
                                if(alexa_lost_split[0]>alexa_lost_random)
                                {
                                    console.log(`알렉사질확률`,alexa_lost_split[0],`랜덤뽑은수`,alexa_lost_random);
                                    console.log(`져야함 알렉사가`);
                                    alexa_speech =` `;
                                    //dynamo_db.attributes['M_wordcount']
                                    alexa_lost_random=(Math.floor(Math.random() * dynamo_db.attributes['M_wordcount']))+1;
                                    console.log(`틀리기전 말할 단어개수:`,alexa_lost_random);
                                    for(var i = 0 ; i<alexa_lost_random ; i++)
                                    {
                                        alexa_speech = alexa_speech.concat(dynamo_db.attributes['Order_total_word'][i]+`/%wait_3/ `);
                                    }
                                    alexa_speech = alexa_speech.concat(fail_feedback);
                                    ///////////////
                                    //짐
                                    QN =case_qn_move[0];
                                    dynamo_db.attributes['QN'] =case_qn_move[0];
                                    dynamo_db.attributes['QuerryLoad_Possible']=1;
                                }
                                else
                                {
                                    console.log(`알렉사질확률`,alexa_lost_split[0],`랜덤뽑은수`,alexa_lost_random);
                                    console.log(`이겨야함 알렉사가`);
                                     var Random_Number;
                                
                                    for(var i = 0 ;  ;i++)
                                    {
                                        Random_Number=(Math.floor(Math.random() * dynamo_db.attributes['M_worddb_array'].length)); 
                                        if(dynamo_db.attributes['M_worddb_array_check'][Random_Number]==0) break;
                                    }
                                    
                                    dynamo_db.attributes['Order_total_word'][dynamo_db.attributes['M_wordcount']] = dynamo_db.attributes['M_worddb_array'][Random_Number];
                                    dynamo_db.attributes['M_wordcount'] = dynamo_db.attributes['M_wordcount']+1 ;
                                    dynamo_db.attributes['M_student_should_say'] = dynamo_db.attributes['M_wordcount']+1;
                                    
                                    
                                    alexa_speech = alexa_speech.concat(dynamo_db.attributes['M_worddb_array'][Random_Number]+`/%wait_3/ `);
                                    dynamo_db.attributes['M_studentpass_index'] = 0 ; //내 검사index초기화
                                    
                                    //제대로 통과
                                
                                }
                                break;
                            }
                            else
                            {
                                //단어db에 있지만 중복임
                                console.log(`단어 db에 있지만 중복 mt`);
                                isok=2;
                                QN =case_qn_move[0];
                                dynamo_db.attributes['QN'] =case_qn_move[0];
                                dynamo_db.attributes['QuerryLoad_Possible']=1;
                                alexa_speech = ``;
                                dynamo_db.attributes['M_student_should_say']=-500;
                                
                                //correct order was [  원래 순서 읽어주고]
                                // but you said that [ 내가 읽은 순서 읽어줘서 납득시키자]
                              
                                alexa_speech = alexa_speech.concat(` Oops... you said `);
                                 for(var i = 0 ; i<dynamo_db.attributes['M_studentpass_index'] ; i++)
                                 {
                                     alexa_speech = alexa_speech.concat(dynamo_db.attributes['Order_total_word'][i]+` /%wait_3/`);
                                 }
                                 alexa_speech = alexa_speech.concat(speak+`/%wait_3/ `);
                                alexa_speech = alexa_speech.concat(case_feedback[1]);
                                //쿼리로드파시블 1
                                //MT 종료
                                break;
                            }
                        }
                    }
                    if(isok==0)
                    {
                        console.log(`단어 db에 없는걸말함 `);
                        //db에 없는걸 말함
                        dynamo_db.attributes['QN'] =case_qn_move[0];
                        QN =case_qn_move[0];
                        dynamo_db.attributes['QuerryLoad_Possible']=1;
                        alexa_speech = ``;
                        dynamo_db.attributes['M_student_should_say']=-500;
                        alexa_speech = alexa_speech.concat(` Oops... You said `+speak+`/%wait_3/ `);
                        alexa_speech = alexa_speech.concat(reask_left_feedback);
    
                        //쿼리로드파시블 1
                        //MT 종료
                    }


                    
                }
                //dynamo_db.attributes['M_studentpass_index']
                
                return 1;
            }
            else if(type=='C')// choose_case_num확인필요
            {
                //여기 오기전에 애초에 worddb를 쿼리해와야할듯
                // C타입 Answer의경우
                
                alexa_speech=``;
                var isjungdab=1;
                var tmpmyspeak = speak.split(` `);
                var tmpmyspeak_index=0;
                //
                for(var case_count = 0 ; case_count<case_array.length ; case_count++)
                {
                    for(var i=0; i <case_array[case_count].length ; i++)
                    {
                        tmpmyspeak_index=0;
                        isjungdab=1;
                        console.log(`조사한다:`,case_array[case_count][i]);
                        var tmpjungdabspeak = case_array[case_count][i].split(` `);
                        //내가한말 i love you    tmpmyspeak에 쪼개서 있음
                        //정답인경우 i am happy  tmpjungdabspeak에 있음
                        for(var k = 0  ; k<tmpjungdabspeak.length ; k++)
                        {
                            if(tmpjungdabspeak[k] == tmpmyspeak[tmpmyspeak_index])
                            {
                                if(tmpmyspeak_index < tmpmyspeak.length) 
                                {
                                    tmpmyspeak_index++;
                                }
                                else
                                {
                                    console.log(`내 발화길이가 다름`);
                                    isjungdab=0;
                                    break;
                                }
                            }
                            else
                            {
                                //
                                // #db#인경우 여기서 연산해야함  C_table_name_Array[x] 와 일치하면
                                //C_table_value_Array[x][0~length-1] 까지 조사해야함
                                //tmpmyspeak_index가 유연하게 늘었다 줄었다 해야함;
                                if(tmpjungdabspeak[k][0]=='#')
                                {
                                    console.log(`여기서 해당DB의 단어들과 tmpmyspeak를 비교해야함`,tmpjungdabspeak[k].substring(1,tmpjungdabspeak[k].length-1));//sentence
                                    for(var p = 0 ; p<C_table_name_array.length ; p++)
                                    {
                                        var tmpjungdab;
                                        if(C_table_name_array[p]==tmpjungdabspeak[k].substring(1,tmpjungdabspeak[k].length-1)) //sentence 나옴
                                        {
                                            tmpjungdab=1;
                                            for(var u = 0 ; u<C_table_value_array[p].length ; u++)
                                            {
                                                var tmpctva = C_table_value_array[p][u].split(` `);
                                                tmpjungdab=1;
                                                var tmpindex=0;
                                                var y;
                                                if(tmpmyspeak[tmpmyspeak_index+tmpindex] )
                                                {
                                                    console.log(`내가 한말에 대해 특히:`,tmpmyspeak[tmpmyspeak_index+tmpindex],`부분을 조사`);//
                                                    for( y = 0 ; y<tmpctva.length ;y++)
                                                    {
                                                        console.log(`tmpctva[`,y,`]조사:`,tmpctva[y]);
                                                        console.log(`tmpmyspeak[tmpmyspeak_index+tmpindex]랑비교:`,tmpmyspeak[tmpmyspeak_index+tmpindex]);
                                                        if( tmpctva[y] == tmpmyspeak[tmpmyspeak_index+tmpindex]  ) //여긴 table : i love  이런게 들어있음  
                                                        {
                                                            tmpindex++;
                                                        }
                                                        else
                                                        {
                                                           tmpjungdab=0; 
                                                            break;
                                                        }
                                                        
                                                    }
                                                    if(tmpjungdab==1)
                                                    {
                                                        tmpmyspeak_index = tmpmyspeak_index+tmpindex;
                                                        break;
                                                    }
                                                }
                                                else
                                                {
                                                     console.log(`tmpmyspeak[tmpmyspeak_index+tmpindex]랑비교:`,tmpmyspeak[tmpmyspeak_index+tmpindex]);
                                                    tmpjungdab=0;
                                                    isjungdab=0;
                                                    console.log(`undefine 이라 조사못함`);
                                                    break;
                                                }
                                                //if(C_table_value_array[p][u]) 해당값을 쪼개야함 
                                            }
                                            
                                            if(tmpjungdab==1)
                                            {
                                                break;
                                            }
                                             else
                                            {
                                                isjungdab=0;
                                                console.log(`@@@오답일경우 나가자?`);
                                                break;//오답일경우 나가자? (뒑)
                                            }
                                        }
                                    }
                                     if(isjungdab==0)
                                    {
                                        console.log(`@@@뒑에서 이어지는경우 break해봄`);
                                        break;
                                    }
                                    if(tmpmyspeak.length <tmpmyspeak_index)
                                    {
                                        console.log(`길이문제로 오답입네당`);
                                        isjungdab=0;
                                        break;
                                    }
                                    /////////////////하;; 미친다
                                    
                                    //다시저장하고 이거 직어봐야할것                             
                                }
                                else
                                {
                                    isjungdab=0;
                                    break;
                                }
                            }
                            
                            
                        }
                        console.log("#tmpspeak.length:",tmpmyspeak.length,`tmpspeak_index:`,tmpmyspeak_index);
                        if(tmpmyspeak.length != tmpmyspeak_index)
                        {
                            console.log( `내 발화랑 길이가 다르므로 오답`);
                            isjungdab=0; 
                        }
                        if(isjungdab==1)
                        {
                            //console.log(`tmpmyspeak.length`,tmpmyspeak.length);
                            //console.log(`tmpmyspeak_index`,tmpmyspeak_index);
                            choose_case_num = case_count+2;
                            if(case_qn_move[case_count]!= -7777)
                            {
                                QN=case_qn_move[case_count];
                               
                            }
                            else
                            {
                                
                            }
                             if(case_feedback[case_count])alexa_speech = case_feedback[case_count];
                                alexa_speech=alexa_speech.concat(` `);
                            //case_array[case_count]
                            //정답이므로 더이상 case조사가 필요없음
                            break;
                        }
                        
                    
                    }
                    if(isjungdab==1)
                    {
                        //정답이므로 더이상 case조사가 필요없음
                        break;
                    }
                    else if(isjungdab==-7777)
                    {
                        break;
                    }
                    
                }
                
                if(isjungdab==1)
                {
                    //쿼리로드파시블 1로 바꿔주고 next qn으로 이동
                    console.log(`#########C타입정답`);
                    dynamo_db.attributes['QuerryLoad_Possible']=1;
                    
                }
                else if(isjungdab==-7777)
                {
                    console.log(`########무한반복`);
                   
                }
                else
                {
                    //오답 qn이로 이동
                    
                    console.log(`########C타입오답`);
                     if(dynamo_db.attributes['reask_chance']>0)
                    {
                        //if(choose_case_num==-1000) choose_case_num = 0;
                        dynamo_db.attributes['reask_chance']--;
                        if(reask_left_feedback)alexa_speech= reask_left_feedback;
                        else alexa_speech=``;
                        alexa_speech= alexa_speech.concat(` `);
                        
                    }
                    else
                    {
                        choose_case_num=1;
                        if(fail_feedback)alexa_speech=fail_feedback;
                        else alexa_speech=``;
                        alexa_speech= alexa_speech.concat(` `);
                        dynamo_db.attributes['QuerryLoad_Possible']=1;
                  
                        QN=reask_qn_move;
                    }
                }
                
                return 1;
            }
            else if(type=='G' ||type=='D') // choose_case_num확인필요
            {
                var savedata=``;
                var tablename;
                var isjungdab=0;
                var tmpmyspeak_index;
                var tmpmyspeak = speak.split(` `);
                if(Array.isArray(case_array))
                {//배열일경우에만
                    for(var i = 0 ; i<case_array.length; i++)
                    {
                         isjungdab=0;
                        // tmpmyspeak_index=0;
                        for(var j = 0 ; j<case_array[i].length ; j++)
                        {
                            tmpmyspeak_index=0;
                            console.log(`검사:`,case_array[i][j]);
                            var tmpjungdab = case_array[i][j].split(` `);
                            for(var k = 0 ; k<tmpjungdab.length ; k++)
                            {
                                
                                if(tmpjungdab[k][0]=='#')
                                {
                                    tablename =tmpjungdab[k];
                                    //tmpmyspeak 뒤를 다 이어붙여서 정답임
                                    while(1)
                                    {
                                        if(tmpmyspeak.length >tmpmyspeak_index+1)
                                        {
    
                                            savedata = savedata.concat(tmpmyspeak[tmpmyspeak_index]+` `);
                                            tmpmyspeak_index++;
                                        }
                                        else if(tmpmyspeak.length >tmpmyspeak_index)
                                        {
                                            savedata = savedata.concat(tmpmyspeak[tmpmyspeak_index]);
                                            break;
                                        }
                                        else
                                        {
                                            break;
                                        }
                                    }
                                    console.log(`savedata:`,savedata);
                                    if(case_qn_move[i]!=-7777)
                                    {
                                        isjungdab=1;
                                        
                                        
                                        
                                  
                                        QN =case_qn_move[i];
                                       
                                      dynamo_db.attributes['QuerryLoad_Possible']=1;
                                        //QuerryLoad_Possible=1;
                                    }
                                    else
                                    {
                                        isjungdab=-7777;
                                    }
                                          alexa_speech = case_feedback[i];
                                        alexa_speech= alexa_speech.concat(` `);
                                        choose_case_num=i+2;
                                        
                                    break;
                                }
                                else//
                                {
                                    if( k+1 ==tmpjungdab.length && tmpjungdab[k]==tmpmyspeak[tmpmyspeak_index] && speak.length ==case_array[i][j].length)
                                    {//tmpjungdab은 정답case를 단어별로 쪼갠거에요   tmpmyspeak는 내가 말한걸가따가 쪼갠거고
                                        console.log(`k:`,k,`tmpmyspeak_index:`,tmpmyspeak_index);
                                        console.log(`tmpjungdab[k]:`,tmpjungdab[k],`tmpmyspeak[tmpmyspeak_index]:`,tmpmyspeak[tmpmyspeak_index]);
                                        console.log(`문자열비교:`,speak.length,case_array[i][j].length);
                                        isjungdab=2;
                                        //choose_case_num=i;
                                        if(case_qn_move[i]!=-7777)
                                        {
                                          
                                            QN =case_qn_move[i];
                                            dynamo_db.attributes['QuerryLoad_Possible']=1;
                                        }
                                        else
                                        {
                                            isjungdab=-7777;
                                        }
                                          alexa_speech = case_feedback[i];
                                            alexa_speech= alexa_speech.concat(` `);
                                            choose_case_num=i+2;
                                        break;
                                    }
                                    else if(tmpjungdab[k]==tmpmyspeak[tmpmyspeak_index])
                                    {
                                        tmpmyspeak_index++;
                                        //일단 통과상태 다음단어 검사
                                    }
                                    
                                    else
                                    {
                                        console.log(`k:`,k,`tmpmyspeak_index:`,tmpmyspeak_index);
                                        console.log(`tmpjungdab[k]:`,tmpjungdab[k],`tmpmyspeak[tmpmyspeak_index]:`,tmpmyspeak[tmpmyspeak_index]);
                                        console.log(`문자열비교:`,speak.length,case_array[i][j].length);
                                        console.log(case_array[i][j],`는 정답case가 아님`);
                                        break;
                                    }
                                    
                                }
                            }
                            if(isjungdab==1 || isjungdab==2 || isjungdab==-7777)
                            {
                                break;
                            }
                            
                        }
                        if(isjungdab==1 || isjungdab==2 || isjungdab==-7777)
                        {
                            if(type=='D') D_isgetpoint=1;
                            break;
                        }
                        
                        
                    }
                }
                if(isjungdab==1) //저장하는경우
                {
                    //무조건 정답
                    tablename = tablename.substring(1,tablename.length-1);
                    //tablename 컬럼에다가 savedata 을 update 할것!
                    //console.log(`지워라 여기 tablename:`,tablename,`savedata`,savedata);
                    
                    //tablename 에 savedata를 dynamodb쓰자
                    dynamo_db.attributes[tablename] = savedata;
//                    sql = `update fin_skill_student_info set `+tablename+`="`+savedata+`" where oauth_id ="`+oauth_user_id+`";`;
 //                   console.log(`sql:`,sql);
  //                  return connection.query(sql);
                }
                else if(isjungdab==-7777)
                {
                    return 3;
                }
                else if(isjungdab==2)
                {
                    return 2;
                }
                else //이동하는경우
                {
                    if(dynamo_db.attributes['reask_chance']>0)
                    {
                       // if(choose_case_num==-1000) choose_case_num=0;
                        dynamo_db.attributes['reask_chance']--;
                        if(reask_left_feedback)alexa_speech= reask_left_feedback;
                        else alexa_speech = ``;
                        alexa_speech= alexa_speech.concat(` `);
                        
                    }
                    else
                    {
                        choose_case_num=1;
                        if(fail_feedback)alexa_speech=fail_feedback;
                        else alexa_speech=``;
                        alexa_speech= alexa_speech.concat(` `);
                        dynamo_db.attributes['QuerryLoad_Possible']=1;
                        
                        QN=reask_qn_move;
                    }
                    return 3;
                }

            }//G 타입의 경우
            else
            {
                return -1;
            }
        }).then(function(results){ 
            
            if(results==-1)
            {
                return -1;//this.emit(':tell',`Error! can not load type!`);
            }
            else
            {
                if(dynamo_db.attributes['QuerryLoad_Possible']==1) //이동하는경우에만!
                {
                    
                    
                    
                    dynamo_db.attributes['read_number']=0;
                    if(dynamo_db.attributes['is_set']=='N')
                    {
                        console.log(`set가 원래부터 아닙니다`);
                        dynamo_db.attributes['QN']=QN;
                        dynamo_db.attributes['alexa_speech']=alexa_speech;
                       // alexa_speech=set_alexa_speech(alexa_speech,0,dynamo_db);
                    }
                    else//이동하는데 셋트야 Answer부분
                    {
                        console.log(`D타입 얻을수 있었던  점수:`,D_q_per_point);
                        console.log(`얻기전 점수:`,dynamo_db.attributes['D_student_grade']);
                        if(D_isgetpoint==1)
                        {
                            dynamo_db.attributes['D_student_grade'] = dynamo_db.attributes['D_student_grade']+D_q_per_point;
                            if(dynamo_db.attributes['D_student_grade']==1)
                            alexa_speech = alexa_speech.concat(`you have 1 point total. `);
                            else
                            alexa_speech = alexa_speech.concat(`you have `+dynamo_db.attributes['D_student_grade']+`points total. `);
                            
                        }
                        console.log(`얻고난 후 점수:`,dynamo_db.attributes['D_student_grade']);
                        
                        console.log(`Answer에서 셋트인경우에 들어옴`);
                           
                            var db_decided_order_set=dynamo_db.attributes['db_decided_order_set'];
                            if(db_decided_order_set[0] ==' ' && db_decided_order_set.length ==1)
                            {
                                if(type=='D')
                                {
                                    if(dynamo_db.attributes['D_student_grade']>=dynamo_db.attributes['D_pass_grade'])
                                    {
                                        alexa_speech=alexa_speech.concat(` `+dynamo_db.attributes['D_final_ok_pass']+` `);
                                        //마지막문제를 맞춰서 간신히 통과하는경우고
                                    }
                                    else if(dynamo_db.attributes['D_student_grade']<dynamo_db.attributes['D_pass_grade'])
                                    {
                                        if(D_isgetpoint==1) 
                                        {
                                            alexa_speech=alexa_speech.concat(` `+dynamo_db.attributes['D_final_ok_fail']+` `);
                                        }
                                        else
                                        {
                                            alexa_speech = dynamo_db.attributes['D_final_no_fail'];
                                        }
                                        
                                    }
                                }
                                console.log(`다음셋트가 없음 set 빠져나오기`);
                                dynamo_db.attributes['db_decided_order_set']=` `;
                                dynamo_db.attributes['is_set'] = 'N';
                                dynamo_db.attributes['set_start'] = 0;
                                dynamo_db.attributes['QN']=QN;
                                dynamo_db.attributes['alexa_speech']=alexa_speech;
                            //    alexa_speech=set_alexa_speech(alexa_speech,0,dynamo_db);
                               
                               
                               
                               
                            }
                            else
                            {
                                var setqn = db_decided_order_set.split(`/`);
                                console.log(`setqn 값 봅니다.:`,setqn);
                                var tQN= parseInt(setqn[0],10); 
                                console.log(`이동할 tQN:`,tQN);
                                var new_db_decided_order_set=` `;
                                //
                                if(setqn.length>0) //아직도 남은경우
                                {
                                    for(var i =1 ; i<setqn.length ; i++)
                                    {
                                        if(i+1!=setqn.length)new_db_decided_order_set = new_db_decided_order_set.concat(setqn[i]+`/`);
                                        else new_db_decided_order_set = new_db_decided_order_set.concat(setqn[i]);
                                    }
                                    dynamo_db.attributes['db_decided_order_set'] = new_db_decided_order_set;
                                    
                                    dynamo_db.attributes['QN']=tQN;
                                    dynamo_db.attributes['alexa_speech']=alexa_speech;
                                //    alexa_speech=set_alexa_speech(alexa_speech,0,dynamo_db);
                                }
                                else //그냥 끝임
                                {
                                    console.log(`그냥끝임`);
                                  
                                }
                                
                                if(type=='D')
                                {
                                    console.log(`중간에 빠져나갈수있다! D타입 셋트!`);
                                    if(dynamo_db.attributes['D_student_grade']>=dynamo_db.attributes['D_pass_grade'])
                                    {
                                        alexa_speech=alexa_speech.concat(` `+dynamo_db.attributes['D_final_ok_pass']+` `);
                                        QN = case_qn_move[0];
                                        dynamo_db.attributes['QN']=QN;
                                        dynamo_db.attributes['alexa_speech']=alexa_speech;
                                    }
                                }
                                
                            }
                    }
                }//이동하는경우
                else
                {
                    
                    dynamo_db.attributes['alexa_speech']=alexa_speech;
                   // alexa_speech=set_alexa_speech(alexa_speech,0,dynamo_db);
                }//이동 안하는경우
                //this.emit(':tell',`succeed`);
                
                
                
                //
                if(type=='C'|| type=='G' )
                {
                   // console.log(`C타입 G타입의 경우 지금 answer 프로시저 수정중입니다!#####################################`);
                   
                    sql=`call final_skill_answer("`+dynamo_db.attributes['oauth_user_id']+`","`+location+`","`+type+`","`+before_QN+`","`+speak+`","`+log_alexa_speech+`","`
                    +choose_case_num+`","`+dynamo_db.attributes['analysis_flag']+`");`;
                    return connection.query(sql);//question 호출
                    
                }
                else
                {
                    sql=`call final_skill_answer("`+dynamo_db.attributes['oauth_user_id']+`","`+location+`","`+type+`","`+before_QN+`","`+speak+`","`+log_alexa_speech+`","`
                    +(-7777)+`","`+dynamo_db.attributes['analysis_flag']+`");`;
                    
                    
                    return connection.query(sql);//question 호출
                    
                }
            }
            
        }).then(function(results){ 
            connection.end();
            if(results==-1)
            {
                this.emit(':tell',`Error! can not load type!`);
            }
            else
            {
                
                this.emit('Question');
            }
            
            
        }.bind(this));
    },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
     'Poly': function () {
        var matchcommand = this.event.request.intent.slots.command.resolutions.resolutionsPerAuthority[0].status.code;
        //if(matchcommand == 'ER_SUCCESS_MATCH')
        //var command = this.event.request.intent.slots.command.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        // command 안에는 cheat
        var realcommand = this.event.request.intent.slots.command.value;
        var command;
        if(matchcommand == 'ER_SUCCESS_MATCH')
        {
            command= this.event.request.intent.slots.command.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }
        else
        {
            command=` `;
        }
        // realcommand 안에는 move question   이나 question 등등
        var num = this.event.request.intent.slots.num.value;
        var sql;
        var connection;
        var speak = `**poly** `;
        var dynamo_db = this;
        if(realcommand) speak = speak.concat(realcommand+` `);
        if(num){ speak = speak.concat(num); num=parseInt(num,10);}
        
        mysql.createConnection(config).then(function(conn){
            console.log(`*************************************************************************`);
            console.log(`***student say:`,speak,`***`);
            console.log(`*************************************************************************`);
            ///무조건 로그는 남김
             var sql=`call final_skill_poly("`+dynamo_db.attributes['oauth_user_id']+`","`+dynamo_db.attributes['location']
             +`","`+dynamo_db.attributes['type']+`","`+dynamo_db.attributes['QN']+`","`+speak+`","`+dynamo_db.attributes['alexa_speech']+`");`;
            console.log(`sql:`,sql);
            connection = conn;
            return conn.query(sql);
        }).then(function(results){ 
            if(matchcommand == 'ER_SUCCESS_MATCH')
            {
               
                 if(command =='slow')
                 {
                    
                     dynamo_db.attributes['alexa_speech']=`OK I'll speak a bit slower. `;
                       if (dynamo_db.attributes['Speed_S'] == ` <prosody rate='medium'> `)
                       {
                        dynamo_db.attributes['Speed_S'] = ` <prosody rate='slow'> `;
                        } 
                        else if (dynamo_db.attributes['Speed_S'] == ` <prosody rate='slow'> `)
                        {
                            dynamo_db.attributes['Speed_S'] = ` <prosody rate='x-slow'> `;
                        } 
                        else if (dynamo_db.attributes['Speed_S'] == ` <prosody rate='fast'> `)
                        {
                            dynamo_db.attributes['Speed_S'] = ` <prosody rate='medium'> `;
                        }
                        else if (dynamo_db.attributes['Speed_S'] == ` <prosody rate='x-fast'> `)
                        {
                            dynamo_db.attributes['Speed_S'] = ` <prosody rate='fast'> `;
                        }
                        else
                        {
                            dynamo_db.attributes['alexa_speech']=`I can't do that. this is the slowest I can speak. `;
                        }
                        if(dynamo_db.attributes['type']=='M') dynamo_db.attributes['M_polyrepeat'] = 1;
                        return 1;
                 }
                 else if(command =='fast')
                 {
                     console.log(`dynamo_db.attributes['Speed_S']:`,dynamo_db.attributes['Speed_S']);
                     dynamo_db.attributes['alexa_speech']=`OK I'll speak a bit faster. `;
                        if (dynamo_db.attributes['Speed_S'] == ` <prosody rate='medium'> `)
                        {
                            dynamo_db.attributes['Speed_S'] = ` <prosody rate='fast'> `;
                        }
                        else if (dynamo_db.attributes['Speed_S'] == ` <prosody rate='fast'> `) 
                        {
                            dynamo_db.attributes['Speed_S'] = ` <prosody rate='x-fast'> `;
                        } 
                        else if (dynamo_db.attributes['Speed_S'] == ` <prosody rate='x-slow'> `)
                        {
                            dynamo_db.attributes['Speed_S'] = ` <prosody rate='slow'> `;
                        } 
                        else if (dynamo_db.attributes['Speed_S'] == ` <prosody rate='slow'> `) 
                        {
                            dynamo_db.attributes['Speed_S'] = ` <prosody rate='medium'> `;
                        }
                        else
                        {
                            dynamo_db.attributes['alexa_speech']=`I can't do that. this is the fastest I can speak. `;
                        }
                    if(dynamo_db.attributes['type']=='M') dynamo_db.attributes['M_polyrepeat'] = 1;
                    return 1;
                 }
                 else if(command =='cheat')
                 {
                     var valid_ok=valid_test(dynamo_db);

                     if(valid_ok==1)
                     {
                          sql =`SELECT stype FROM EDUAI.final_skill_direction where QN = "`+num+`" and location ="`+dynamo_db.attributes['location']+`"`;
                        //SELECT type FROM EDUAI.new_skill_script where QN = 101 and location = "swb01u02p14";
                          return connection.query(sql);
                     }
                     else
                     {
                         return -5555;
                     }
                 }
                 else if(command =='go to activity')
                 {
                      var valid_ok=valid_test(dynamo_db);
                     
                     if(valid_ok==1)
                     {
                         sql =`SELECT qn FROM EDUAI.final_skill_direction where activity=`+num+` and location = '`+dynamo_db.attributes['location']+`' order by qn limit 1;`;
                         return connection.query(sql);
                     }
                     else
                     {
                         return -5555;
                     }
                 }
                 else if(command == 'go to period')
                 {
                       var valid_ok=valid_test(dynamo_db);
                     
                     if(valid_ok==1)
                     {
                         //sw01_u02_p02
                         var location = dynamo_db.attributes['location'];
                         var bookname = location.substring(0,2); //sw
                        
                         //console.log(`북네임확인:`,bookname);
                         if(bookname =='sw')
                         {
                             var booknum  = location.substring(2,4); //01
                             var unitnum = location.substring(6,8);//02
                             //var periodnum = location.substring(10,12); //02
                             var newperiodnum;
                             var newlocation=`sw`+booknum+`_u`+unitnum+`_p`;
                             //console.log(`확인`,booknum);
                             //console.log(`확인`,unitnum);
                             //console.log(`확인`,periodnum);
                             if(num<10)
                             {
                                 newperiodnum=`0`+num;
                                 newlocation = newlocation.concat(newperiodnum);
                                 //console.log(`new-p-num확인`,newperiodnum);
                             }
                             else
                             {
                                 newperiodnum=num;
                                 newlocation = newlocation.concat(newperiodnum);
                                 //console.log(`new-p-num확인`,newperiodnum);
                             }
                             //console.log(`newlocation확인`,newlocation);
                             //SELECT qn FROM EDUAI.final_skill_direction where location ='sw01_u02_p02' order by qn asc limit 1;
                             sql= `SELECT qn,location FROM EDUAI.final_skill_direction where location ='`+newlocation+`' order by qn asc limit 1`;
                             return connection.query(sql);
                             
                         }
                         else
                         {
                             dynamo_db.attributes['alexa_speech']=`The period move command can use only at speakingwizard. `;
                             return 1;
                         }
                     }
                     else
                     {
                         return -5555;
                     }
                     
                     //sw01_u02_p02
                 }
                 
                 else if(command == 'go to unit')
                 {
                      var valid_ok=valid_test(dynamo_db);
                     
                     if(valid_ok==1)
                     {
                          var location = dynamo_db.attributes['location'];
                         var bookname = location.substring(0,2); //sw
                         if(bookname =='sw')
                         {
                          var booknum  = location.substring(2,4); //01
                             //var unitnum = location.substring(6,8);//02
                          //var periodnum = location.substring(10,12); //02
                          var newunitnum;
                          var newlocation=`sw`+booknum+`_u`;
                          if(num<10)
                             {
                                 newunitnum=`0`+num;
                                 newlocation = newlocation.concat(newunitnum);
                                 //console.log(`new-p-num확인`,newperiodnum);
                             }
                             else
                             {
                                 newunitnum=num;
                                 newlocation = newlocation.concat(newunitnum);
                                 //console.log(`new-p-num확인`,newperiodnum);
                             }
                          newlocation = newlocation.concat(`_p01`);
                            sql= `SELECT qn,location FROM EDUAI.final_skill_direction where location ='`+newlocation+`' order by qn asc limit 1`;
                             return connection.query(sql);
                         }
                         
                         else
                         {
                             dynamo_db.attributes['alexa_speech']=`The unit move command can use only at speakingwizard. `;
                             return 1;
                         }
                     }
                     else
                     {
                         return -5555;
                     }

                 }
                 else if(command =='repeat')
                 {
                     dynamo_db.attributes['alexa_speech'] = `I'll say that again! `;
                     if(dynamo_db.attributes['type']=='M') dynamo_db.attributes['M_polyrepeat'] = 1;
                    return 1;
                 }
            }
            
            else
            {
                dynamo_db.attributes['alexa_speech']=`that command does not exist! `;
                return 1;
            }
        }).then(function(results){ 
            if(matchcommand == 'ER_SUCCESS_MATCH')
            {
                
                 if(command =='slow' || command =='fast')
                 {
                    return 1;
                 }
                 else if(command =='cheat')
                 {
                    if(results=='-5555')
                    {
                       
                                dynamo_db.attributes['alexa_speech']=`You can't use this command. `;
                                return 1;
                    }
                    else
                    {
                          results=JSON.parse(JSON.stringify(results));
                   
                        results = results[0];
                        if(results)
                        {//
                            
                             
                            dynamo_db.attributes['alexa_speech'] =`cheat mode! question move succeed!`;
                            dynamo_db.attributes['QuerryLoad_Possible']=1;
                            dynamo_db.attributes['QN']=num;
                            dynamo_db.attributes['db_decided_order_set']=` `;
                            dynamo_db.attributes['set_start'] = 0;
                            dynamo_db.attributes['should_read'] = 0;
                            dynamo_db.attributes['is_set'] = 'N';
                            //db_decided_order_set
                            
                            return 1;
                             
                            
                           
                        }
                        else
                        {
                            dynamo_db.attributes['alexa_speech']=`I can't move that number!`;
                            return 1;
                        }
                    }
                    
                          
                          
                 
                    
                     
                 }
                 else if(command =='go to activity')
                 {
                      if(results=='-5555')
                    {
                       
                                dynamo_db.attributes['alexa_speech']=`You can't use this command. `;
                                return 1;
                    }
                    else{
                         results=JSON.parse(JSON.stringify(results));
                         if(results[0])
                         {
                             dynamo_db.attributes['QN']=results[0].qn;
                             dynamo_db.attributes['QuerryLoad_Possible']=1;
                            dynamo_db.attributes['db_decided_order_set']=` `;
                            dynamo_db.attributes['set_start'] = 0;
                            dynamo_db.attributes['should_read'] = 0;
                            dynamo_db.attributes['is_set'] = 'N';
                            
                            //alexa_speech에 설명 넣자
                            dynamo_db.attributes['alexa_speech']= `Activity move succeed. `;
                         }
                         else
                         {
                            dynamo_db.attributes['alexa_speech']= `that activity does not exist. `;
                         }
                         
                         
                         return 1;
                    }
                 }
                 else if(command == 'go to period')
                 {
                       if(results=='-5555')
                    {
                       
                                dynamo_db.attributes['alexa_speech']=`You can't use this command. `;
                                return 1;
                    }
                    else
                    {
                          results=JSON.parse(JSON.stringify(results));
                         if(results[0])
                         {
                             dynamo_db.attributes['location']=results[0].location;
                             dynamo_db.attributes['QN']=results[0].qn;
                             dynamo_db.attributes['QuerryLoad_Possible']=1;
                            dynamo_db.attributes['db_decided_order_set']=` `;
                            dynamo_db.attributes['set_start'] = 0;
                            dynamo_db.attributes['should_read'] = 0;
                            dynamo_db.attributes['is_set'] = 'N';
                            
                            //alexa_speech에 설명 넣자
                            dynamo_db.attributes['alexa_speech']= `Period move succeed. `;
                         }
                         else
                         {
                             dynamo_db.attributes['alexa_speech']= `that period does not exist. `;
                         }
                         
                         return 1;
                    }
                 }
                 else if(command == 'go to unit')
                 {
                        if(results=='-5555')
                    {
                       
                                dynamo_db.attributes['alexa_speech']=`You can't use this command. `;
                                return 1;
                    }else{
                        
                    
                      results=JSON.parse(JSON.stringify(results));
                     if(results[0])
                     {
                         dynamo_db.attributes['location']=results[0].location;
                         dynamo_db.attributes['QN']=results[0].qn;
                         dynamo_db.attributes['QuerryLoad_Possible']=1;
                        dynamo_db.attributes['db_decided_order_set']=` `;
                        dynamo_db.attributes['set_start'] = 0;
                        dynamo_db.attributes['should_read'] = 0;
                        dynamo_db.attributes['is_set'] = 'N';
                        
                        //alexa_speech에 설명 넣자
                        dynamo_db.attributes['alexa_speech']= `Unit move succeed. `;
                     }
                     else
                     {
                         dynamo_db.attributes['alexa_speech']= `that Unit's period one does not exist. `;
                     }
                     return 1;
                    }
                 }
                 else if(command =='repeat')
                 {
                     //dynamo_db.attributes['alexa_speech'] = `I'll say that again! `;
                    return 1;
                 }
            }
            else
            {
                return 1;
            }
            
        }).then(function(results){ 
            connection.end();
            this.emit('Question');
        }.bind(this));  
        
        
    },
  
    'AMAZON.CancelIntent': function () {
        console.log(`@@@Cancel@@@ `);
        this.attributes[`WhyTerminated`]=`#####Cancel function call######`;
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.StopIntent': function () {
      console.log(`@@@Stop@@@ `);
      console.log(`stop인텐트activity`,this.attributes['activity']);
      console.log(`stop인텐트location`,this.attributes['location']);
      console.log(`stop인텐트type`,this.attributes['type']);
      console.log(`stop인텐트qn`,this.attributes['QN']);
      console.log(`stop인텐트oauth_user_id`,this.attributes['oauth_user_id']);
      
      var dynamo_db = this;
      var WhyTerminated = dynamo_db.attributes[`WhyTerminated`];
        if(WhyTerminated[0]!='#'&&WhyTerminated[1]!='#')
        {
            WhyTerminated=`#####Stop function call######`;
        }
        var sql;
        var connection;
        var alexa_speech = dynamo_db.attributes[`alexa_speech`];
    //    alexa_speech=set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
//        console.log(`QN:`,QN);
//        console.log(`location:`,location);
        mysql.createConnection(config).then(function(conn){
            sql=`call final_skill_stop ("`+dynamo_db.attributes['oauth_user_id']+`","`+dynamo_db.attributes['location']+`","`
            +dynamo_db.attributes['type']+`","`+
            dynamo_db.attributes['QN']+`","`+
            alexa_speech+`","`+WhyTerminated+`","`+parseInt(dynamo_db.attributes['activity'],10)+`")`;
            connection = conn;
            console.log(`sql:`,sql);
            return conn.query(sql);
        }).then(function(results){ 
            connection.end();
            this.emit(':tell',`OK. I'll talk to you later. Bye.`);
        }.bind(this));     
    },
     'NewStop':function(){
        console.log(`@@@Stop@@@ `);
      console.log(`stop인텐트activity`,this.attributes['activity']);
      console.log(`stop인텐트location`,this.attributes['location']);
      console.log(`stop인텐트type`,this.attributes['type']);
      console.log(`stop인텐트qn`,this.attributes['QN']);
      console.log(`stop인텐트oauth_user_id`,this.attributes['oauth_user_id']);
      
      var dynamo_db = this;
      var WhyTerminated = dynamo_db.attributes[`WhyTerminated`];
        if(WhyTerminated[0]!='#'&&WhyTerminated[1]!='#')
        {
            WhyTerminated=`#####NewStop function call######`;
        }
        var sql;
        var connection;
        var alexa_speech = dynamo_db.attributes[`alexa_speech`];
    //    alexa_speech=set_alexa_speech(alexa_speech,dynamo_db.attributes['Speed_S'],dynamo_db);
//        console.log(`QN:`,QN);
//        console.log(`location:`,location);
        mysql.createConnection(config).then(function(conn){
            sql=`call final_skill_stop ("`+dynamo_db.attributes['oauth_user_id']+`","`+dynamo_db.attributes['location']+`","`
            +dynamo_db.attributes['type']+`","`+
            dynamo_db.attributes['QN']+`","`+
            alexa_speech+`","`+WhyTerminated+`","`+parseInt(dynamo_db.attributes['activity'],10)+`")`;
            connection = conn;
            console.log(`sql:`,sql);
            return conn.query(sql);
        }).then(function(results){ 
            connection.end();
            this.emit(':tell',`OK. I'll talk to you later. Bye.`);
        }.bind(this)); 
    },
      'Unhandled': function () {
        console.log(`@@@UnHandeld@@@ Let's call stop intent`);
        this.attributes[`WhyTerminated`]=`#####Unhandled function call######`;
  this.emit('NewStop');
    },
       'AMAZON.NavigateHomeIntent':function(){
         var dynamo_db = this;
        dynamo_db.attributes[`WhyTerminated`]=`#####NavigateHomeIntent call######`;
        this.emit('NewStop');
    },
};

function set_feedback_dbname(dbdata,feedback)
{
    console.log(`@@@ set_feedback_dbname@@@`);
    var changed_feedback=``;
    var splitfeedback=``;
    if(feedback) splitfeedback= feedback.split(`/`);
    
    for(var i = 0 ; i<splitfeedback.length;i++)
    {
        if(splitfeedback[i].substring(0,4)==`%fb_`)
        {
            ///dbdata에 맞는 name을 검사해서 랜덤으로 하나 뽀ㅃ아서 바꿔줘야함
            var finddb = splitfeedback[i].substring(4,splitfeedback[i].length);
            console.log(`finddb:`,finddb);
            var isok=0;
            
            var gatherdb =new Array();
            var gatherdbindex=0;
            
            for(var j = 0 ; j<dbdata.length ; j++)
            {
                if(finddb == dbdata[j].name)
                {
                    isok=1;
                    gatherdb[gatherdbindex] =dbdata[j].feedback;
                    gatherdbindex++;
                }
            }
            
            if(isok==1)
            {
                console.log(`@@@@@@@@@@@@@@@gatherdb 확인:`,gatherdb);
                
                var Random_Number=(Math.floor(Math.random() * gatherdb.length));  
                //gatherdb.length 만큼 random 숫자 뽑아서 gatherdb[random숫자] 를 concat
                changed_feedback = changed_feedback.concat(gatherdb[Random_Number]);
            }
            
            if(isok==0)
            {
                changed_feedback = changed_feedback.concat(`#can't find data#`);
            }
        }
        else if(splitfeedback[i].substring(0,1)==`%`||splitfeedback[i].substring(0,1)==`#`)
        {
            changed_feedback = changed_feedback.concat(`/`+splitfeedback[i]+`/`);
        }
        else
        {
            changed_feedback = changed_feedback.concat(splitfeedback[i]);
        }
    }
    return changed_feedback; 
}





function get_feedback_dbname(checkfeedback)
{
    console.log(`@@@ get_feedback_dbname @@`);
    var dbnameindex=0;
    var dbarray = new Array();
    for(var i = 0 ; i<checkfeedback.length;i++)
    {
        
       //console.log(`갈갈갈:`,checkfeedback[i].substring(0,4));
       if(checkfeedback[i].substring(0,4)== '%fb_')
       { 
           dbarray[dbnameindex] = checkfeedback[i].substring(4,checkfeedback[i].length);
           dbnameindex++;
       }
    }
    return dbarray;
}





function set_alexa_speech(speech2,originspeed,dynamo_db)
{
    console.log(`@@@ set_alexa_speech@@`);
        var state=0;
        var speech_when_state1;
        var set_new_speech=``;
        var speech;
        if(speech2) speech= speech2.split('/');
//        console.log(`speech:`,speech);
        for(var i= 0 ; i  < speech.length ; i++)
        {
        //    console.log(`speech[i]:`,speech[i]);
                if( speech[i][0]== '%')
                {
                    console.log(`% 들어옴!`);
                    
                   // console.log(`speech[i].substring(1,5)`,speech[i].substring(1,5));
                    if(speech[i].substring(1,5)=='wait')
                    {
                        
                        set_new_speech = set_new_speech.concat(`<break time='`);
                        set_new_speech = set_new_speech.concat(parseInt(speech[i].substring(6,7),10));
                        set_new_speech = set_new_speech.concat(`00ms'/>`);
                        //console.log(`set_new_speech:`,set_new_speech);
                    }
                    else if(speech[i].substring(1,8)=='shuffle')
                    {
                        console.log(`shuffle 들어옴!!`);
                        if(speech[i].substring(9,10)=='s')
                        {
                            console.log(`shuffle _s들어옴!!`);
                            state=1;
                            
                        }
                        else if(speech[i].substring(9,10)=='e')
                        {
                             console.log(`shuffle _e들어옴!!`);
                            state=0;
                            
                            for (var k = speech_when_state1.length - 1; k > 0; k--)
                            {
                                   let j = Math.floor(Math.random() * (k + 1));
                                    [speech_when_state1[k], speech_when_state1[j]] = [speech_when_state1[j], speech_when_state1[k]];
                            }
                            
                            for( var k = 0  ; k <speech_when_state1.length ; k++)
                            {
                                set_new_speech = set_new_speech.concat(` `+speech_when_state1[k]+`. `);
                            }
                            set_new_speech = set_new_speech.concat(` `);
                                
                        }
                        
                    }
                    else if(speech[i].substring(1,6)=='today')
                    {
                        console.log(`today 들어옴!`);
                        if(speech[i].substring(7,10)=='day')
                        {
                        
                            var aa = new Date();
                            var day= aa.getDay(); //요일
                            if(day==1) set_new_speech = set_new_speech.concat(`Monday! `);
                            else if(day==2) set_new_speech = set_new_speech.concat(`Thuesday! `);
                            else if(day==3) set_new_speech = set_new_speech.concat(`Wednesday! `);
                            else if(day==4) set_new_speech = set_new_speech.concat(`Thursday! `);
                            else if(day==5) set_new_speech = set_new_speech.concat(`Friday! `);
                            else if(day==6) set_new_speech = set_new_speech.concat(`Saturday! `);
                            else if(day==7) set_new_speech = set_new_speech.concat(`Sunday! `);
                        }
                        else if(speech[i].substring(7,14)=='weather')
                        {
                            
                                    set_new_speech = set_new_speech.concat(dynamo_db.attributes['weather']);

                        }
                        

                    }
                    else if(speech[i].substring(1,5)=='beep')
                    {
                        set_new_speech = set_new_speech.concat(` <say-as interpret-as='expletive'>.ong.</say-as> `);
                    }
                    else if(speech[i].substring(1,6)=='sound')
                    {
                        
                        var soundfilename = speech[i].substring(7,speech[i].length);
                        //console.log(`변환중 soundfilename:`,soundfilename);
                        var soundfilenamesplit = soundfilename.split(`-`);
                        //console.log(`soundfilenamesplit:`,soundfilenamesplit);
                        set_new_speech = set_new_speech.concat(`<audio src='https://s3.amazonaws.com/eduai/`+soundfilenamesplit[0]+`/`);
                        if(soundfilenamesplit[1][0]=='u')
                        {
                            
                            set_new_speech = set_new_speech.concat(soundfilenamesplit[1]+`/`+soundfilenamesplit[2]+`/`+soundfilename+`.mp3'/> `);
                        }
                        else
                        {
                            set_new_speech = set_new_speech.concat(soundfilename+`.mp3'/> `);
                        }
                        
                    }
                    else if(speech[i].substring(1,6)=='speed')
                    {
                        var speed = parseInt(speech[i].substring(7,8),10);
                        var startorstop = speech[i].substring(9,10);
                        var Speed_S =`<prosody rate='medium'>` ;
                        if(speed==1)
                        {
                            Speed_S =`<prosody rate='x-slow'>` ;
                        }
                        else if(speed ==2)
                        {
                            Speed_S =`<prosody rate='slow'>` ;
                        }
                        else if(speed ==3)
                        {
                            Speed_S =`<prosody rate='medium'>` ;
                        }
                        else if(speed ==4)
                        {
                            Speed_S =`<prosody rate='fast'>` ;
                        }
                        else if(speed ==5)
                        {
                            Speed_S =`<prosody rate='x-fast'>` ;
                        }
                        
                        if(startorstop =='s')
                        {
                            set_new_speech = set_new_speech.concat(Speed_E+` `+Speed_S);
                        }
                        else if(startorstop=='e')
                        {
                            set_new_speech = set_new_speech.concat(Speed_E+` `+originspeed);//여기 인자로 받아올것
                        }
                        
                    }
                    else
                    {
                        set_new_speech = set_new_speech.concat(`/`+speech[i]+`/`);
                    }
                }
                else if(speech[i][0]== '#')
                {
                     var dbname = speech[i].substring(1,speech[i].length-1);
                    //console.log(`으아:`,dbname);
               
                    if(dynamo_db.attributes[dbname])
                    {
                        set_new_speech = set_new_speech.concat(dynamo_db.attributes[dbname]+` `);
                    }
                    else
                    {
                            if(dbname=='temp5')
                            {
                                for(var k = 0 ; k<student_info.length;k++)
                                {
                                    //console.log(`갸악:`,student_info[k]['name'])
                                    if(dynamo_db.attributes['oauth_user_id']==student_info[k]['id'])
                                    {
                                        set_new_speech = set_new_speech.concat(student_info[k]['name']+` `);
                                        break;
                                    }
                                }
                                //set_new_speech = set_new_speech.concat(dynamo_db.attributes[dbname]+` `);
                            }
                            else
                            {
                                set_new_speech = set_new_speech.concat(`#can't load things# `);
                            }
                    }
                }
                else
                {
                    if(state==0)
                    {
                        set_new_speech = set_new_speech.concat(speech[i]);
                    }
                    else
                    {
                        speech_when_state1 = speech[i].split(` `);
                    }
                }
        }
       return set_new_speech;
}



function valid_test(dynamo_db)
{
    var valid_ok=0;
    for(var k=0 ; k<5;k++)
    {
            if(dynamo_db.attributes['oauth_user_id']==student_info[k]['id'])
            {
                             valid_ok=1;
                             break;
            }
    }
    return valid_ok;
}




exports.handler = function (event, context, callback) {
    
     var tmp = JSON.parse(JSON.stringify(event));
    if(tmp.session)
    { 
        console.log(`#################alexaskill###################`);
        const alexa = Alexa.handler(event, context, callback);
        alexa.appId = APP_ID;
        
        alexa.dynamoDBTableName ='2018_10_23_speakingwizard_final_t1';
        alexa.registerHandlers(handlers);
        alexa.execute();
    }
    else
    {
        
        console.log(`#################keepwarm###################`);
        //callback(null,'Finished');
    }
};

var APP_ID = 'amzn1.ask.skill.c847e0ff-c24e-4c7d-9734-5d1d99a3e8e9'; //operation server

var config = {
  host     : '125.60.70.87',//'10.0.0.108,53380',
  port     : '43306',
  user     : 'SW_lambda',
  password : 'L!Sokiyoung123!@#',
  database : 'EDUAI',
};


/*
var APP_ID = 'amzn1.ask.skill.bca668b6-9bc2-493a-85a5-e09c8a215e46';
var config = {
  host     : '125.60.70.36',//'10.0.0.108,53380',
  port     : '43306',
  user     : 'app_eduai',
  password : 'Dpebdpdldkdl12%#%',
  database : 'EDUAI',
};
*/
