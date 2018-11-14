// TODO: Next cool thing to do
//   - Add check boxes next to all of the electives
//   - Also an [Update] button
//   - Selecting and updating will include those courses as an after createPlan strategy

// TODO: Provide a space to type in courses that are transfered in
//   - People are going to want to transfer in MATH 100, MATH 145 and so on

// TODO: Provide a space to submit ACT scores
//   - NAW.... we're not screwing with gen ed stuff
//   - If they want MATH 100 credit, just add it to the transfer section.

function sleep(millis)
{
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}

var termList = {0:"Interim", 1:"Spring", 2:"Fall"};

class Course {

  constructor(id, title, offering, credits, preReqs) {
    this.id = id;
    this.title = title;
    this.offering = offering;
    this.credits = credits;
    this.preReqs = preReqs;
    this.coReqs = [];
    this.doubleTake = false;
    this.maturityNudge = -1;
  }

  print() {
    console.log(this.id + ": " + this.title);
    console.log("  Offering: " + this.offering);
    console.log("  preReqs: " + this.preReqs);
  }
}

class Major {
  constructor(name){
    this.name = name;
    this.requirements = [];
  }

  // Current requires that all simple reqs are added first
  // so that complex reqs can be pruned when added
  addReqs(reqs) {
    for (var i=0, len=reqs.length; i < len; i++) {
      if (Array.isArray(reqs[i])) {
        // Complex requirement
        var validOptions = [];
        var options;
        if (Number.isInteger(reqs[i][0])) {
          // Dealing with a credit requirement
          options = reqs[i][1]; 
        } else {
          // Dealing with (choose one of the following) requirement
          options = reqs[i];
        }

        // Assess validity of each options w.r.t. major requirements
        // TODO: Add this functionality to a prune() function that's called
        //       on each call to addReqs. That way the order of addition
        //       doesn't matter. We can go back and validate complex reqs.
        for (var j=0, jlen=options.length; j < jlen; j++) {
          // Check to see if option is already a major requirement
          var valid = true;
          for (var z=0, zlen=this.requirements.length; z < zlen; z++) {
            if (options[j] == this.requirements[z]) {
              valid = false;
              break;
            }
          }
          if (valid) {
            validOptions.push(options[j]);
          }
        }
        
        if (Number.isInteger(reqs[i][0])) {
          // Dealing with a credit requirement
          this.requirements.push([reqs[i][0], validOptions]);
        } else {
          // Dealing with (choose one of the following) requirement
          this.requirements.push(validOptions);
        }
      } else {
        // Simple requirement
        this.requirements.push(reqs[i]);
      }
    }
  }
}

var CS_Major = ["CMSC 181","CMSC 182","CMSC 190","CMSC 280","CMSC 310","CMSC 321","CMSC 331","CMSC 351","CMSC 360","CMSC 390","CMSC 391","CMSC 405","CMSC 420","CMSC 431","CMSC 432","CMSC 440","CMSC 452","CMSC 480","CMSC 481","CMSC 491","MATH 140","MATH 143","MATH 160","MATH 161","MATH 240","MATH 260","MATH 322","MATH 361","MATH 371"];
var MATH_CAP_ELEC =["MATH 160","MATH 161","MATH 260","MATH 322","MATH 361","MATH 433","MATH 140","MATH 320","MATH 330","MATH 341","MATH 352","MATH 371","MATH 432","MATH 460","MATH 470"];

