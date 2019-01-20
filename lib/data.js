/*
* Library for storing and editing the data
*
*/

//Dependencies

var fs = require('fs');
var path = require('path')

//Container for this module (to be exported)
var lib = {};

//base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');

//write data to a file
lib.create = function(dir,file,data,callback){
    //open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
            var stringData = JSON.stringify(data);
            
            //write to file and close it
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false);
                        }
                        else{
                            callback('Error in closing the file');
                        }
                    });
                }
                else{
                    callback('Error writing to new file');
                }
            });

        }
        else{
            callback("Could not create new file, it may already exist");
        }
    });
};

// read file from file
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
        callback(err,data);
    });
}

//update data inside a file
lib.update = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if(!err & fileDescriptor){
            //convert data to string
            var stringData = JSON.stringify(data);

            //Truncate the file
            fs.truncate(fileDescriptor,function(err){
                if(!err){
                    //write to the file and close it
                    fs.writeFile(fileDescriptor,stringData,function(err){
                        if(!err){
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false);
                                }
                                else{
                                    callback("Error in closing the existing file");
                                }
                            });
                        }
                        else{
                            callback("Error in writing to the existing file")
                        }
                    });
                }
                else{
                    callback("Error in truncating the file");
                }
            });
        }
        else{
            callback('Could not open the file for update, it may not exist yet');
        }
    });
};

//Delete a file
lib.delete = function(dir,file,callback){
    //unlink the file from filesystem
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        }
        else{
            callback("Error in deleting the file");
        }
    });
};




//export the module
module.exports = lib;