var catalog = {};
catalog["CMSC 160"]=new Course("CMSC 160", "Intro to Computer Programming", "S", 3, []);
catalog["CMSC 181"]=new Course("CMSC 181", "Computer Science I", "FS", 3, []);
catalog["CMSC 182"]=new Course("CMSC 182", "Computer Science II", "S", 3, ["CMSC 181"]);
catalog["CMSC 190"]=new Course("CMSC 190", "Introduction to Information Technology", "OddS", 3, [["CMSC 160","CMSC 181"]]);
catalog["CMSC 280"]=new Course("CMSC 280", "Compute Architecture", "F", 4, ["CMSC 182"]);
catalog["CMSC 310"]=new Course("CMSC 310", "Algorithms", "S", 3, ["CMSC 182"]);
catalog["CMSC 321"]=new Course("CMSC 321", "Database Management Systems", "EvenF", 3, ["CMSC 182"]);
catalog["CMSC 331"]=new Course("CMSC 331", "Web Application Development", "OddS", 3, ["CMSC 182"]);
catalog["CMSC 351"]=new Course("CMSC 351", "User Interface Design and Development", "EvenS", 3, ["CMSC 182"]);
catalog["CMSC 360"]=new Course("CMSC 360", "Software Engineering", "OddF", 3, ["CMSC 182"]);
catalog["CMSC 390"]=new Course("CMSC 390", "Computational Science", "EvenI", 3, ["CMSC 182", "MATH 160"]);
catalog["CMSC 391"]=new Course("CMSC 391", "Topics in Computer Science", "EvenS", 3, ["CMSC 182"]);
catalog["CMSC 391"].doubleTake = true;
catalog["CMSC 405"]=new Course("CMSC 405", "Artificial Intelligence", "EvenF", 3, ["CMSC 310"]);
catalog["CMSC 420"]=new Course("CMSC 420", "Programming Languages and Compilers", "EvenF", 3, ["CMSC 280", "CMSC 310"]);
catalog["CMSC 431"]=new Course("CMSC 431", "Networks and Distributed Systems", "OddS", 3, ["CMSC 182"]);
catalog["CMSC 431"].maturityNudge = 8;
catalog["CMSC 432"]=new Course("CMSC 432", "Operating Systems", "OddF", 3, ["CMSC 182"]);
catalog["CMSC 432"].maturityNudge = 8;
catalog["CMSC 440"]=new Course("CMSC 440", "Theory of Computation", "OddS", 3, ["CMSC 182", "MATH 143"]);
catalog["CMSC 452"]=new Course("CMSC 452", "Computer Security", "EvenS", 3, ["CMSC 280"]);
catalog["CMSC 452"].maturityNudge = 8;
catalog["CMSC 480"]=new Course("CMSC 480", "Computer Science Capstone Proposal", "F", 1, [[37, CS_Major]]);
catalog["CMSC 481"]=new Course("CMSC 481", "Computer Science Capstone", "S", 2, ["CMSC 480"]);
catalog["CMSC 491"]=new Course("CMSC 491", "Topics in Computer Science", "OddF", 3, ["CMSC 182"]);
catalog["CMSC 491"].doubleTake = true;

catalog["MATH 100"]=new Course("MATH 100", "Algebra Review", "FS", 3, []);
catalog["MATH 140"]=new Course("MATH 140", "Elementary Applied Statistics", "FS", 4, ["MATH 100"]);
catalog["MATH 143"]=new Course("MATH 143", "Discrete Mathematics", "F", 3, ["MATH 100"]);
catalog["MATH 145"]=new Course("MATH 145", "Elementary Functions", "FS", 3, ["MATH 100"]);
catalog["MATH 160"]=new Course("MATH 160", "Calculus I: Elementary Applied Calculus", "FS", 4, ["MATH 145"]);
catalog["MATH 161"]=new Course("MATH 161", "Calculus II: Theory and Applications", "FS", 4, ["MATH 160"]);
catalog["MATH 240"]=new Course("MATH 240", "Foundations of Advanced Mathematics", "F", 3, []);
catalog["MATH 240"].coReqs = ["MATH 161"];
catalog["MATH 260"]=new Course("MATH 260", "Calculus III: Intermediate Calculus", "F", 3, ["MATH 161"]);
catalog["MATH 261"]=new Course("MATH 261", "Calculus IV: Multivariable Calculus", "S", 3, ["MATH 260"]);
catalog["MATH 320"]=new Course("MATH 320", "History of Mathematics", "OddF", 3, ["MATH 240"]);
catalog["MATH 322"]=new Course("MATH 322", "Linear Algebra", "EvenS", 3, ["MATH 161", "MATH 240"]);
catalog["MATH 330"]=new Course("MATH 330", "Applied Regression Analysis", "EvenS", 3, [["MATH 140", "MATH 433"]]);
catalog["MATH 341"]=new Course("MATH 341", "Modern Algebra", "EvenS", 3, ["MATH 240"]);
catalog["MATH 352"]=new Course("MATH 352", "Elements of Geometry", "OddS", 3, ["MATH 240"]);
catalog["MATH 361"]=new Course("MATH 361", "Differential Equations", "S", 3, ["MATH 161"]);
catalog["MATH 371"]=new Course("MATH 371", "Numerical Analysis", "OddF", 3, ["MATH 161"]);
catalog["MATH 432"]=new Course("MATH 432", "Probability & Mathematical Statistics I", "EvenF", 3, ["MATH 161", "MATH 240"]);
catalog["MATH 433"]=new Course("MATH 433", "Probability & Mathematical Statistics II", "OddS", 3, ["MATH 432"]);
catalog["MATH 460"]=new Course("MATH 460", "Complex Variables", "AN", 3, ["MATH 240", "MATH 260"]);
catalog["MATH 470"]=new Course("MATH 470", "Intermediate Analysis", "OddS", 3, ["MATH 240"]);
catalog["MATH 480"]=new Course("MATH 480", "Senior Capstone", "F", 3, ["MATH 240", "MATH 261", [17, MATH_CAP_ELEC]]);// XXX: Should be 18, but major requirements don't have enough non-elective to suffice alone

catalog["BUSN 100"]=new Course("BUSN 100", "Contemporary Business & Free Enterprise", "FS", 3, []);
catalog["MGMT 205"]=new Course("MGMT 205", "Decision Science Foundations", "FS", 2, ["MATH 140"]);
catalog["DATA 200"]=new Course("DATA 200", "Intro to Data Science & Analytics", "S", 3, ["CMSC 181","MATH 100"]);
catalog["DATA 201"]=new Course("DATA 201", "Big Data Analytics", "F", 3, ["DATA 200", "CMSC 182"]);
catalog["DATA 300"]=new Course("DATA 300", "Machine Learning I", "F", 3, ["DATA 201","CMSC 310","MATH 322"]);
catalog["DATA 300"].coReqs = ["MATH 432"];
catalog["DATA 301"]=new Course("DATA 301", "Machine Learning II", "S", 3, ["DATA 300"]);
catalog["DATA 305"]=new Course("DATA 305", "Data Mining", "F", 3, ["DATA 201","CMSC 310","MATH 322"]);
catalog["DATA 305"].coReqs = ["MATH 432"];
catalog["DATA 400"]=new Course("DATA 400", "Data Science & Analytics Capstone", "S", 3, []);
catalog["DATA 400"].coReqs = ["DATA 301"];


var CS_Core = ["CMSC 181", "CMSC 182", "CMSC 280", "CMSC 310", "MATH 143"];
var CS_UpperCore = ["CMSC 321", "CMSC 331", "CMSC 360", "CMSC 432", "CMSC 480", "CMSC 481", "MATH 160"];
var CS_300Above = [[6,["CMSC 310", "CMSC 321", "CMSC 331", "CMSC 351", "CMSC 360", "CMSC 390", "CMSC 391", "CMSC 405", "CMSC 420", "CMSC 431", "CMSC 432", "CMSC 440", "CMSC 452", "CMSC 480", "CMSC 481", "CMSC 491"]]];
var CS_300AboveMinor = [[6,["CMSC 310", "CMSC 321", "CMSC 331", "CMSC 351", "CMSC 360", "CMSC 390", "CMSC 391", "CMSC 405", "CMSC 420", "CMSC 431", "CMSC 432", "CMSC 440", "CMSC 452", "CMSC 491"]]];

var BVU_Majors = [];

var CS_Minor = new Major("Computer Science Minor");
CS_Minor.addReqs(CS_Core);
CS_Minor.addReqs(CS_300AboveMinor);
BVU_Majors["CMSC_MINOR"] = CS_Minor;

var CS_Systems = new Major("Computer Science - Systems Track");
CS_Systems.addReqs(CS_Core);
CS_Systems.addReqs(CS_UpperCore);
CS_Systems.addReqs(["CMSC 420", "CMSC 431", "CMSC 452", "MATH 161"]);
CS_Systems.addReqs(CS_300Above);
BVU_Majors["CMSC_SYS"] = CS_Systems;

var CS_IT = new Major("Computer Science - Information Technology Track");
CS_IT.addReqs(CS_Core);
CS_IT.addReqs(CS_UpperCore);
CS_IT.addReqs(["CMSC 190", "CMSC 351", "CMSC 452", "MATH 140"]);
CS_IT.addReqs(CS_300Above);
BVU_Majors["CMSC_IT"] = CS_IT;

var CS_MATH = new Major("Computer Science - Mathematics Track");
CS_MATH.addReqs(CS_Core);
CS_MATH.addReqs(CS_UpperCore);
CS_MATH.addReqs([["CMSC 440", "CMSC 390"], "MATH 161", "MATH 240", ["MATH 260", "MATH 361"], "MATH 322", "MATH 371"]);
BVU_Majors["CMSC_MATH"] = CS_MATH;

var DATA_MAJOR = new Major("Data Science and Analytics");
DATA_MAJOR.addReqs(["BUSN 100","CMSC 181","CMSC 182","CMSC 310","DATA 200","DATA 201","DATA 300","DATA 301","DATA 305","DATA 400","MATH 140","MATH 160","MATH 161","MATH 240","MATH 322","MATH 330","MATH 432","MGMT 205"]);
BVU_Majors["DATA_MAJOR"] = DATA_MAJOR;

var DATA_MINOR = new Major("Data Science and Analytics Minor");
DATA_MINOR.addReqs(["BUSN 100","CMSC 181","CMSC 182","DATA 200","DATA 201","MATH 140","MGMT 205"]);
BVU_Majors["DATA_MINOR"] = DATA_MINOR;

var MATH_MAJOR = new Major("Mathematics");
MATH_MAJOR.addReqs(["MATH 160","MATH 161","MATH 240","MATH 260","MATH 261","MATH 322","MATH 361",["MATH 433", "MATH 140"],"MATH 480"]);
MATH_MAJOR.addReqs([[9, ["MATH 320","MATH 330","MATH 341","MATH 352","MATH 371","MATH 432","MATH 460","MATH 470"]]]);
BVU_Majors["MATH_MAJOR"] = MATH_MAJOR;

var MATH_MINOR = new Major("Mathematics Minor");
MATH_MINOR.addReqs(["MATH 160","MATH 161","MATH 240","MATH 260","MATH 261","MATH 361"]);
BVU_Majors["MATH_MINOR"] = MATH_MINOR;



// Walk until you find the condition satisfied
//   Found: Walk until you can place the course
//   Not Found: Bail out, you'll place it later
// Input Values
//   - req: An array of ALL pre-requisites required by the course
// Return Value
//   Found: term Iterator of when preReq is satisfied
//   Not Found: -1
function reqSatisfied(preReqList) {
  //console.log("Testing for satisfaction of requirements("+req+") isArray:"+Array.isArray(req));
  // No Prereq
  if (preReqList.length === 0)
    return entryTerm;

  // Identify maxYear so that we can stop iteration (no future courses planned)
  var years = Object.keys(plan);
  years = years.map(function(x){ return parseInt(x); });
  years.sort(function(a,b){ return a-b; });
  var maxYear = years[years.length-1];

  var earliestTermList = [];

  for(var zzz=0; zzz < preReqList.length; zzz++) {
    var req = preReqList[zzz];

    if (Array.isArray(req)===false) {
      //console.log("================ SIMPLE REQ ================== looking for("+req+")");
      // Simple Req -- just find the course in the plan and return the term after its location
      var satisfied = false;
      for(var it=entryTerm; Math.floor(it/3) <= maxYear; it++) {
        var currTerm = it%3;
        var currYear = Math.floor(it/3);
        if (typeof plan[currYear] !== "undefined" && typeof plan[currYear][currTerm] !== "undefined") {
          if (plan[currYear][currTerm].includes(req)) {
            earliestTermList.push(it+1);
            satisfied = true;
            break;
          }
        }
      }
      if (satisfied === false)
        return -1;
    } else if (Number.isInteger(req[0])) {
      // Take n credits from
      var satisfied = false;
      var creditsRemaining = req[0];
      var coursesAvailable = req[1].slice();
      for(var it=entryTerm; Math.floor(it/3) <= maxYear; it++) {
        var currTerm = it%3;
        var currYear = Math.floor(it/3);
        if (typeof plan[currYear] !== "undefined" && typeof plan[currYear][currTerm] !== "undefined") {
          // Valid term with classes in it
          for(var i=0; i < coursesAvailable.length; i++) {
            if (plan[currYear][currTerm].includes(coursesAvailable[i])) {
              creditsRemaining -= catalog[coursesAvailable[i]].credits;
              //console.log("  - creditsRemaining: "+creditsRemaining +" - took: "+coursesAvailable[i] +" at index: "+i);
              //sleep(500);
              if (creditsRemaining <= 0) {
                earliestTermList.push(it+1);
                satisfied = true;
                break;
              }
              if (catalog[coursesAvailable[i]].doubleTake === false) {
                coursesAvailable.splice(i,1);
                i-=1;
              }
            }
          }
          if (satisfied === true)
            break;
        }
      }
      if (creditsRemaining > 0)
        return -1;
    } else {
      console.log("===== you are required to take one of the following: ["+req+"]");
      // Take one of the following
      var satisfied = false;
      for(var it=entryTerm; Math.floor(it/3) <= maxYear; it++) {
        var currTerm = it%3;
        var currYear = Math.floor(it/3);
        if (typeof plan[currYear] !== "undefined" && typeof plan[currYear][currTerm] !== "undefined") {
          // Valid term with classes in it
          for(var i=0; i < req.length; i++) {
            if (plan[currYear][currTerm].includes(req[i])) {
              earliestTermList.push(it+1);
              satisfied = true;
              break;
            }
          }
        }
        if (satisfied === true)
          break;
      }
      if (satisfied === false)
        return -1;
    }
  }

  // Find max of earliestTermList and return it
  earliestTermList.sort(function(a,b){ return a-b; });
  return earliestTermList[earliestTermList.length-1];
}


function courseOffered(courseName, termID) {
  var term;
  switch(termID%3) {
    case 0:
      term = "Interim"; break;
    case 1:
      term = "Spring"; break;
    case 2:
      term = "Fall"; break;
  }
  var year = entryYear + Math.floor(termID/3);
  var evenYear = (year%2===0);

  var offering = catalog[courseName].offering;
  //console.log(" - courseOffered("+courseName+", "+termID+")  Offering("+offering+") Checking "+term+" "+year);

  if (offering === "FS" && term !== "Interim") return true;
  if (offering === "F" && term === "Fall") return true;
  if (offering === "S" && term === "Spring") return true;
  if (offering === "EvenF" && term === "Fall" && evenYear === true) return true;
  if (offering === "OddF" && term === "Fall" && evenYear === false) return true;
  if (offering === "EvenS" && term === "Spring" && evenYear === true) return true;
  if (offering === "OddS" && term === "Spring" && evenYear === false) return true;
  if (offering === "EvenI" && term === "Interim" && evenYear === true) return true;
  if (offering === "OddI" && term === "Interim" && evenYear === false) return true;
  return false;
}


function takeCourse(courseName, earliestTermID) {
  // PreReqs should be satisifed -- we're just looking for a sufficient slot
  //console.log("takeCourse("+courseName+","+earliestTermID+")");
  var enrolled = false;
  var termIT = earliestTermID;
  while(enrolled === false) {
    // If course is offered this term 
    if (courseOffered(courseName, termIT) === true) {

      var year = Math.floor(termIT/3);
      var term = termIT%3;
      //console.log("  - Considering "+term+" "+year);
      // If we haven't created an array for this term, do so now
      if (typeof plan[year] === "undefined")
        plan[year] = [];
      if (typeof plan[year][term] === "undefined") {
        plan[year][term] = [];
        plan[year][term].creditCount = 0;
      }
      
      // If there is room to take the course this term
      if (plan[year][term].creditCount + catalog[courseName].credits <= maxCreditsPerTerm && termIT >= catalog[courseName].maturityNudge) {

        // Add course to plan
        plan[year][term].push(courseName);
        // Update credit count
        plan[year][term].creditCount += catalog[courseName].credits;
        enrolled = true;
        //console.log("+++ "+courseName+" taken "+term+" "+(entryYear+year));
      }

    }
    termIT++;
  }
}

// Find out if a course is in the plan
function courseAlreadyTaken(courseName) {
  // Identify maxYear so that we can stop iteration (no future courses planned)
  var years = Object.keys(plan);
  years = years.map(function(x){ return parseInt(x); });
  years.sort(function(a,b){ return a-b; });
  var maxYear = years[years.length-1];

  for(var it=entryTerm; Math.floor(it/3) <= maxYear; it++) {
    var currTerm = it%3;
    var currYear = Math.floor(it/3);
    if (typeof plan[currYear] !== "undefined" && typeof plan[currYear][currTerm] !== "undefined") {
      if (plan[currYear][currTerm].includes(courseName))
        return true;
    }
  }
  return false;
}

function printPlan() {
  // Identify maxYear so that we can stop iteration (no future courses planned)
  var years = Object.keys(plan);
  years = years.map(function(x){ return parseInt(x); });
  years.sort(function(a,b){ return a-b; });
  var maxYear = years[years.length-1];

  for(var it=entryTerm; Math.floor(it/3) <= maxYear; it++) {
    var currTerm = it%3;
    var currYear = Math.floor(it/3);
    if (typeof plan[currYear] !== "undefined" && typeof plan[currYear][currTerm] !== "undefined") {
      console.log(termList[currTerm] + " " + (entryYear+currYear));
      for(var i=0; i < plan[currYear][currTerm].length; i++) {
        var courseID = plan[currYear][currTerm][i];
        console.log("  - "+courseID+": "+catalog[courseID].title);
      }
      console.log("  - Total Credits: "+plan[currYear][currTerm].creditCount);
    }
  }
  return false;
}

function reqIsSingleCourse(req) {
  return (Array.isArray(req) === false);
}

function takePreReqs(preReqs) {
  console.log("takePreReqs("+preReqs+")");
  // For each requirement in preReqs, find out if it is satisified
  for(var i=0; i < preReqs.length; i++) {
    var req = preReqs[i];

    if (reqIsSingleCourse(req)) {
      // Simple, single-course preReq
      if (courseAlreadyTaken(req) === false) {
        // Find out when we can take it
        var earliestTerm = reqSatisfied(catalog[req].preReqs);
        if (earliestTerm !== -1) {
          var earliestCoReqTerm = reqSatisfied(catalog[req].coReqs)-1;
          if (earliestCoReqTerm === -2) {
            //console.log("  Req("+req+"): Can't take it yet -- coReq("+catalog[req].coReqs+") not satisfied yet");
          } else {
            takeCourse(req, Math.max(earliestTerm, earliestCoReqTerm));
          }
        } else {
          // Can't take the preReq because *IT'S* preReqs are not met
          takePreReqs( catalog[req].preReqs );
          takePreReqs( catalog[req].coReqs );
        }
      }
    } else {
      // Complex preReq
      // I can't force them to take anything!!! It's elective!!!
      // Nothing to do here...
    }
  }
}

function createPlan() {
  // Walk through each major the student has
  for (var majorID in majors) {
    console.log(majors[majorID].name);
    var majorComplete;
    do {
      majorComplete = true;
      // Walk through a list of requirements for the major
      for (var i=0, len=majors[majorID].requirements.length; i < len; i++) {
        var req = majors[majorID].requirements[i];

        //sleep(500);
        // If it's a course
        if (reqIsSingleCourse(req)) {
          if (courseAlreadyTaken(req) === false) {
            // We haven't yet taken the course
            // See if we can (or need to) take its preReqs
            takePreReqs(catalog[req].preReqs);
            takePreReqs(catalog[req].coReqs);

            // Find out the earliest we can take the course relative to preReqs
            var earliestTerm = reqSatisfied(catalog[req].preReqs);
            if (earliestTerm !== -1) {
              var earliestCoReqTerm = reqSatisfied(catalog[req].coReqs)-1;
              if (earliestCoReqTerm === -2) {
                console.log("  Req("+req+"): Can't take it yet -- coReq("+catalog[req].coReqs+") not satisfied yet");
                majorComplete = false;
              } else {
                takeCourse(req, Math.max(earliestTerm, earliestCoReqTerm));
                console.log(`earliest:${earliestTerm} earliestCoReqTerm:${earliestCoReqTerm}`);
                console.log("  Req("+req+"): Just took it!");
              }
            } else {
              console.log("  Req("+req+"): Can't take it yet -- elective preReq("+catalog[req].preReqs+") not satisfied yet");
              majorComplete = false;
              // We just can't take it yet -- preReq problem
              // Maybe not enough elective credits yet
              // We'll have to try again later.
              // Nothing to do here...
            }

          } else {
            console.log("  Req("+req+") previously taken");
          }
        } else {
          // If it's an elective... There's nothing we can do... Can't choose it for them!
          // Best we can do is to give them options or something...
          //console.log("  "+req + " Elective -- Your choice!");
        }
      }
    } while(majorComplete === false);
  }
}



var plan=[];

var entryTerm = 2;
var entryYear = 2017;
var maxCreditsPerTerm = 16;

var majors = {};
//majors["CMSC_IT"] = BVU_Majors["CMSC_IT"];
//majors["CMSC_SYS"] = BVU_Majors["CMSC_SYS"];
//majors["CMSC_MATH"] = BVU_Majors["CMSC_MATH"];
//majors["MATH_MAJOR"] = BVU_Majors["MATH_MAJOR"];
//createPlan();
//printPlan();



function createWebPlan() {
  var sel = document.getElementById("entryTerm");
  entryTerm = parseInt(sel.options[sel.selectedIndex].value);
  entryYear = parseInt(document.getElementById("entryYear").value);

  majors = {};
  var fList = document.getElementById("majorSelection").elements;
  for(var i=1; i < fList.length; i++) {
    var elem = fList[i];
    if (elem.checked) {
      majors[elem.id] = BVU_Majors[elem.id];
    }
    console.log(`fList[${i}]: id:${elem.id}, checked:${elem.checked}`);
    //console.log("fList["+i+"]: "+fList[i].checked);
  }

  var planDiv = document.getElementById("plan");

  if (Object.keys(majors).length===0) {
    planDiv.innerHTML = "Pick a major!";
    return;
  }

  plan=[];
  createPlan();


  // Identify maxYear so that we can stop iteration (no future courses planned)
  var years = Object.keys(plan);
  years = years.map(function(x){ return parseInt(x); });
  years.sort(function(a,b){ return a-b; });
  var maxYear = years[years.length-1];
  var terms = Object.keys(plan[maxYear]);
  terms = terms.map(function(x){ return parseInt(x); });
  terms.sort(function(a,b){ return a-b; });
  var maxTerm = terms[terms.length-1];
  var maxIT = 3*maxYear + maxTerm;


  var html = "";
  html += '<div class="yearRow">';
  var firstTime = true;

  var renderInterim = false;

  // Blank boxes for non-fall starts
  if (entryTerm<2)
    html += '<div class="emptyTermBox"></div>';
  if (entryTerm===1 && renderInterim)
    html += '<div class="emptyTermBox"></div>';

  for(var it=entryTerm; it <= maxIT; it++) {
    var currTerm = it%3;
    var currYear = Math.floor(it/3);

    if (currTerm === 0 && renderInterim === false)
      continue;

    if (currTerm === 2) {
      if (firstTime && entryTerm===2)
        firstTime = false;
      else
        html += '</div><div class="yearRow">';
    }

    html += '<div class="termBox">';

    html += '<h3>'+termList[currTerm]+' '+(entryYear+currYear)+'</h3>';
    if (typeof plan[currYear] !== "undefined" && typeof plan[currYear][currTerm] !== "undefined") {
      for(var i=0; i < plan[currYear][currTerm].length; i++) {
        var course = catalog[plan[currYear][currTerm][i]];
        html += `<div class="credits">${course.credits}</div>`;
        html += `<div>${course.id}: ${course.title}</div>`;
      }
      html += `<div class="credits" style="margin-top: 5px;"><b>Total: ${plan[currYear][currTerm].creditCount}</b></div>`;

    }
    html += "</div>";
  }
  html += "</div>";

  planDiv.innerHTML = html;

  var elecDiv = document.getElementById("electives");
  elecDiv.innerHTML = "";
  var elecHtml = "";

  // Walk through the majors again
  for (var majorID in majors) {
    // Walk through requirements
    var firstTime = true;
    for (var i=0, len=majors[majorID].requirements.length; i < len; i++) {
      var req = majors[majorID].requirements[i];
      // Only pay attention to complex, elective requirements that aren't satisfied
      if (reqIsSingleCourse(req)===false && reqSatisfied([req]) === -1) {
        console.log(`reqSatisfied(${req}) := ${reqSatisfied([req])}`);

        if (firstTime) {
          firstTime = false;
          elecHtml += `<h3>Additional required courses for ${majors[majorID].name}</h3>`;
        }
        // Choose one of the following
        if (Number.isInteger(req[0])===false) {
          elecHtml += '<h4>&nbsp;&nbsp;&nbsp;Choose one of the following</h4><ul>';
          for(var j=0; j < req.length; j++) {
            var course = catalog[req[j]];
            elecHtml += `<li>${course.id}: ${course.title} (${course.offering}, ${course.credits}cr)</li>`;
          }
          elecHtml += '</ul>';
        }
        else { 
        // Chose n credits from the following
          elecHtml += `<h4>&nbsp;&nbsp;&nbsp;Choose ${req[0]} credits from the following</h4><ul>`;
          for(var j=0; j < req[1].length; j++) {
            var course = catalog[req[1][j]];
            elecHtml += `<li>${course.id}: ${course.title} (${course.offering}, ${course.credits}cr)</li>`;
          }
          elecHtml += '</ul>';
        }
      }
    }
  }
  elecDiv.innerHTML += elecHtml;
}


